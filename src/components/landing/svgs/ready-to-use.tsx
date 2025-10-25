import { BadgeCheck } from "lucide-react";
import { ShineButton } from "../shine-button";

export const ReadyToUse = () => {
  return (
    <div className="h-full p-4 bg-muted/20 flex flex-col gap-4 items-center justify-center group">
      <div className="flex flex-wrap justify-center items-center gap-2">
        <div className="transition-all duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.02]">
          <ShineButton
            containerClassName="px-2 text-xs"
            Icon={BadgeCheck}
            className=""
            label="Billing Settings"
          />
        </div>
        <div className="transition-all duration-500 ease-out delay-75 group-hover:-translate-y-0.5 group-hover:scale-[1.02]">
          <ShineButton
            containerClassName="px-2 text-xs"
            Icon={BadgeCheck}
            className=""
            label="Pricing Tables"
          />
        </div>
        <div className="transition-all duration-500 ease-out delay-150 group-hover:-translate-y-0.5 group-hover:scale-[1.02]">
          <ShineButton
            containerClassName="px-2 text-xs"
            Icon={BadgeCheck}
            className=""
            label="Upload Plan Card"
          />
        </div>
        <div className="transition-all duration-500 ease-out delay-200 group-hover:-translate-y-0.5 group-hover:scale-[1.02]">
          <ShineButton
            containerClassName="px-2 text-xs"
            Icon={BadgeCheck}
            className=""
            label="Pricing"
          />
        </div>
        <div className="transition-all duration-500 ease-out delay-300 group-hover:-translate-y-0.5 group-hover:scale-[1.02]">
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
