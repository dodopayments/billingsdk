import { Banner } from "@/components/billingsdk/banner"

export default function BannerWarningDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <Banner
        title="⚠️ Scheduled Maintenance"
        description="Our services will be unavailable from 2:00 AM to 4:00 AM EST for system updates"
        buttonText="Learn More"
        buttonLink="https://example.com/maintenance"
        style="warning"
        variant="default"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-secondary">
          System Maintenance Notice
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            We're performing scheduled maintenance to improve our services
          </p>
          <a className="underline underline-offset-4 hover:text-primary transition">
            View Status →
          </a>
        </div>
      </section>
    </div>
  )
}
