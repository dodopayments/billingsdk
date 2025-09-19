import { Cursor } from "./cursor";

export const Accessiblilty = () => {
  return (
    <div className="h-full p-4 flex items-center justify-center w-full bg-muted/20">
      <div className="grid relative grid-cols-4 gap-4 w-full max-w-3/4">
        <div className="col-span-2 border rounded-xl border-input p-6 flex items-center justify-center bg-muted/40 inset-shadow-sm inset-shadow-white/20 shadow-xl shadow-black">
          SHIFT
        </div>
        <div className="col-span-2 border rounded-xl border-input p-6 flex items-center justify-center bg-muted/40 inset-shadow-sm inset-shadow-white/20 shadow-xl shadow-black">
          TAB
        </div>
        <div className=" border rounded-xl border-input p-6 col-span-4 flex items-center justify-center bg-muted/40 inset-shadow-sm inset-shadow-white/20 shadow-xl shadow-black">
          SPACE
        </div>

        <Cursor className="size-20 absolute -bottom-4 -rotate-8 right-4" />
      </div>
    </div>
  );
};
