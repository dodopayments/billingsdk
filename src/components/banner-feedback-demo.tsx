import { Banner } from "@/components/billingsdk/banner"

export default function BannerFeedbackDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <Banner
        title="💬 We'd Love Your Feedback!"
        description="Help us improve by sharing your experience. Your input shapes our future features."
        buttonText="Share Feedback"
        buttonLink="https://example.com/feedback"
        style="feedback"
        variant="default"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-secondary">
          Your Voice Matters
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            We're building this platform for you. Share your thoughts and help us create something amazing
          </p>
          <a className="underline underline-offset-4 hover:text-primary transition">
            Submit Feedback →
          </a>
        </div>
      </section>
    </div>
  )
}
