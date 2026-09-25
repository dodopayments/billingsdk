import { Banner } from "@/components/billingsdk/banner";

export default function FreeTrialBannerDemo() {
  return (
    <div className="bg-background-secondary flex h-full min-h-[500px] w-full flex-col gap-6 overflow-hidden rounded-lg border-2">
      <Banner
        title="⚠️ Payment Failed - Subscription Suspended"
        description="Your subscription will be canceled in 3 days if payment is not updated"
        buttonText="Update Payment"
        buttonLink="https://example.com/billing"
        variant="destructive"
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
