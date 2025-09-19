import { cn } from "@/lib/utils";
import { features } from "./Features";
import { FeatureIllustration } from "./feature-illustration";
import { HeroSvg2 } from "./svgs/hero-svg-2";

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
        "border h-[23rem] group max-h-fit group p-1.5 bg-muted/50 col-span-1 lg:col-span-3 rounded-xl w-full",
        // conditional overrides appended AFTER the base so they take precedence
        (index === 1 || index === 5) && "lg:col-span-4"
      )}
    >
      <div className="border h-full flex flex-col bg-background/80 rounded-lg">
        <div className="relative overflow-hidden rounded-lg h-full w-full">
          <HeroSvg2 className="absolute size-10 scale-y-[-1] group-hover:opacity-100 opacity-0 transition-all duration-700 ease-in-out md:size-150 blur-[2rem] md:blur-[4rem] -top-80 -left-10 " />
          <FeatureIllustration label={item.label} />
        </div>
        <div className="p-4 min-h-[35%] max-h-fit">
          <h3 className="h-fit mb-2 text-lg font-semibold">{item.title}</h3>
          <p
            className={cn(
              index === 1 && "lg:max-w-lg",
              index === 5 && "lg:max-w-lg",
              "text-sm  text-muted-foreground"
            )}
          >
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
};
