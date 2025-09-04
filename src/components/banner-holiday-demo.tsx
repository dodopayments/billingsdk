import { Banner } from "@/components/billingsdk/banner"

export default function BannerHolidayDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <Banner
        title="🎄 Holiday Special: 25% Off All Plans"
        description="Celebrate the season with our biggest discount of the year. Valid until December 31st!"
        buttonText="Claim Discount"
        buttonLink="https://example.com/holiday-sale"
        style="holiday"
        variant="default"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-secondary">
          Holiday Season Specials
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            Spread joy this holiday season with amazing deals and special offers
          </p>
          <a className="underline underline-offset-4 hover:text-primary transition">
            View All Offers →
          </a>
        </div>
      </section>
    </div>
  )
}
