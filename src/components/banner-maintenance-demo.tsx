import { Banner } from "@/components/billingsdk/banner"

export default function BannerMaintenanceDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <Banner
        title="🔧 System Maintenance in Progress"
        description="We're currently updating our infrastructure. Some features may be temporarily unavailable."
        buttonText="Check Status"
        buttonLink="https://example.com/status"
        style="maintenance"
        variant="default"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-secondary">
          We're Working on Improvements
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            Our team is working hard to bring you better performance and new features
          </p>
          <a className="underline underline-offset-4 hover:text-primary transition">
            View Roadmap →
          </a>
        </div>
      </section>
    </div>
  )
}
