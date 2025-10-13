import { cn } from "@/lib/utils";

export const HeroSvg2 = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cn(className)}
      width="11016"
      height="6144"
      viewBox="0 0 11016 6144"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <foreignObject x="0.799988" y="0.586609" width="11015" height="6142.61">
        <div
          style={{
            backdropFilter: "blur(145.7px)",
            clipPath: "url(#bgblur_1_182_10_clip_path)",
            height: "100%",
            width: "100%",
          }}
        />
      </foreignObject>
      <g filter="url(#filter0_nf_187_2)" data-figma-bg-blur-radius="291.4">
        <path
          d="M541 1279H9881.18C10229.1 1279 10546 1532.94 10461.9 1682.5C10415 1832.81 10320.7 2024.1 10148.3 2169.25C9666.4 2574.8 7485.94 1484.65 6016.24 542.22C5326.86 2.99 4562.86 34.51 3937.97 146.33C3420.13 239.29 2815.75 547.37 2676.12 1054.58C2415.09 1899.81 1947.7 2983.21 1262.46 3478.32C918.721 3726.68 541 3991.68 541 4415.8V4865H541V4415.8C541 3991.68 163.279 3726.68 580.54 3478.32C1265.78 2983.21 1733.17 1899.81 1994.2 1054.58C2133.83 547.37 2738.21 239.29 3261.87 146.33C3886.82 34.51 4650.82 2.99 5360.2 542.22C6829.5 1484.65 9040 2574.8 9558.1 2169.25C9730.5 2024.1 9825.7 1832.81 9871.9 1682.5C9957 1532.94 10229.1 1279 10577 1279H11016V0.586609H9881.18C9040 0.586609 6829.5 590.736 5360.2 1532.94C4650.82 2072.71 3886.82 2040.49 3261.87 1928.67C2738.21 1835.71 2133.83 1527.63 1994.2 1020.42C1733.17 175.19 1265.78 91.79 580.54 596.68C163.279 844.037 541 1109.04 541 1533.11V4865Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <filter
          id="filter0_nf_187_2"
          x="0.799988"
          y="0.586609"
          width="11015"
          height="6142.61"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03021148219704628 0.03021148219704628"
            stitchTiles="stitch"
            numOctaves="3"
            result="noise"
            seed="3755"
          />
          <feColorMatrix
            in="noise"
            type="luminanceToAlpha"
            result="alphaNoise"
          />
          <feComponentTransfer in="alphaNoise" result="coloredNoise1">
            <feFuncA
              type="discrete"
              tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
            />
          </feComponentTransfer>
          <feComposite
            operator="in"
            in2="shape"
            in="coloredNoise1"
            result="noise1Clipped"
          />
          <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
          <feComposite
            operator="in"
            in2="noise1Clipped"
            in="color1Flood"
            result="color1"
          />
          <feMerge result="effect1_noise_187_2">
            <feMergeNode in="shape" />
            <feMergeNode in="color1" />
          </feMerge>
          <feGaussianBlur
            stdDeviation="270.1"
            result="effect2_foregroundBlur_187_2"
          />
        </filter>
        <clipPath
          id="bgblur_0_187_2_clip_path"
          transform="translate(-0.799988 -0.586609)"
        >
          <path d="M541 4865V1136.2C541 712.128 918.721 377.318 1262.46 625.677C1947.7 1120.79 2415.09 2204.19 2676.12 3152.42C2815.75 3659.67 3420.13 3967.63 3937.97 3874.67C4562.86 3762.49 5326.86 3794.01 6016.24 4233.78C7485.94 5171.35 9666.4 4081.2 10148.3 4486.75C10320.7 4631.9 10415 4823.19 10461.9 5011.5C10546 5349.06 10229.1 5603 9881.18 5603H1279C871.414 5603 541 5272.59 541 4865Z" />
        </clipPath>
      </defs>
    </svg>
  );
};
