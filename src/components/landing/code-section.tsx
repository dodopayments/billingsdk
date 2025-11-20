"use client";

import { CustomCodeBlock } from "@/components/code";

interface Code {
  title: string;
  description: string;
  code: string;
  language: string;
}

const features: Code[] = [
  {
    title: "Single Config for all..",
    description:
      "All components are configured with a single config object. No need to pass props to each component.",
    code: `export interface Plan {
    id: string
    title: string
    description: string
    highlight?: boolean
    type?: 'monthly' | 'yearly'
    currency?: string
    monthlyPrice: string
    yearlyPrice: string
    buttonText: string
    badge?: string
    features: {
        name: string
        icon: string
        iconColor?: string
    }[]
}

export interface CurrentPlan {
    plan: Plan
    type: 'monthly' | 'yearly' | 'custom'
    price?: string
    nextBillingDate: string
    paymentMethod: string
    status: 'active' | 'inactive' | 'past_due' | 'cancelled'
}

export const plans: Plan[] = [{
        id: 'pro',
        title: 'Starter',
        description: 'For developers testing out Liveblocks locally.',
        currency: '$',
        monthlyPrice: '0',
        yearlyPrice: '0',
        buttonText: 'Start today for free',
        features: [{
                name: 'Presence',
                icon: "check",
                iconColor: 'text-green-500'
            },
            {
                name: 'Comments',
                icon: "check",
                iconColor: 'text-orange-500'
            }],
    },{
        id: 'pro',
        title: 'Pro',
        description: 'For companies adding collaboration in production.',
        currency: '$',
        monthlyPrice: '20',
        yearlyPrice: '199',
        buttonText: 'Sign up',
        badge: 'Most popular',
        highlight: true,
        features: [{
                name: 'Notifications',
                icon: "check",
                iconColor: 'text-teal-500'
            },
            {
                name: 'Text Editor',
                icon: "check",
                iconColor: 'text-blue-500'
            },
            {
                name: 'Sync Datastore',
                icon: "check",
                iconColor: 'text-zinc-500'
            }],
    }]
];
`,
    language: "ts",
  },

  {
    title: "Drop-in Pricing Table",
    description: "Just 5 lines of code. Seriously. That's it!",
    code: `"use client"

import { PricingTableOne } from "@/components/billingsdk/pricing-table-one"
import { plans } from "@/lib/billingsdk-config"

export default function App() {
  return (
    <PricingTableOne
      plans={plans}
      onPlanSelect={(planId) => console.log(planId)}
    />
  )
}`,
    language: "tsx",
  },
  {
    title: "Cancel Flow? Easy Peasy!",
    description:
      "Complete cancellation flow with confirmation - just pass a plan!",
    code: `"use client"

import { CancelSubscriptionCard } from "@/components/billingsdk/cancel-subscription-card"
import { plans } from "@/lib/billingsdk-config"

export default function App() {
  return (
    <CancelSubscriptionCard
      plan={plans[0]}
      onCancel={(planId) => console.log('Cancelled:', planId)}
    />
  )
}`,
    language: "tsx",
  },
  {
    title: "Plan Upgrades in Seconds",
    description: "Beautiful plan upgrade interface - copy, paste, done!",
    code: `"use client"

import { UpdatePlanCard } from "@/components/billingsdk/update-plan-card"
import { plans } from "@/lib/billingsdk-config"

export default function App() {
  return (
    <UpdatePlanCard
      currentPlan={plans[0]}
      plans={plans}
      onPlanChange={(planId) => console.log('Upgraded to:', planId)}
    />
  )
}`,
    language: "tsx",
  },
];

export function CodeSection() {
  return (
    <div className="divide-accent-900 border-border mx-auto grid w-full max-w-7xl list-none auto-rows-fr grid-cols-1 divide-y border-none md:grid-cols-2 md:divide-x md:divide-y-0">
      {features.map((feature, index) => (
        <div
          key={index}
          className="border-card relative min-h-160 border-t bg-[radial-gradient(131.66%_109.77%_at_50%_97.75%,transparent_50%,rgba(74,0,224,0.25)_75%,rgba(0,234,255,0.3)_100%)] p-8 pt-24 pb-0 dark:bg-[radial-gradient(131.66%_109.77%_at_50%_97.75%,transparent_50%,#4a00e040_75%,#00eaff60_100%)]"
        >
          <div className="text-center">
            <h2 className="font-display text-3xl font-medium text-zinc-800 sm:text-3xl md:text-4xl dark:text-zinc-300">
              {feature.title}
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-md text-sm tracking-tight">
              {feature.description}
            </p>
          </div>

          <div className="border-border absolute right-0 bottom-0 left-0 mx-8 mt-8 h-96 overflow-hidden border-x border-t shadow-lg">
            {/* Window chrome */}
            <div className="border-border border-l-foreground border-b bg-transparent px-4 py-2">
              <div className="flex items-center gap-1">
                <div className="outline-border size-2 rounded-full outline"></div>
                <div className="outline-accent size-2 rounded-full outline"></div>
              </div>
            </div>

            {/* Code block */}
            <CustomCodeBlock
              code={feature.code}
              language={feature.language}
              maxHeight="400px"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
