import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-muted/30 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Powerful Features, Simple Design</h1>
          <p className="text-xl text-muted-foreground">Everything you need to correct your posture, without the complexity.</p>
        </div>
      </section>
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto space-y-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-4">
              <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-lg text-primary mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/></svg>
              </div>
              <h2 className="text-3xl font-bold">Real-time Visual Feedback</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                PostureGuard AI utilizes MediaPipe to detect 33 3D landmarks on your body through your camera feed. It intelligently overlays these points on your video, providing immediate visual cues. When your posture is healthy, the feedback is green. If you slouch, it instantly turns red.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
