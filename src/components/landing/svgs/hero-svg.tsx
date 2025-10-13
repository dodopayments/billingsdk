import { cn } from "@/lib/utils";

export const HeroSvg = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cn(className)}
      viewBox="0 0 12745 10627"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <foreignObject x="0.0812378" y="0.43866" width="12172.5" height="10283.5">
        <div
          style={{
            backdropFilter: "blur(145.7px)",
            clipPath: "url(#bgblur_1_182_10_clip_path)",
            height: "100%",
            width: "100%",
          }}
        />
      </foreignObject>
      <g filter="url(#filter0_nf_182_10)" data-figma-bg-blur-radius="291.4">
        <path
          d="M544.264 1354.43C498.188 908.037 857.868 524.19 1306.31 541.182L10922 905.545C11394.8 923.46 11728.9 1375.4 11607.3 1832.66L10044.5 7710.28C9972.49 7980.91 9753.56 8187.5 9479.21 8243.65L2223.9 9728.59C1796.34 9816.1 1386.64 9515.47 1341.83 9081.35L544.264 1354.43Z"
          fill="#1264FF"
        />
      </g>
      <foreignObject x="2188.86" y="1759.99" width="10556" height="8866.91">
        <div
          style={{
            backdropFilter: "blur(145.7px)",
            clipPath: "url(#bgblur_1_182_10_clip_path)",
            height: "100%",
            width: "100%",
          }}
        />
      </foreignObject>
      <g filter="url(#filter1_nf_182_10)" data-figma-bg-blur-radius="291.4">
        <path
          d="M2965.57 3475.41C2777.89 2934.56 3250.77 2395.24 3811.52 2510.62L11420.7 4076.22C11763.8 4146.81 12010 4448.82 12010 4799.08V9154C12010 9561.59 11679.6 9892 11272 9892H5717.24C5402.91 9892 5123.07 9692.9 5020.03 9395.94L2965.57 3475.41Z"
          fill="#DCE8FF"
        />
        <path
          d="M2966.04 3475.25C2778.49 2934.76 3251.05 2395.81 3811.42 2511.11L11420.6 4076.71C11763.5 4147.25 12009.5 4449.06 12009.5 4799.08V9154C12009.5 9561.31 11679.3 9891.5 11272 9891.5H5717.24C5403.12 9891.5 5123.48 9692.53 5020.5 9395.77L2966.04 3475.25Z"
          stroke="black"
        />
      </g>
      <defs>
        <filter
          id="filter0_nf_182_10"
          x="0.0812378"
          y="0.43866"
          width="12172.5"
          height="10283.5"
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
          <feMerge result="effect1_noise_182_10">
            <feMergeNode in="shape" />
            <feMergeNode in="color1" />
          </feMerge>
          <feGaussianBlur
            stdDeviation="270.1"
            result="effect2_foregroundBlur_182_10"
          />
        </filter>
        <clipPath
          id="bgblur_0_182_10_clip_path"
          transform="translate(-0.0812378 -0.43866)"
        >
          <path d="M544.264 1354.43C498.188 908.037 857.868 524.19 1306.31 541.182L10922 905.545C11394.8 923.46 11728.9 1375.4 11607.3 1832.66L10044.5 7710.28C9972.49 7980.91 9753.56 8187.5 9479.21 8243.65L2223.9 9728.59C1796.34 9816.1 1386.64 9515.47 1341.83 9081.35L544.264 1354.43Z" />
        </clipPath>
        <filter
          id="filter1_nf_182_10"
          x="2188.86"
          y="1759.99"
          width="10556"
          height="8866.91"
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
          <feMerge result="effect1_noise_182_10">
            <feMergeNode in="shape" />
            <feMergeNode in="color1" />
          </feMerge>
          <feGaussianBlur
            stdDeviation="367.45"
            result="effect2_foregroundBlur_182_10"
          />
        </filter>
        <clipPath
          id="bgblur_1_182_10_clip_path"
          transform="translate(-2188.86 -1759.99)"
        >
          <path d="M2965.57 3475.41C2777.89 2934.56 3250.77 2395.24 3811.52 2510.62L11420.7 4076.22C11763.8 4146.81 12010 4448.82 12010 4799.08V9154C12010 9561.59 11679.6 9892 11272 9892H5717.24C5402.91 9892 5123.07 9692.9 5020.03 9395.94L2965.57 3475.41Z" />
        </clipPath>
      </defs>
    </svg>
  );
};
