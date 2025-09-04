import { Banner } from "@/components/billingsdk/banner"

export default function BannerMigrationDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <Banner
        title="⬆️ Important: Database Migration Required"
        description="We're upgrading our infrastructure. Please complete the migration by clicking the button below."
        buttonText="Start Migration"
        buttonLink="https://example.com/migration"
        style="migration"
        variant="default"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-secondary">
          Infrastructure Upgrade
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            We're making improvements to provide you with better performance and reliability
          </p>
          <a className="underline underline-offset-4 hover:text-primary transition">
            Learn More →
          </a>
        </div>
      </section>
    </div>
  )
}
