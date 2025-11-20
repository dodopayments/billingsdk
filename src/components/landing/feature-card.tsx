import { cn } from "@/lib/utils";
import { features } from "./Features";
import { FeatureIllustration } from "./feature-illustration";
import Image from "next/image";

export const FeatureCard = ({
  item,
  index,
}: {
  item: (typeof features)[0];
  index: number;
}) => {
  return (
    <div
      className={cn(
        // base classes first
        "group group bg-muted/50 col-span-1 h-[23rem] max-h-fit w-full rounded-xl border p-1 lg:col-span-3",
        // conditional overrides appended AFTER the base so they take precedence
        (index === 1 || index === 5) && "lg:col-span-4",
      )}
    >
      <div className="bg-background/80 group relative flex h-full flex-col overflow-hidden rounded-lg border">
        <Image
          src="/landing/gradient2.png"
          alt="Gradient background"
          fill
          className="absolute top-0 left-0 h-full w-full object-cover opacity-0 blur-md transition-opacity duration-500 ease-out group-hover:opacity-20"
        />
        <div className="relative z-10 h-full w-full overflow-hidden rounded-lg">
          <FeatureIllustration label={item.label} />
        </div>
        <div className="max-h-fit min-h-[35%] p-4">
          <h3 className="mb-2 h-fit text-lg font-semibold">{item.title}</h3>
          <p
            className={cn(
              index === 1 && "lg:max-w-lg",
              index === 5 && "lg:max-w-lg",
              "text-muted-foreground text-sm",
            )}
          >
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
};
