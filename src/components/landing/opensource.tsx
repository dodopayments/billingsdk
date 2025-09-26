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
    <div className="flex flex-col mb-40 w-full max-w-4xl mx-auto">
      <h2 className="text-3xl sm:text-3xl font-display md:text-4xl font-medium text-primary text-center mb-4">
        Join our community
      </h2>
      <p className="text-sm mt-2 text-muted-foreground max-w-2xl mx-auto tracking-tight text-center mb-8">
        Connect with other developers, get help, and contribute to the project
      </p>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center">
        {socials.map((social) => (
          <Card
            key={social.name}
            className="w-full max-w-[280px] md:max-w-xs h-48 cursor-pointer flex flex-col bg-card/50 hover:bg-card/80 transition-all duration-300"
          >
            <Link
              href={social.href}
              target="_blank"
              className="flex flex-col h-full"
            >
              <CardContent className="flex flex-col gap-2 items-center justify-center p-6 flex-1">
                <social.icon className="text-3xl md:text-4xl text-foreground" />
                <p className="text-base font-medium text-foreground">
                  {social.name}
                </p>
              </CardContent>
              <CardFooter className="px-4 pb-4 mt-auto">
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
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
