import { Banner } from "@/components/billingsdk/banner"

export default function BannerSuccessDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <Banner
        title="✅ Payment Successful"
        description="Your subscription has been renewed and you now have access to all premium features"
        buttonText="View Dashboard"
        buttonLink="https://example.com/dashboard"
        style="success"
        variant="default"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-secondary">
          Welcome Back!
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            Your account is now active with all the latest features and updates
          </p>
          <a className="underline underline-offset-4 hover:text-primary transition">
            Get Started →
          </a>
        </div>
      </section>
    </div>
  )
}
