import { Banner } from "@/components/billingsdk/banner"

export default function BannerPromotionalDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <Banner
        title="🎁 Limited Time Offer: 50% Off Premium Plans"
        description="Upgrade to Premium and unlock unlimited features. Offer ends in 48 hours!"
        buttonText="Claim Offer"
        buttonLink="https://example.com/offer"
        style="promotional"
        variant="default"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-secondary">
          Special Deals & Offers
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            Don't miss out on exclusive discounts and special pricing for our valued customers
          </p>
          <a className="underline underline-offset-4 hover:text-primary transition">
            View All Offers →
          </a>
        </div>
      </section>
    </div>
  )
}
