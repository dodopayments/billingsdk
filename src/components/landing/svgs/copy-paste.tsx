import { FileCode2 } from "lucide-react";
import { LogoMark } from "./logo-mark";
import { VsCode } from "./vscode";

export const CopyPaste = () => {
  return (
    <div className="flex h-full bg-muted/20 items-center pt-8 justify-around p-4 group">
      <div className="border size-24 flex items-center justify-center -rotate-12 bg-muted/80 border-accent p-3 rounded-2xl transition-all duration-500 ease-out group-hover:rotate-0 group-hover:translate-x-2">
        <LogoMark className="size-16" />
      </div>
      <div className="border-2 size-20 flex items-center justify-center border-dashed -translate-y-8 border-accent p-3 rounded-2xl transition-all duration-500 ease-out group-hover:border-solid group-hover:bg-accent/10 group-hover:scale-110">
        <FileCode2 className="size-8 transition-all duration-500 group-hover:scale-90" />
      </div>
      <div className="border size-24 flex items-center justify-center rotate-12 bg-muted/80 border-accent p-3 rounded-2xl transition-all duration-500 ease-out group-hover:rotate-0 group-hover:-translate-x-2">
        <VsCode className="size-16" />
      </div>
    </div>
  );
};
