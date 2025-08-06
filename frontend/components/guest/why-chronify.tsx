"use client";
import { Element } from "react-scroll";
import MaxWrapper from "../shared/max-wrapper";
import Image from "next/image";
import problemSVG from "@/public/problem.svg";
import solutionSVG from "@/public/solution.svg";

const WhyChronify = () => {
  return (
    <Element name="why-chronify" className="w-full">
      <section className="w-full lg:py-38 py-28 bg-[#0000001A] flex flex-col items-center">
        <div className="w-full flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl  font-ibm font-bold text-black">
            Why Chronify?
          </h1>
          <p className="lg:mt-4 mt-2 text-xl lg:text-3xl font-marcellus text-[#000000CC] max-w-xl">
            The problem &amp; solution
          </p>
        </div>

        <MaxWrapper className="w-full max-w-[1400px] grid gap-x-6 md:gap-x-12 md:gap-y-24 gap-y-10 grid-cols-1 md:grid-cols-2 lg:mt-20 md:mt-12 mt-4 px-4 lg:px-0">
          {/* image */}
          <div className="w-full md:order-1 order-1">
            <Image
              src={problemSVG}
              className="w-full lg:h-[700px] h-[300px]"
              alt="spiral"
              width={473}
              height={547}
            />
          </div>

          {/* text */}
          <div className="w-full flex flex-col items-start justify-center lg:gap-5 gap-4 md:order-2 order-2">
            <h1 className="text-xl lg:text-2xl font-nunitoSans font-bold uppercase">
              Today&apos;s Supply Chains are a Black Box
            </h1>
            <p className="text-lg lg:text-xl text-[#000000CC] font-[400] font-marcellus">
              From farm to fork, or factory to front door, the journey of a
              product is often opaque, inefficient, and vulnerable. Businesses
              and consumers face significant challenges:
            </p>
            <ul className="list-disc md:pl-6 pl-3 space-y-1.5">
              <li className="text-lg lg:text-xl text-[#000000CC] font-[400] font-marcellus ">
                <span className="block font-bold">Lack of Transparency:</span>
                <p>
                  Consumers have no verifiable way to know a product&apos;s true
                  origin, journey, or authenticity.
                </p>
              </li>
              <li className="text-lg lg:text-xl text-[#000000CC] font-[400] font-marcellus ">
                <span className="block font-bold">Rampant Counterfeiting:</span>
                <p>
                  Illegitimate goods erode brand trust, cause economic loss, and
                  can pose serious safety risks.
                </p>
              </li>
              <li className="text-lg lg:text-xl text-[#000000CC] font-[400] font-marcellus ">
                <span className="block font-bold">
                  Inefficiency &amp; Fraud:
                </span>
                <p>
                  Manual, paper-based tracking is slow, prone to errors, and
                  susceptible to fraudulent alterations.
                </p>
              </li>
              <li className="text-lg lg:text-xl text-[#000000CC] font-[400] font-marcellus ">
                <span className="block font-bold">Siloed Data:</span>
                <p>
                  Participants in the supply chain (suppliers, distributors,
                  retailers) cannot easily and securely share data, leading to
                  delays and disputes.
                </p>
              </li>
            </ul>
          </div>

          {/* text */}
          <div className="w-full flex flex-col items-start justify-center lg:gap-5 gap-4 md:order-3 order-4">
            <h1 className="text-xl lg:text-2xl font-nunitoSans font-bold uppercase">
              Chronify: Illuminating the Journey with Verifiable Trust
            </h1>
            <p className="text-lg lg:text-xl text-[#000000CC] font-[400] font-marcellus">
              Chronify transforms the supply chain by creating a single,
              immutable source of truth on the Hedera network. Each product is
              assigned a unique digital identity as an ERC-721 NFT, and its
              entire lifecycle—from creation to final delivery—is recorded
              on-chain.
            </p>
            <p className="text-lg lg:text-xl text-[#000000CC] font-[400] font-marcellus">
              By leveraging Hedera&apos;s high-throughput, low-fee, and
              leaderless aBFT consensus, Chronify provides a real-time,
              tamper-proof audit trail that is accessible to all permissioned
              stakeholders. This isn&apos;t just tracking; it&apos;s digital
              proof of provenance.
            </p>
          </div>

          {/* image */}
          <div className="w-full md:order-4 order-3">
            <Image
              src={solutionSVG}
              className="w-full lg:h-[700px] h-[300px]"
              alt="spiral"
              width={473}
              height={547}
            />
          </div>
        </MaxWrapper>
      </section>
    </Element>
  );
};

export default WhyChronify;
