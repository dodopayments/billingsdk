import { Badge } from "../ui/badge";
import { Accessiblilty } from "./svgs/accessibility";
import { CopyPaste } from "./svgs/copy-paste";
import { CustomisedUI } from "./svgs/customised-ui";
import { OpenSource } from "./svgs/open-source";
import { ReadyToUse } from "./svgs/ready-to-use";
import { Speedometer } from "./svgs/speedometer";

export function FeatureIllustration({ label }: { label: string }) {
  const normalizedLabel = label.toLowerCase();
  console.log(normalizedLabel);

  switch (normalizedLabel) {
    case "copy-paste":
      return <CopyPaste />;
    case "open-source":
      return <OpenSource />;
    case "ready-to-use":
      return <ReadyToUse />;
    case "accessible":
      return <Accessiblilty />;
    case "fast-dev":
      return (
        <div className="bg-muted/20 flex h-full w-full flex-col items-center justify-center gap-0">
          <Badge
            variant={"secondary"}
            className="h-9 -translate-y-18 px-4 text-sm"
          >
            10x Faster
          </Badge>
          <Speedometer className="absolute -bottom-28 left-1/2 size-[18rem] -translate-x-1/2" />
        </div>
      );
    case "customizable":
      return (
        <div className="bg-muted/20 flex h-full w-full flex-col items-center justify-center gap-0">
          <CustomisedUI className="size-48" />
        </div>
      );
    default:
      return null;
  }
}
