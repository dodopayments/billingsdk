"use client"

import { CodeBlock, CodeBlockTab, CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger } from "fumadocs-ui/components/codeblock"
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';




export default function QuickIntegration() {


  return (
    <>
      <div className="flex flex-col my-32 mt-32 items-center justify-center max-w-7xl mx-auto">
        <h2 className="text-3xl  font-display md:text-5xl font-medium text-primary animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Quick Integration
        </h2>
        <p className=" mt-4 text-muted-foreground mb-12 max-w-xl mx-auto tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 text-center lg:text-lg">
          Beautiful, customizable billing components that save you development
          time and effort.
        </p>

        <div className="flex flex-col gap-y-6">

          <Installation />
          <Theme />
          <Usage />
        </div>
      </div>
    </>
  )
}



function StepNumber({ num }: { num: number }) {
  return (
    <div className="relative flex items-center justify-center border mb-4 w-10 h-10 rounded-full">
      <span className="text-lg font-semibold w-8 h-8 rounded-full flex items-center justify-center bg-muted">
        {num}
      </span>
    </div>
  );
}

function DynamicCodeBlockRender({ code }: { code: string }) {

  return (
    <div className="w-full max-w-full min-w-0">

      <DynamicCodeBlock lang="tsx" options={{
        themes: {
          light: 'catppuccin-latte',
          dark: 'catppuccin-mocha',
        },
        components: {
          pre: (props) => (
            <pre
              {...props}
              className="rounded-lg lg:p-2 px-1 py-2 text-[12px] lg:text-[14px]  overflow-x-scroll max-w-sm md:max-w-full "
            />
          ),
          code: (props) => (
            <code
              {...props}
              className="font-sans"
            />
          ),
        },

      }} code={code}

      />
    </div>
  )
}


export function Installation() {
  return (
    <div className="flex md:flex-row flex-col-reverse lg:items-start items-center justify-between">

      {/* Left side code section */}
      <div className="max-w-sm sm:max-w-md lg:min-w-[42rem] lg:max-w-2xl md:px-0 px-4">
        <CodeBlock allowCopy={false} keepBackground={false} className="bg-transparent ">
          <div className="lg:text-[15px] mx-4 text-[var(--color-fd-primary)]">For Shadcn CLI</div>
          <CodeBlockTabs defaultValue="npm" className="bg-muted mx-4 mb-6 mt-2">
            {/* Tab buttons */}
            <CodeBlockTabsList className="border-b mb-1.5 ">
              <CodeBlockTabsTrigger value="npm">npm</CodeBlockTabsTrigger>
              <CodeBlockTabsTrigger value="pnpm">pnpm</CodeBlockTabsTrigger>
              <CodeBlockTabsTrigger value="yarn">yarn</CodeBlockTabsTrigger>
              <CodeBlockTabsTrigger value="bun">bun</CodeBlockTabsTrigger>
            </CodeBlockTabsList>

            {/* Tab content */}
            <CodeBlockTab value="npm" className="font-sans">

              <DynamicCodeBlockRender code={'npx shadcn@latest add @billingsdk/pricing-table-one'} />
            </CodeBlockTab>

            <CodeBlockTab value="pnpm" className="font-sans">

              <DynamicCodeBlockRender code={'pnpm dlx shadcn@latest add @billingsdk/pricing-table-one'} />
            </CodeBlockTab>

            <CodeBlockTab value="yarn">

              <DynamicCodeBlockRender code={'yarn add @billingsdk/pricing-table-one'} />
            </CodeBlockTab>
            <CodeBlockTab value="bun">

              <DynamicCodeBlockRender code={'bunx shadcn@latest add @billingsdk/pricing-table-one'} />
            </CodeBlockTab>
          </CodeBlockTabs>

          <div className="mx-4 lg:text-[15px] text-[var(--color-fd-primary)]">For Billing CLI</div>
          <CodeBlockTabs defaultValue="npm" className="bg-muted mx-4 mt-2">
            {/* Tab buttons */}
            <CodeBlockTabsList className="border-b mb-1.5 ">
              <CodeBlockTabsTrigger value="npm">npm</CodeBlockTabsTrigger>
              <CodeBlockTabsTrigger value="pnpm">pnpm</CodeBlockTabsTrigger>
              <CodeBlockTabsTrigger value="yarn">yarn</CodeBlockTabsTrigger>
              <CodeBlockTabsTrigger value="bun">bun</CodeBlockTabsTrigger>
            </CodeBlockTabsList>

            {/* Tab content */}
            <CodeBlockTab value="npm" className="font-sans">

              <DynamicCodeBlockRender code="npx shadcn@latest add @billingsdk/pricing-table-one" />
            </CodeBlockTab>
            <CodeBlockTab value="pnpm" className="font-sans">

              <DynamicCodeBlockRender code="pnpm dlx @billingsdk/cli add pricing-table-one" />
            </CodeBlockTab>

            <CodeBlockTab value="yarn">

              <DynamicCodeBlockRender code="yarn add @billingsdk/pricing-table-one" />
            </CodeBlockTab>
            <CodeBlockTab value="bun">

              <DynamicCodeBlockRender code="bunx @billingsdk/cli add pricing-table-one" />
            </CodeBlockTab>
          </CodeBlockTabs>
        </CodeBlock>
      </div>

      {/* Right side instruction section */}
      <div className="flex md:flex-col items-start md:ml-8 mb-2 md:mt-4 gap-4 md:gap-0">
        <StepNumber num={1} />

        <div className="md:flex flex-col">

          {/* Heading */}

          <h3 className="text-[17px] md:text-lg font-semibold mb-2">Install Components</h3>

          {/* Small description */}
          <p className="text-sm text-muted-foreground max-w-xs">
            Run the command in your CLI to quickly install and use the component in your project.
          </p>
        </div>
      </div>
    </div>
  );
}


export function Theme() {
  return (
    <div className="flex md:flex-row-reverse flex-col-reverse lg:items-start items-center justify-between md:gap-6 ">

      {/* code section */}
      <div className=" max-w-sm sm:max-w-md lg:min-w-[42rem] lg:max-w-2xl  w-full mx-2 lg:px-0 ">
        <CodeBlock keepBackground={false} className="bg-transparent">

          {/* Code Block */}
          <div className="text-[12.5px] lg:text-[15px] mx-4 mb-2 text-[var(--color-fd-primary)]">src/components/pricing-table-one-minimal-demo.tsx</div>
          <div className="bg-muted mx-4 rounded-md ">


            <DynamicCodeBlockRender code={`"use client"
import { PricingTableOne } from "@/components/billingsdk/pricing-table-one"
import { plans } from "@/lib/billingsdk-config"
  
  export function PricingTableOneMinimalDemo() {
    return (
      <>
      <PricingTableOne 
      plans={plans}
      title="Pricing"
      description="Choose the plan that's right for you"
      onPlanSelect={(planId) => console.log('Selected plan:', planId)}
      size="small" // small, medium, large
      theme="minimal" // minimal or classic
      className="w-full"
      />
      </>
    )
  }`} />


          </div>
        </CodeBlock>
      </div>

      {/* instruction section */}
      <div className="flex md:flex-col items-start md:ml-8 mb-2 md:mt-4 gap-4 md:gap-0">
        {/* Circle with 2 */}
        <StepNumber num={2} />
        <div className="md:flex flex-col">
          {/* Heading */}
          <h3 className="text-[17px] md:text-lg font-semibold mb-2">Theme</h3>

          {/* Small description */}
          <p className="text-sm text-muted-foreground max-w-xs lg:max-w-2xs">
            Switch between <code>minimal</code> and <code>classic</code> themes to customize how the pricing table looks in your project.
          </p>
        </div>
      </div>
    </div>
  );
}



export function Usage() {
  return (
    <div className="flex md:flex-row flex-col-reverse lg:items-start items-center justify-between ">

      {/* Left side code section */}
      <div className="max-w-sm sm:max-w-md lg:min-w-2xl lg:max-w-2xl">
        <CodeBlock allowCopy={true} keepBackground={false} className="bg-transparent ">

          {/* Imports Block */}
          <div className="lg:text-[15px] mx-4 mb-2 text-[var(--color-fd-primary)]">Imports</div>
          <div className="bg-muted mx-4 mb-6 rounded-md">


            <DynamicCodeBlockRender code={`import { PricingTableOne } from "@/components/billingsdk/pricing-table-one";
import { plans } from "@/lib/billingsdk-config";`} />
          </div>

          {/* Code Block */}
          <div className="lg:text-[15px] mx-4 mb-2 text-[var(--color-fd-primary)]">Code</div>
          <div className="bg-muted mx-4 rounded-md">

            <DynamicCodeBlockRender code={`<PricingTableOne 
  plans={plans}
  title="Pricing"
  description="Choose the plan that's right for you"
  onPlanSelect={(planId) => console.log('Selected plan:', planId)}
  size="small" // small, medium, large
  theme="classic" // minimal or classic
/>`} />

          </div>
        </CodeBlock>
      </div>

      {/* Right side instruction section */}
      <div className="flex md:flex-col items-start md:ml-8 mb-2 md:mt-4 gap-4 md:gap-0">
        {/* Circle with 3 */}
        <StepNumber num={3} />

        <div className="md:flex flex-col">
          {/* Heading */}
          <h3 className="text-[17px] md:text-lg font-semibold mb-2">Usage</h3>

          {/* Small description */}
          <p className="text-sm text-muted-foreground max-w-[20rem]">
            Import the component and add it to your project. Customize props like <code>plans</code>, <code>size</code>, and <code>theme</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
