"use client";
import { ListOfFeatures } from "@/utils/featuresData";
import MaxWrapper from "../shared/max-wrapper";
import { Element } from "react-scroll";

const Features = () => {
  return (
    <Element name="features" className="w-full">
      <section className="w-full lg:py-38 py-16 bg-white flex flex-col lg:gap-24 gap-12 items-center">
        <div className="w-full flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-ibm font-bold text-black">
            Our Features
          </h1>
          <p className="lg:mt-4 mt-2 text-xl xl:text-3xl text-center font-marcellus text-[#000000CC] max-w-xl xl:max-w-3xl">
            Powered by a Modular, Future-Proof Architecture
          </p>
        </div>

        <MaxWrapper className="w-full max-w-[1550px] grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:mt-4 md:mt-12 mt-4 px-4 lg:px-0">
          {ListOfFeatures.map((item, index) => (
            <div
              key={index}
              className="w-full bg-white hover:bg-[#000000e2] transition-all duration-300 ease-in border-[1px] border-[#000000e2] overflow-hidden relative flex flex-col group cursor-pointer"
            >
              <div className="w-full md:h-[250px] h-[100px] relative overflow-hidden">
                <h4 className="absolute top-4 right-4 transition-all duration-300 ease-in font-marcellus font-bold text-[#000000CC]/80 group-hover:text-[#E2E2E2] text-lg">{`0${index + 1}`}</h4>
              </div>
              <div className="p-6 md:p-6 flex flex-col gap-2">
                <h4 className="text-[#000000e2] md:text-2xl text-xl group-hover:text-white transition-all duration-300 ease-in font-bold font-nunitoSans">
                  {item.title}
                </h4>
                <p className="text-[#000000CC] group-hover:text-white transition-all duration-300 ease-in text-base font-marcellus">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </MaxWrapper>
      </section>
    </Element>
  );
};

export default Features;
