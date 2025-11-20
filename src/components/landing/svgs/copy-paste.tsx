import { FileCode2 } from "lucide-react";
import { LogoMark } from "./logo-mark";
import { VsCode } from "./vscode";

export const CopyPaste = () => {
  return (
    <div className="bg-muted/20 group flex h-full items-center justify-around p-4 pt-8">
      <div className="bg-muted/80 border-accent flex size-24 -rotate-12 items-center justify-center rounded-2xl border p-3 transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:rotate-0">
        <LogoMark className="size-16" />
      </div>
      <div className="border-accent group-hover:bg-accent/10 flex size-20 -translate-y-8 items-center justify-center rounded-2xl border-2 border-dashed p-3 transition-all duration-500 ease-out group-hover:scale-110 group-hover:border-solid">
        <FileCode2 className="size-8 transition-all duration-500 group-hover:scale-90" />
      </div>
      <div className="bg-muted/80 border-accent flex size-24 rotate-12 items-center justify-center rounded-2xl border p-3 transition-all duration-500 ease-out group-hover:-translate-x-2 group-hover:rotate-0">
        <VsCode className="size-16" />
      </div>
    </div>
  );
};
