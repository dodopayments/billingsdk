import { Banner } from "@/components/billingsdk/banner";

export default function FreeTrialBannerDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <Banner
        title="⚠️ Payment Failed - Subscription Suspended"
        description="Your subscription will be canceled in 3 days if payment is not updated"
        buttonText="Update Payment"
        buttonLink="https://example.com/billing"
        variant="destructive"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-secondary">
          Create next-generation digital products
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            Build faster with our platform
          </p>
          <a className="underline underline-offset-4 hover:text-primary transition">
            Get Started →
          </a>
        </div>
      </section>
    </div>
  );
}
