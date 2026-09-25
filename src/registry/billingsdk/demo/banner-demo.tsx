import { Banner } from "@/components/billingsdk/banner";

export default function FreeTrialBannerDemo() {
  return (
    <div className="bg-background-secondary flex h-full min-h-[500px] w-full flex-col gap-6 overflow-hidden rounded-lg border-2">
      <Banner
        title="🎉 Start your free trial today!"
        description="Get 30 days free access to all premium features"
        buttonText="Start Free Trial"
        buttonLink="https://example.com/signup"
        variant="default" // default, minimal, popup
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="text-foreground-secondary text-3xl font-bold tracking-tight">
          Create next-generation digital products
        </h1>
        <div className="flex flex-col gap-2">
          <p className="max-w-md text-muted-foreground">
            Build faster with our platform
          </p>
          <a className="underline underline-offset-4 transition hover:text-primary">
            Get Started →
          </a>
        </div>
      </section>
    </div>
  );
}
