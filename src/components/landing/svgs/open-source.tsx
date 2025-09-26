import { FaGithub } from "react-icons/fa";
import { LogoMark } from "./logo-mark";

export const OpenSource = () => {
  return (
    <div className="flex h-full bg-muted/20 items-center relative overflow-hidden pt-8 justify-around p-4 ">
      <div className="flex items-center bg-muted border-accent border drop-shadow-2xl drop-shadow-white/20 group-hover:drop-shadow-white/40 transition-all duration-300 ease-in-out p-4 rounded-4xl justify-center z-[20]">
        <FaGithub className="size-20" />
      </div>
      <div className="[mask-image:linear-gradient(to_top,transparent,white_70%)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10]">
        <LogoMark className=" size-[17rem] text-muted" />
      </div>
    </div>
  );
};
