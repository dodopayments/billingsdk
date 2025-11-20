import { LogoMark } from "./logo-mark";

export const OpenSource = () => {
  return (
    <div className="bg-muted/20 group relative flex h-full items-center justify-around overflow-hidden p-4 pt-8">
      <div className="bg-muted border-accent z-[20] flex items-center justify-center rounded-4xl border p-4 drop-shadow-2xl drop-shadow-white/20 transition-all duration-300 ease-in-out group-hover:drop-shadow-white/40">
        <svg
          viewBox="0 0 1024 1024"
          className="size-20"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          {/* Background circle */}
          <path d="M512 0C229.25 0 0 229.25 0 512c0 226.25 146.688 418.125 350.156 485.812 25.594 4.688 34.938-11.125 34.938-24.625 0-12.188-0.469-52.562-0.719-95.312C242 908.812 211.906 817.5 211.906 817.5c-23.312-59.125-56.844-74.875-56.844-74.875-46.531-31.75 3.53-31.125 3.53-31.125 51.406 3.562 78.47 52.75 78.47 52.75 45.688 78.25 119.875 55.625 149 42.5 4.654-33 17.904-55.625 32.5-68.375C304.906 725.438 185.344 681.5 185.344 485.312c0-55.938 19.969-101.562 52.656-137.406-5.219-13-22.844-65.094 5.062-135.562 0 0 42.938-13.75 140.812 52.5 40.812-11.406 84.594-17.031 128.125-17.219 43.5 0.188 87.312 5.875 128.188 17.281 97.688-66.312 140.688-52.5 140.688-52.5 28 70.531 10.375 122.562 5.125 135.5 32.812 35.844 52.625 81.469 52.625 137.406 0 196.688-119.75 240-233.812 252.688 18.438 15.875 34.75 47 34.75 94.75 0 68.438-0.688 123.625-0.688 140.5 0 13.625 9.312 29.562 35.25 24.562C877.438 930 1024 738.125 1024 512 1024 229.25 794.75 0 512 0z" />

          {/* Left ear - waves */}
          <g className="origin-[35%_35%] transition-transform duration-500 ease-in-out group-hover:rotate-[-12deg]">
            <path d="M340 260c-25-35-40-75-42-118 0-8 6-14 14-14 43 2 83 17 118 42l-90 90z" />
          </g>

          {/* Right ear - waves */}
          <g className="origin-[65%_35%] transition-transform duration-500 ease-in-out group-hover:rotate-[12deg]">
            <path d="M684 260c25-35 40-75 42-118 0-8-6-14-14-14-43 2-83 17-118 42l90 90z" />
          </g>

          {/* Tail - waves */}
          <g className="origin-[25%_75%] transition-transform duration-700 ease-in-out group-hover:rotate-[-12deg]">
            <path d="M210 650c-45 15-85 42-115 77-6 6-6 16 0 22 35 35 75 62 120 77 8 3 16-3 16-11v-154c0-8-8-14-16-11z" />
          </g>
        </svg>
      </div>
      <div className="absolute top-1/2 left-1/2 z-[10] -translate-x-1/2 -translate-y-1/2 [mask-image:linear-gradient(to_top,transparent,white_70%)] transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-80">
        <LogoMark className="text-muted size-[17rem]" />
      </div>
    </div>
  );
};
