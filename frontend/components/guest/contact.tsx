"use client";
import { Element } from "react-scroll";
import ContactForm from "../shared/contact-form";

const Contact = () => {
  return (
    <Element name="contact">
      <section className="w-full flex flex-col items-center justify-center gap-10 overflow-x-hidden lg:pb-28 pb-20">
        <div className="w-full flex flex-col gap-4 items-center">
          <h2 className="text-center text-[#000000E5] font-ibm font-bold text-3xl md:text-4xl lg:text-5xl">
            Get in Touch
          </h2>
          <h4 className="text-xl lg:text-3xl text-center font-marcellus text-[#000000CC] max-w-xl">
            If you&apos;re interested in our services, please feel free to reach
            out to us.
          </h4>
        </div>
        <div className="w-[90%] md:w-[60%] lg:w-[40%] z-10 p-4 md:p-8 border border-[#E5E7EB] rounded-[20px]">
          <ContactForm />
        </div>
      </section>
    </Element>
  );
};

export default Contact;
