import { Banner } from "@/registry/billingsdk/banner";

export default function BannerAnnouncementDemo() {
  return (
    <div className="bg-background-secondary flex h-full min-h-[500px] w-full flex-col gap-6 overflow-hidden rounded-lg border-2">
      <Banner
        title="🚀 Introducing Advanced Analytics"
        description="Get deeper insights into your billing data with our new analytics dashboard"
        buttonText="Explore Now"
        buttonLink="https://example.com/analytics"
        variant="announcement"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="text-foreground-secondary text-3xl font-bold tracking-tight">
          Advanced Analytics
        </h1>
        <div className="flex flex-col gap-2">
          <p className="max-w-md text-muted-foreground">
            Powerful insights to grow your business
          </p>
          <a className="underline underline-offset-4 transition hover:text-primary">
            Get Started →
          </a>
        </div>
      </section>
    </div>
  );
}
