import { Banner } from "@/components/billingsdk/banner";

export default function BannerWarningDemo() {
  return (
    <div className="bg-background-secondary flex h-full min-h-[500px] w-full flex-col gap-6 overflow-hidden rounded-lg border-2">
      <Banner
        title="⚠️ System Maintenance Scheduled"
        description="Our services will be temporarily unavailable on Sunday, 2AM-4AM UTC for scheduled maintenance"
        buttonText="Learn More"
        buttonLink="https://example.com/maintenance"
        variant="warning"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="text-foreground-secondary text-3xl font-bold tracking-tight">
          System Status Dashboard
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            Monitor system health and maintenance schedules
          </p>
          <a className="hover:text-primary underline underline-offset-4 transition">
            View Status →
          </a>
        </div>
      </section>
    </div>
  );
}
