import { Banner } from "@/components/billingsdk/banner";

export default function BannerInfoDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <Banner
        title="ℹ️ New API Version Available"
        description="API v2.1 is now available with improved performance and new endpoints"
        buttonText="View Docs"
        buttonLink="https://example.com/api-docs"
        variant="info"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-secondary">
          Developer Resources
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            Access documentation, guides, and API references
          </p>
          <a className="underline underline-offset-4 hover:text-primary transition">
            Browse Docs →
          </a>
        </div>
      </section>
    </div>
  );
}
