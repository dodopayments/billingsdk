import { Banner } from "@/components/billingsdk/banner"

export default function BannerInfoDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <Banner
        title="ℹ️ Pro Tip: Keyboard Shortcuts"
        description="Use Cmd+K (Mac) or Ctrl+K (Windows) to quickly search through your dashboard"
        style="info"
        variant="minimal"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-secondary">
          Helpful Tips & Tricks
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            Discover hidden features and shortcuts to make your workflow more efficient
          </p>
          <a className="underline underline-offset-4 hover:text-primary transition">
            View All Tips →
          </a>
        </div>
      </section>
    </div>
  )
}
