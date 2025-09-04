import { Banner } from "@/components/billingsdk/banner"

export default function BannerBetaDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <Banner
        title="🧪 Beta Feature: AI-Powered Analytics"
        description="Try our new experimental AI analytics dashboard. Your feedback helps us improve!"
        buttonText="Join Beta"
        buttonLink="https://example.com/beta"
        style="beta"
        variant="default"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-secondary">
          Experimental Features
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            Be among the first to try cutting-edge features and help shape the future
          </p>
          <a className="underline underline-offset-4 hover:text-primary transition">
            View Beta Program →
          </a>
        </div>
      </section>
    </div>
  )
}
