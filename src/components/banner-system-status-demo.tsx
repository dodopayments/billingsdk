import { Banner } from "@/components/billingsdk/banner"

export default function BannerSystemStatusDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <Banner
        title="📡 System Status: All Services Operational"
        description="All systems are running smoothly. No issues reported at this time."
        style="system-status"
        variant="minimal"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-secondary">
          System Health Monitor
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            Real-time status updates for all our services and infrastructure
          </p>
          <a className="underline underline-offset-4 hover:text-primary transition">
            View Status Page →
          </a>
        </div>
      </section>
    </div>
  )
}
