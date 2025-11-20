import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShineButton } from "./shine-button";
import { CircleQuestionMarkIcon } from "lucide-react";

export const faqData = [
  {
    question: "Do I need to install extra dependencies?",
    answer:
      "No. All components are copy-paste ready and work out of the box. You can drop them into your project without additional setup.",
  },
  {
    question: "Can I customize the components?",
    answer:
      "Yes. Every component is fully customizable with Tailwind classes, props, and CSS variables so you can match your brand style.",
  },
  {
    question: "Are the components production-ready?",
    answer:
      "Absolutely. They’re tested across browsers and devices, WCAG-compliant, and optimized for accessibility and performance.",
  },
  {
    question: "Is this library open source?",
    answer:
      "Yes. The entire source code is open and free to use, modify, or contribute to under the project’s license.",
  },
];

export const Faq = () => {
  return (
    <div className="my-24 flex max-h-fit min-h-[30rem] w-full flex-col items-center justify-center gap-8 p-4 md:gap-0">
      <div className="flex h-fit w-full flex-col items-center justify-center gap-2 md:mb-8 md:w-3/4">
        <ShineButton Icon={CircleQuestionMarkIcon} className="" label="FAQs" />
        <h2 className="font-display text-primary animate-in fade-in slide-in-from-bottom-4 text-center text-3xl font-medium duration-1000 sm:text-3xl md:text-5xl">
          You got questions? We got answers
        </h2>
      </div>
      <div className="rounded-2xl p-4 md:w-2/3">
        <Accordion type="single" collapsible className="">
          {faqData.map((faq) => (
            <AccordionItem
              key={faq.question}
              value={faq.question}
              className="bg-muted/20 mb-3 rounded-2xl border"
            >
              <AccordionTrigger className="cursor-pointer px-4 text-left hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="bg-muted/60 rounded-b-xl px-4 py-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
