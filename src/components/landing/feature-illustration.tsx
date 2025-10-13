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
        <div className="flex bg-muted/20 h-full flex-col items-center justify-center gap-0 w-full">
          <Badge
            variant={"secondary"}
            className="h-9 text-sm px-4 -translate-y-18"
          >
            10x Faster
          </Badge>
          <Speedometer className="size-[18rem] absolute left-1/2 -translate-x-1/2 -bottom-28 " />
        </div>
      );
    case "customizable":
      return (
        <div className="flex bg-muted/20 flex-col h-full items-center justify-center gap-0 w-full">
          <CustomisedUI className="size-48 " />
        </div>
      );
    default:
      return null;
  }
}
