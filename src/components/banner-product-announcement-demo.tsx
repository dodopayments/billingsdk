import { Banner } from "@/components/billingsdk/banner"

export default function BannerProductAnnouncementDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <Banner
        title="🎉 New Feature: Advanced Analytics Dashboard"
        description="Get deeper insights into your business metrics with our new real-time analytics dashboard"
        buttonText="Try It Now"
        buttonLink="https://example.com/analytics"
        style="product-announcement"
        variant="default"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-secondary">
          Discover New Possibilities
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            Our latest features are designed to help you work smarter, not harder
          </p>
          <a className="underline underline-offset-4 hover:text-primary transition">
            Explore Features →
          </a>
        </div>
      </section>
    </div>
  )
}
