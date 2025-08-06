"use client";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Logo from "./logo";
import { Link as Spy } from "react-scroll";
import MaxWrapper from "./max-wrapper";
import MobileNav from "./mobile-nav";

const Navbar = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  // This hook listens for changes in the scrollY motion value
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    // Check if user is scrolling down and is past a certain threshold (e.g., 150px)
    if (previous !== undefined && latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <MaxWrapper
      as={motion.header}
      variants={{
        visible: { y: 0 },
        hidden: { y: "-120%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut", delay: 0.5 }}
      className="fixed lg:top-[20px] top-[10px] left-[50%] translate-x-[-50%] w-[95%] lg:w-1/2 md:w-[70%] max-w-[1400px] z-50 bg-black/60 backdrop-blur-[20px] backdrop-filter rounded-[8px]"
    >
      <nav className="w-full flex items-center justify-between py-5 md:px-8 px-6">
        {/* Logo */}
        <Logo
          classname="md:w-[115px] w-[100px]"
          href="/"
          image="/white_logo.svg"
        />

        {/* Nav Links With Mega Menu Dropdown */}
        <div className="hidden md:flex gap-[24px] font-nunitoSans items-center">
          <Spy
            to="whyStrimz"
            smooth={true}
            spy={true}
            duration={700}
            className={`capitalize font-poppins text-[#58556A] font-[500] text-[16px] cursor-pointer transition-all hover:text-strimzPrimary`}
          >
            why strimz?
          </Spy>
          <Spy
            to="features"
            smooth={true}
            spy={true}
            duration={500}
            className={`capitalize font-poppins text-[#58556A] font-[500] text-[16px] cursor-pointer transition-all hover:text-strimzPrimary`}
          >
            features
          </Spy>
        </div>

        <div className="flex items-center gap-[18px]">
          {/* CTA Button */}
          <button
            type="button"
            className="md:w-[130px] w-[110px] h-[40px] flex justify-center items-center bg-[#F9FAFB] rounded-[8px] border border-[#E5E7EB] shadow-[0px_-2px_4px_0px_#00000014_inset] cursor-pointer text-[14px] font-[600] font-poppins text-strimzBrandAccent"
          >
            Launch App
          </button>
          {/* Mobile Nav */}
          <div className="lg:hidden flex items-center">
            <MobileNav />
          </div>
        </div>
      </nav>
    </MaxWrapper>
  );
};

export default Navbar;
