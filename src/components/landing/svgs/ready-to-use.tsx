import { BadgeCheck, Circle } from "lucide-react";
import { ShineButton } from "../shine-button";

export const ReadyToUse = () => {
  return (
    <div className="h-full p-4 bg-muted/20 flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-wrap justify-center items-center gap-2">
        <ShineButton
          containerClassName="px-2 text-xs"
          Icon={BadgeCheck}
          className=""
          label="Billing Settings"
        />
        <ShineButton
          containerClassName="px-2 text-xs"
          Icon={BadgeCheck}
          className=""
          label="Pricing Tables"
        />
        <ShineButton
          containerClassName="px-2 text-xs"
          Icon={BadgeCheck}
          className=""
          label="Upload Plan Card"
        />
        <ShineButton
          containerClassName="px-2 text-xs"
          Icon={BadgeCheck}
          className=""
          label="Pricing"
        />
        <ShineButton
          containerClassName="px-2 text-xs"
          Icon={Circle}
          className=""
          label="Billing Settings"
        />
      </div>

      {/* <Badge variant={"secondary"}>and more</Badge> */}
    </div>
  );
};
