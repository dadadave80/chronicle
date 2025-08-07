import MaxWrapper from "@/components/shared/max-wrapper";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/faq";
import { listOfFAQs } from "@/utils/faqsData";

const FAQs = () => {
  return (
    <section className="w-full lg:py-38 py-16 bg-white flex flex-col lg:gap-24 gap-12 items-center">
      <div className="w-full flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-center font-ibm font-bold text-black">
          Frequently Asked Questions
        </h1>
      </div>

      <MaxWrapper className="w-full max-w-6xl lg:mt-4 md:mt-12 mt-4 px-4 lg:px-0">
        <Accordion type="single" collapsible className="w-full">
          {listOfFAQs.map((faq, index) => (
            <React.Fragment key={index}>
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-0"
              >
                <AccordionTrigger>
                  <h1 className="text-xl text-color2 text-left font-nunitoSans font-semibold">
                    {faq.question}
                  </h1>
                </AccordionTrigger>
                <AccordionContent>
                  <span className="border border-[#000000CC]/80"></span>
                  <p className="max-w-3xl px-4 text-color2 md:text-lg font-marcellus">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
              <hr className="my-6 border-[#000000CC]/80" />
            </React.Fragment>
          ))}
        </Accordion>
      </MaxWrapper>
    </section>
  );
};

export default FAQs;
