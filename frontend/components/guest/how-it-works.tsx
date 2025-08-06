"use client";
import { Element } from "react-scroll";

const HowItWorks = () => {
  return (
    <Element name="how-it-works" className="w-full">
      <section className="w-full lg:py-38 py-16 bg-black text-gray-100">
        <div className="container max-w-7xl px-4 mx-auto">
          <div className="grid gap-4 mx-4 sm:grid-cols-12">
            <div className="col-span-12 sm:col-span-4">
              <div className="text-center sm:text-left mb-10 before:block before:w-24 before:h-3 before:mb-5 before:rounded-md before:mx-auto sm:before:mx-0 before:bg-gray-200">
                <h3 className="font-semibold text-3xl md:text-4xl lg:text-5xl font-ibm text-gray-100">
                  How It Works
                </h3>
                <span className="text-base md:text-xl block mt-2 font-bold font-marcellus uppercase text-gray-200">
                  A Simple, Transparent Flow
                </span>
              </div>
            </div>
            <div className="relative col-span-12 space-y-6 sm:col-span-8">
              <div className="col-span-12 space-y-12 relative sm:col-span-8 sm:space-y-8 before:absolute before:top-2 before:bottom-0 before:w-0.5 before:-left-3 before:bg-gray-300 px-4">
                <div className="flex flex-col relative before:absolute before:top-2 before:w-4 before:h-4 before:rounded-full before:left-[-35px] before:z-[1] before:bg-gray-400">
                  <h3 className="text-lg md:text-2xl font-bold font-nunitoSans tracking-wide">
                    A Trusted Partner Joins
                  </h3>
                  <p className="mt-2 font-marcellus text-base md:text-lg">
                    A manufacturer or brand who wants to prove the authenticity
                    of their products joins the Chronify network. We verify them
                    first, so you know their products in the system are
                    legitimate from the start.
                  </p>
                </div>
                <div className="flex flex-col relative before:absolute before:top-2 before:w-4 before:h-4 before:rounded-full before:left-[-35px] before:z-[1] before:bg-gray-400">
                  <h3 className="text-lg md:text-2xl font-bold font-nunitoSans tracking-wide">
                    A Digital Passport is Created
                  </h3>
                  <p className="mt-2 font-marcellus text-base md:text-lg">
                    The moment a new product is made, it’s given its own unique
                    digital passport. This isn&apos;t a paper document;
                    it&apos;s a secure, one-of-a-kind digital record that
                    contains all the important details, like when, where, and
                    what it was made of. This passport is impossible to fake or
                    alter.
                  </p>
                </div>
                <div className="flex flex-col relative before:absolute before:top-2 before:w-4 before:h-4 before:rounded-full before:left-[-35px] before:z-[1] before:bg-gray-400">
                  <h3 className="text-lg md:text-2xl font-bold font-nunitoSans tracking-wide">
                    Every Move is Logged
                  </h3>
                  <p className="mt-2 font-marcellus text-base md:text-lg">
                    As the product travels from the factory, to a distributor,
                    and then to a store, its digital passport gets a new
                    &quot;stamp&quot; at every stop. This creates a live
                    timeline of its journey, showing exactly where it has been
                    and who has handled it.
                  </p>
                </div>
                <div className="flex flex-col relative before:absolute before:top-2 before:w-4 before:h-4 before:rounded-full before:left-[-35px] before:z-[1] before:bg-gray-400">
                  <h3 className="text-lg md:text-2xl font-bold font-nunitoSans tracking-wide">
                    Handovers are Securely Confirmed
                  </h3>
                  <p className="mt-2 font-marcellus text-base md:text-lg">
                    Each time the product changes hands, the new person scans it
                    to confirm they&apos;ve received it. This action adds a new,
                    permanent entry to the product&apos;s story. Because every
                    step is locked in, no one can secretly change the records or
                    slip a counterfeit item into the supply chain.
                  </p>
                </div>
                <div className="flex flex-col relative before:absolute before:top-2 before:w-4 before:h-4 before:rounded-full before:left-[-35px] before:z-[1] before:bg-gray-400">
                  <h3 className="text-lg md:text-2xl font-bold font-nunitoSans tracking-wide">
                    Scan and See the Full Story
                  </h3>
                  <p className="mt-2 font-marcellus text-base md:text-lg">
                    Finally, you can see the entire journey for yourself. Just
                    scan the QR code on the package with your phone. You&apos;ll
                    instantly see the product&apos;s complete, verified
                    history—from its origin to the shelf in front of you. Buy
                    with total confidence, knowing exactly where your item came
                    from.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Element>
  );
};

export default HowItWorks;
