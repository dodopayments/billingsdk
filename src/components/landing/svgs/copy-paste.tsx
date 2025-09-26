import { FileCode2 } from "lucide-react";
import { LogoMark } from "./logo-mark";
import { VsCode } from "./vscode";

export const CopyPaste = () => {
  return (
    <div className="flex h-full bg-muted/20 items-center pt-8 justify-around p-4 ">
      <div className="border size-24 flex items-center justify-center -rotate-12 bg-muted/80 border-accent p-3 rounded-2xl">
        <LogoMark className="size-16" />
      </div>
      <div className="border-2 size-20 flex items-center justify-center border-dashed -translate-y-8 border-accent p-3 rounded-2xl">
        <FileCode2 className="size-8" />
      </div>
      <div className="border size-24 flex items-center justify-center rotate-12 bg-muted/80 border-accent p-3 rounded-2xl">
        <VsCode className="size-16" />
      </div>
    </div>
  );
};
