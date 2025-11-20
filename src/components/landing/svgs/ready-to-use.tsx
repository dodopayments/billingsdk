import { BadgeCheck } from "lucide-react";
import { ShineButton } from "../shine-button";

export const ReadyToUse = () => {
  return (
    <div className="bg-muted/20 group flex h-full flex-col items-center justify-center gap-4 p-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="transition-all duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.02]">
          <ShineButton
            containerClassName="px-2 text-xs"
            Icon={BadgeCheck}
            className=""
            label="Billing Settings"
          />
        </div>
        <div className="transition-all delay-75 duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.02]">
          <ShineButton
            containerClassName="px-2 text-xs"
            Icon={BadgeCheck}
            className=""
            label="Pricing Tables"
          />
        </div>
        <div className="transition-all delay-150 duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.02]">
          <ShineButton
            containerClassName="px-2 text-xs"
            Icon={BadgeCheck}
            className=""
            label="Upload Plan Card"
          />
        </div>
        <div className="transition-all delay-200 duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.02]">
          <ShineButton
            containerClassName="px-2 text-xs"
            Icon={BadgeCheck}
            className=""
            label="Pricing"
          />
        </div>
        <div className="transition-all delay-300 duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.02]">
          <ShineButton
            containerClassName="px-2 text-xs"
            Icon={BadgeCheck}
            className=""
            label="Customer Portal"
          />
        </div>
      </div>

      {/* <Badge variant={"secondary"}>and more</Badge> */}
    </div>
  );
};
