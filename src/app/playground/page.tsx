import { Playground } from "@/components/playground/playground";
import { Suspense } from "react";

export const metadata = {
  title: "Playground | Billing SDK",
  description: "Test and experiment with Billing SDK components in real-time",
};

export default function PlaygroundPage() {
  return (
    <Suspense fallback={null}>
      <Playground />
    </Suspense>
  );
}
