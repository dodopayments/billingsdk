import { BsDiscord, BsGithub, BsTwitterX } from "react-icons/bs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export function OpenSource() {
  const socials = [
    {
      name: "GitHub",
      icon: BsGithub,
      href: "https://github.com/dodopayments/billingsdk",
      description: "View our open source code and contribute to the project",
    },
    {
      name: "X/ Twitter",
      icon: BsTwitterX,
      href: "https://x.com/dodopayments",
      description: "Follow us for updates and announcements on our products",
    },
    {
      name: "Discord",
      icon: BsDiscord,
      href: "https://discord.com/invite/bYqAp4ayYh",
      description: "Join our community for support and discussions",
    },
  ];
  return (
    <div className="mx-auto mb-40 flex w-full max-w-4xl flex-col">
      <h2 className="font-display text-primary mb-4 text-center text-3xl font-medium sm:text-3xl md:text-4xl">
        Join our community
      </h2>
      <p className="text-muted-foreground mx-auto mt-2 mb-8 max-w-2xl px-8 text-center text-sm tracking-tight xl:px-0">
        Connect with other developers, get help, and contribute to the project
      </p>
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
        {socials.map((social) => (
          <Card
            key={social.name}
            className="bg-card/50 hover:bg-card/80 flex h-48 w-full max-w-[280px] cursor-pointer flex-col transition-all duration-300 md:max-w-xs"
          >
            <Link
              href={social.href}
              target="_blank"
              className="flex h-full flex-col"
            >
              <CardContent className="flex flex-1 flex-col items-center justify-center gap-2 p-6">
                <social.icon className="text-foreground text-3xl md:text-4xl" />
                <p className="text-foreground text-base font-medium">
                  {social.name}
                </p>
              </CardContent>
              <CardFooter className="mt-auto px-4 pb-4">
                <p className="text-muted-foreground text-center text-xs leading-relaxed">
                  {social.description}
                </p>
              </CardFooter>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
