import { Banner } from "@/components/billingsdk/banner";

export default function FreeTrialBannerDemo() {
  return (
    <div className="bg-background-secondary flex h-full min-h-[500px] w-full flex-col gap-6 overflow-hidden rounded-lg border border-2">
      <Banner
        title="🎉 Explore your next destination today!"
        description="Discover the best places to visit in the world"
        variant="minimal" // default, minimal, popup
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="text-foreground-secondary text-3xl font-bold tracking-tight">
          Discover the best places to visit in the world
        </h1>
        <div className="flex flex-col gap-2">
          <p className="max-w-md text-muted-foreground">
            Explore the best places to visit in the world
          </p>
          <a className="underline underline-offset-4 transition hover:text-primary">
            Get Started →
          </a>
        </div>
      </section>
    </div>
  );
}
