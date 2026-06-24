export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-muted/30 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">About PostureGuard AI</h1>
          <p className="text-xl text-muted-foreground">Empowering digital workers to build healthier habits.</p>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              PostureGuard AI was born out of a common frustration: the inevitable back and neck pain that follows hours of intense coding, writing, or designing. We wanted a solution that was entirely local, completely free, and highly effective.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
