  'use client'

  import { UsageMeter } from "@/components/billingsdk/usage-meter";

  export default function CustomUsageMeterLinearDemo() {

    return (
      <div className="flex flex-col gap-4 mx-auto w-full">
        <UsageMeter
          usage={[{
            name: "Claude Sonnet 4",
            usage: 75,
            limit: 100
          }, {
            name: "ChatGPT 5",
            usage: 12,
            limit: 100
          }, {
            name: "Grok 3",
            usage: 57,
            limit: 100
          }, {
            name: "Gemini 2.5",
            usage: 95,
            limit: 100
          }]}
          title="LLM Usage"
          description="Your usage of the LLM models"
          variant="linear"
          size="md"
          className="mx-auto" 
          progressColor="usage"/>
      </div>

    );
  }
