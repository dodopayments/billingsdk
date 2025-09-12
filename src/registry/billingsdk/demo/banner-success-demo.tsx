import { Banner } from "@/registry/billingsdk/banner";

export default function BannerSuccessDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <Banner
        title="✅ Payment Processed Successfully"
        description="Your subscription has been activated and you now have access to all premium features"
        buttonText="View Dashboard"
        buttonLink="https://example.com/dashboard"
        variant="success"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-secondary">
          Welcome to Premium
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            Enjoy unlimited access to all features
          </p>
          <a className="underline underline-offset-4 hover:text-primary transition">
            Explore Features →
          </a>
        </div>
      </section>
    </div>
  );
}
