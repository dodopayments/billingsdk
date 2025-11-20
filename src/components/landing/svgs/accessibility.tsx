import { Cursor } from "./cursor";

export const Accessiblilty = () => {
  return (
    <div className="bg-muted/20 group flex h-full w-full items-center justify-center p-4">
      <div className="relative grid w-full max-w-3/4 grid-cols-4 gap-4">
        {/* SHIFT - clicks second */}
        <div className="border-input bg-muted/40 col-span-2 flex items-center justify-center rounded-xl border p-6 shadow-xl inset-shadow-sm shadow-black inset-shadow-white/20 transition-all duration-300 group-hover:animate-[click-shift_3s_ease-in-out_infinite]">
          SHIFT
        </div>
        {/* TAB - clicks third */}
        <div className="border-input bg-muted/40 col-span-2 flex items-center justify-center rounded-xl border p-6 shadow-xl inset-shadow-sm shadow-black inset-shadow-white/20 transition-all duration-300 group-hover:animate-[click-tab_3s_ease-in-out_infinite]">
          TAB
        </div>
        {/* SPACE - clicks first */}
        <div className="border-input bg-muted/40 col-span-4 flex items-center justify-center rounded-xl border p-6 shadow-xl inset-shadow-sm shadow-black inset-shadow-white/20 transition-all duration-300 group-hover:animate-[click-space_3s_ease-in-out_infinite]">
          SPACE
        </div>

        {/* Cursor animations */}
        <Cursor className="absolute right-4 -bottom-4 size-20 -rotate-8 transition-all duration-700 ease-in-out group-hover:animate-[cursor-move_3s_ease-in-out_infinite]" />
      </div>
    </div>
  );
};
