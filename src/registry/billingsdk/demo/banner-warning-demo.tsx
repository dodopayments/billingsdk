import { Banner } from "@/registry/billingsdk/banner";

export default function BannerWarningDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <Banner
        title="⚠️ System Maintenance Scheduled"
        description="Our services will be temporarily unavailable on Sunday, 2AM-4AM UTC for scheduled maintenance"
        buttonText="Learn More"
        buttonLink="https://example.com/maintenance"
        variant="warning"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-secondary">
          System Status Dashboard
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            Monitor system health and maintenance schedules
          </p>
          <a className="underline underline-offset-4 hover:text-primary transition">
            View Status →
          </a>
        </div>
      </section>
    </div>
  );
}
