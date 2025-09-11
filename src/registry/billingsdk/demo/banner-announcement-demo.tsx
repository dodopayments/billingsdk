import { Banner } from "@/registry/billingsdk/banner";

export default function BannerAnnouncementDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <Banner
        title="🚀 Introducing Advanced Analytics"
        description="Get deeper insights into your billing data with our new analytics dashboard"
        buttonText="Explore Now"
        buttonLink="https://example.com/analytics"
        variant="announcement"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-secondary">
          Advanced Analytics
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            Powerful insights to grow your business
          </p>
          <a className="underline underline-offset-4 hover:text-primary transition">
            Get Started →
          </a>
        </div>
      </section>
    </div>
  );
}
