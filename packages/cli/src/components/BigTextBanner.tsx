import React from "react";
import { Box, Text } from "ink";
import BigText from "ink-big-text";

interface BigTextBannerProps {
  text?: string;
  font?: "block" | "simple" | "simpleBlock" | "3d" | "simple3d" | "chrome" | "huge";
  colors?: string[];
  align?: "left" | "center" | "right";
  showSubtitle?: boolean;
}

export const BigTextBanner: React.FC<BigTextBannerProps> = ({
  text = "BillingSDK",
  font = "block",
  colors = ["gray"],
  align = "center",
  showSubtitle = true
}) => {
  return (
    <Box flexDirection="column" alignItems={align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start"}>
      <BigText
        text={text}
        font={font}
        colors={colors}
      />
      {showSubtitle && (
        <Box marginTop={1}>
          <Text color="gray" dimColor>
            Billing SDK CLI for managing billing components
          </Text>
        </Box>
      )}
    </Box>
  );
};

// Predefined banner configurations
export const WelcomeBanner = () => (
  <BigTextBanner
    text="Welcome to BillingSDK"
    font="block"
    colors={["gray"]}
  />
);

export const SuccessBanner = () => (
  <BigTextBanner
    text="Success!"
    font="chrome"
    colors={["gray"]}
    showSubtitle={false}
  />
);

export const ErrorBanner = () => (
  <BigTextBanner
    text="Error"
    font="simple"
    colors={["dimGray"]}
    showSubtitle={false}
  />
);
