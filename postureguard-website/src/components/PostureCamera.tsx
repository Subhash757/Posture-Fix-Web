"use client";

import { useEffect, useRef, useState } from "react";
import { PoseLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

export default function PostureCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [hasStarted, setHasStarted] = useState(false);
  const [status, setStatus] = useState<"Loading..." | "Good Posture" | "Bad Posture! Adjust!">("Loading...");
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);

  const playBeep = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime); // High pitch beep
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.error("Audio beep failed:", e);
    }
  };

  const getStreamAndSetVideo = async (deviceId?: string) => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const currentStream = videoRef.current.srcObject as MediaStream;
        currentStream.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: deviceId 
          ? { deviceId: { exact: deviceId }, width: 640, height: 480 } 
          : { width: 640, height: 480, facingMode: "user" }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          if (poseLandmarkerRef.current) {
            predictWebcam(poseLandmarkerRef.current);
          }
        };
      }

      // Enumerate devices after getting permission
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === "videoinput");
      setCameras(videoDevices);
      
      if (!deviceId && videoDevices.length > 0) {
        // If we didn't specify one, just set the dropdown to the active one (or first one)
        const activeTrack = stream.getVideoTracks()[0];
        const activeDevice = videoDevices.find(d => d.label === activeTrack.label);
        if (activeDevice) {
          setSelectedCameraId(activeDevice.deviceId);
        } else {
          setSelectedCameraId(videoDevices[0].deviceId);
        }
      } else if (deviceId) {
        setSelectedCameraId(deviceId);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to access camera.");
    }
  };

  const startCamera = async () => {
    setHasStarted(true);
    setStatus("Loading...");
    setError(null);

    // Try playing a silent beep on user interaction to unlock audio context in browsers
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        ctx.resume();
      }
    } catch(e) {}

    try {
      if (!poseLandmarkerRef.current) {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "GPU"
          },
          runningMode: "VIDEO",
          numPoses: 1
        });
      }

      await getStreamAndSetVideo();

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to start camera or load model.");
      setHasStarted(false);
    }
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedCameraId(newId);
    getStreamAndSetVideo(newId);
  };

  let lastVideoTime = -1;
  let currentPostureState: "good" | "bad" = "good";
  let postureTransitionStart: number | null = null;
  let lastHelloTime = 0;

  const predictWebcam = (poseLandmarker: PoseLandmarker) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    const drawingUtils = new DrawingUtils(canvasCtx);

    const renderLoop = () => {
      // Exit loop if stopped
      if (!videoRef.current || !videoRef.current.srcObject) return;

      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        
        const startTimeMs = performance.now();
        poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw video frame to canvas
          canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);

          let isBadPosture = false;

          if (result.landmarks && result.landmarks.length > 0) {
            const landmarks = result.landmarks[0];
            
            // Draw landmarks
            drawingUtils.drawLandmarks(landmarks, {
              radius: 3,
              color: "#f57542"
            });
            drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, {
              color: "#0ea5e9",
              lineWidth: 2
            });

            // Posture Logic
            const leftShoulderY = landmarks[11]?.y;
            const rightShoulderY = landmarks[12]?.y;
            const leftEarY = landmarks[7]?.y;
            const rightEarY = landmarks[8]?.y;
            
            // Hand landmarks
            const leftWristY = landmarks[15]?.y;
            const rightWristY = landmarks[16]?.y;

            if (leftShoulderY && rightShoulderY && leftEarY && rightEarY) {
              const avgShoulderY = (leftShoulderY + rightShoulderY) / 2;
              const avgEarY = (leftEarY + rightEarY) / 2;
              
              // Neck Bent / Slouch Check
              if (avgShoulderY - avgEarY < 0.18) {
                isBadPosture = true;
              }

              // Waving / Hello Check (Hand raised above the shoulder)
              const isLeftHandRaised = leftWristY && leftWristY < leftShoulderY - 0.1;
              const isRightHandRaised = rightWristY && rightWristY < rightShoulderY - 0.1;

              if (isLeftHandRaised || isRightHandRaised) {
                if (performance.now() - lastHelloTime > 5000) { 
                  lastHelloTime = performance.now();
                  try {
                    const utterance = new SpeechSynthesisUtterance("Hello boss! Posture is looking good!");
                    const voices = window.speechSynthesis.getVoices();
                    const femaleVoice = voices.find(v => v.name.toLowerCase().includes('female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female')) || voices[0];
                    if (femaleVoice) utterance.voice = femaleVoice;
                    utterance.rate = 1.1;
                    window.speechSynthesis.speak(utterance);
                  } catch(e) {}
                }
              }
            }
          }

          if (isBadPosture) {
            setStatus("Bad Posture! Adjust!");
            canvasCtx.fillStyle = "rgba(255, 0, 0, 0.2)";
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
            document.body.style.transition = "background-color 0.3s ease";
            document.body.style.backgroundColor = "rgba(239, 68, 68, 0.15)"; // Red tinted background

            if (currentPostureState === "good") {
              if (postureTransitionStart === null) {
                postureTransitionStart = performance.now();
              } else if (performance.now() - postureTransitionStart > 2000) {
                currentPostureState = "bad";
                postureTransitionStart = null;
                playBeep();
                try {
                  const utterance = new SpeechSynthesisUtterance("Sit correctly man!");
                  const voices = window.speechSynthesis.getVoices();
                  const femaleVoice = voices.find(v => v.name.toLowerCase().includes('female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Zira') || v.name.includes('Victoria')) || voices[0];
                  if (femaleVoice) utterance.voice = femaleVoice;
                  utterance.rate = 1.0;
                  window.speechSynthesis.speak(utterance);
                } catch(e) {}
              }
            } else {
              postureTransitionStart = null;
            }
          } else {
            setStatus("Good Posture");
            canvasCtx.fillStyle = "rgba(0, 255, 0, 0.05)";
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
            document.body.style.transition = "background-color 0.5s ease";
            document.body.style.backgroundColor = ""; // Reset background

            if (currentPostureState === "bad") {
              if (postureTransitionStart === null) {
                postureTransitionStart = performance.now();
              } else if (performance.now() - postureTransitionStart > 1000) {
                currentPostureState = "good";
                postureTransitionStart = null;
                try {
                  const utterance = new SpeechSynthesisUtterance("Good posture!");
                  const voices = window.speechSynthesis.getVoices();
                  const femaleVoice = voices.find(v => v.name.toLowerCase().includes('female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Zira') || v.name.includes('Victoria')) || voices[0];
                  if (femaleVoice) utterance.voice = femaleVoice;
                  utterance.rate = 1.0;
                  window.speechSynthesis.speak(utterance);
                } catch(e) {}
              }
            } else {
              postureTransitionStart = null;
            }
          }

          canvasCtx.restore();
        });
      }
      requestAnimationFrame(renderLoop);
    };
    
    renderLoop();
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto">
      {/* Control Panel */}
      <div className="bg-card border border-border p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-2 text-center sm:text-left flex-1">
          <h2 className="text-xl font-bold">Camera Feed</h2>
          
          {hasStarted && cameras.length > 1 && (
            <select 
              value={selectedCameraId}
              onChange={handleCameraChange}
              className="mt-2 w-full max-w-xs text-sm bg-background border border-border rounded px-2 py-1 text-foreground"
            >
              {cameras.map(cam => (
                <option key={cam.deviceId} value={cam.deviceId}>
                  {cam.label || `Camera ${cam.deviceId.substring(0, 5)}...`}
                </option>
              ))}
            </select>
          )}

          {!hasStarted && <p className="text-sm text-muted-foreground">Everything runs locally. No data leaves your device.</p>}
        </div>

        {!hasStarted ? (
          <button 
            onClick={startCamera}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 whitespace-nowrap"
          >
            Start Camera
          </button>
        ) : (
          <div className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-bold whitespace-nowrap ${status === 'Good Posture' ? 'bg-secondary/20 text-secondary border border-secondary/50' : status === 'Bad Posture! Adjust!' ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-muted text-muted-foreground'}`}>
            {status}
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {/* Video Container */}
      <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden border border-border flex items-center justify-center shadow-sm">
        {!hasStarted && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M14.5 4h-5L7 21h10Z"/><path d="m11 16-2 5"/><path d="m13 16 2 5"/></svg>
            <p>Camera is currently off</p>
          </div>
        )}
        
        {/* Hidden Video Element */}
        <video 
          ref={videoRef} 
          className="hidden" 
          autoPlay 
          playsInline
        />
        
        {/* Canvas for Drawing */}
        <canvas 
          ref={canvasRef} 
          className={`w-full h-full object-cover ${hasStarted ? 'block' : 'hidden'}`} 
          width={640} 
          height={480}
        />
      </div>
    </div>
  );
}
