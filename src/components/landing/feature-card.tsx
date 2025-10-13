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
        "border h-[23rem] group max-h-fit group p-1 bg-muted/50 col-span-1 lg:col-span-3 rounded-xl w-full",
        // conditional overrides appended AFTER the base so they take precedence
        (index === 1 || index === 5) && "lg:col-span-4"
      )}
    >
      <div className="border h-full flex flex-col bg-background/80 rounded-lg relative overflow-hidden group">
        <Image
          src="/landing/gradient2.png"
          alt="Gradient background"
          fill
          className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-20 object-cover blur-md transition-opacity duration-500 ease-out"
        />
        <div className="relative overflow-hidden rounded-lg h-full w-full z-10">
         
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
