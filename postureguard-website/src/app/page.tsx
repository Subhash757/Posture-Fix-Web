import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 lg:py-32 bg-gradient-to-b from-background to-primary/5">
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            🚀 Now with Live Browser Testing
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
            Fix your posture with <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">AI Computer Vision</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            PostureGuard uses your webcam and advanced machine learning to detect slouching in real-time. No downloads, no data sent to the cloud.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/demo" className="inline-flex items-center justify-center rounded-md text-base font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 w-full sm:w-auto shadow-lg shadow-primary/25">
              Try Live Demo
            </Link>
            <Link href="/features" className="inline-flex items-center justify-center rounded-md text-base font-medium transition-colors bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 h-12 px-8 w-full sm:w-auto">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">The Silent Health Crisis</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hours spent hunched over a keyboard lead to chronic back pain, neck strain, and reduced productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-muted/30 border border-border flex flex-col items-center text-center space-y-4 transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M12 2v20"/></svg>
              </div>
              <h3 className="text-xl font-bold">Real-time Tracking</h3>
              <p className="text-muted-foreground">Monitors 33 3D body landmarks instantly using your webcam.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-muted/30 border border-border flex flex-col items-center text-center space-y-4 transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-xl font-bold">100% Private</h3>
              <p className="text-muted-foreground">Everything runs locally in your browser. No video is ever recorded or uploaded.</p>
            </div>

            <div className="p-8 rounded-2xl bg-muted/30 border border-border flex flex-col items-center text-center space-y-4 transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <h3 className="text-xl font-bold">Instant Alerts</h3>
              <p className="text-muted-foreground">Receive visual feedback immediately when you start slouching.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
