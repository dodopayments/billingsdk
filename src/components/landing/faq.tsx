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
    <div className="min-h-[30rem] flex items-center justify-center flex-col my-24 w-full gap-10 md:gap-0 max-h-fit p-4 ">
      <div className="flex gap-2 mb-8 h-fit  items-center justify-center flex-col w-full md:w-3/4 ">
        <ShineButton Icon={CircleQuestionMarkIcon} className="" label="FAQs" />
        <h2 className="text-3xl sm:text-3xl font-display md:text-5xl font-medium text-primary animate-in fade-in slide-in-from-bottom-4 duration-1000">
          You got questions? We got answers
        </h2>
      </div>
      <div className="md:w-2/3 p-4 rounded-2xl">
        <Accordion type="single" collapsible className="">
          {faqData.map((faq) => (
            <AccordionItem
              key={faq.question}
              value={faq.question}
              className="border bg-muted/20 mb-3 rounded-2xl"
            >
              <AccordionTrigger className="hover:no-underline px-4 cursor-pointer text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="bg-muted/60 px-4 rounded-b-xl py-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
