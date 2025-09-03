import { Banner } from "@/components/billingsdk/banner"

export default function BannerSecurityDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <Banner
        title="🔒 Security Update: Two-Factor Authentication Required"
        description="To protect your account, please enable two-factor authentication by March 15th"
        buttonText="Enable 2FA"
        buttonLink="https://example.com/security"
        style="security"
        variant="default"
      />

      {/* minimal hero example */}
      <section className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-secondary">
          Enhanced Security Features
        </h1>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground max-w-md">
            We're continuously improving our security measures to keep your data safe
          </p>
          <a className="underline underline-offset-4 hover:text-primary transition">
            Learn More →
          </a>
        </div>
      </section>
    </div>
  )
}
