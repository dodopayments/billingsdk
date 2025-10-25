import { Cursor } from "./cursor";

export const Accessiblilty = () => {
  return (
    <div className="h-full p-4 flex items-center justify-center w-full bg-muted/20 group">
      <div className="grid relative grid-cols-4 gap-4 w-full max-w-3/4">
        {/* SHIFT - clicks second */}
        <div className="col-span-2 border rounded-xl border-input p-6 flex items-center justify-center bg-muted/40 inset-shadow-sm inset-shadow-white/20 shadow-xl shadow-black transition-all duration-300 group-hover:animate-[click-shift_3s_ease-in-out_infinite]">
          SHIFT
        </div>
        {/* TAB - clicks third */}
        <div className="col-span-2 border rounded-xl border-input p-6 flex items-center justify-center bg-muted/40 inset-shadow-sm inset-shadow-white/20 shadow-xl shadow-black transition-all duration-300 group-hover:animate-[click-tab_3s_ease-in-out_infinite]">
          TAB
        </div>
        {/* SPACE - clicks first */}
        <div className="border rounded-xl border-input p-6 col-span-4 flex items-center justify-center bg-muted/40 inset-shadow-sm inset-shadow-white/20 shadow-xl shadow-black transition-all duration-300 group-hover:animate-[click-space_3s_ease-in-out_infinite]">
          SPACE
        </div>

        {/* Cursor animations */}
        <Cursor className="size-20 absolute -bottom-4 -rotate-8 right-4 transition-all duration-700 ease-in-out group-hover:animate-[cursor-move_3s_ease-in-out_infinite]" />
      </div>
    </div>
  );
};
