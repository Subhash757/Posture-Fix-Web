import PostureCamera from "@/components/PostureCamera";

export const metadata = {
  title: "Live Demo - PostureGuard AI",
  description: "Test your posture live in the browser using MediaPipe AI.",
};

export default function DemoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="py-8 px-4 border-b border-border bg-muted/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Live Posture Demo</h1>
            <p className="text-muted-foreground mt-1">Make sure your camera is positioned to see your shoulders and hips.</p>
          </div>
        </div>
      </section>

      <section className="flex-1 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <PostureCamera />
        </div>
      </section>
    </div>
  );
}
