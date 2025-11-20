import { Banner } from "@/registry/billingsdk/banner";

export default function BannerInfoDemo() {
  return (
    <div className="bg-background-secondary flex h-full min-h-[500px] w-full flex-col gap-6 overflow-hidden rounded-lg border-2">
      <Banner
        title="ℹ️ New API Version Available"
        description="API v2.1 is now available with improved performance and new endpoints"
        buttonText="View Docs"
        buttonLink="https://example.com/api-docs"
        variant="info"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="text-foreground-secondary text-3xl font-bold tracking-tight">
          Developer Resources
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            Access documentation, guides, and API references
          </p>
          <a className="hover:text-primary underline underline-offset-4 transition">
            Browse Docs →
          </a>
        </div>
      </section>
    </div>
  );
}
