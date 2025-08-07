"use client";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Logo from "./logo";
import { Link as Spy } from "react-scroll";
import MaxWrapper from "./max-wrapper";
import MobileNav from "./mobile-nav";
import { NavLinks } from "@/utils/navLinkData";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  const router = useRouter();

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
      className="fixed lg:top-[20px] top-[10px] left-[50%] translate-x-[-50%] w-[95%] md:w-[70%] max-w-[1400px] z-50 bg-white/20 backdrop-blur-[20px] backdrop-filter rounded-[8px] border border-[#E5E7EB]"
    >
      <nav className="w-full flex items-center justify-between md:py-5 py-4 md:px-8 px-4">
        {/* Logo */}
        <Logo
          classname="md:w-[140px] w-[115px]"
          href="/"
          image="/white-logo-nobg.png"
        />

        {/* Nav Links With Mega Menu Dropdown */}
        <div className="hidden lg:flex gap-[24px] items-center">
          {NavLinks.map((link, index) => (
            <Spy
              key={index}
              to={link.to}
              smooth={true}
              spy={true}
              duration={700}
              className={`capitalize font-ibm text-gray-700 hover:text-[#000000E5] font-normal text-base cursor-pointer transition-all`}
            >
              {link.name}
            </Spy>
          ))}
        </div>

        <div className="flex items-center gap-[18px]">
          {/* CTA Button */}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="md:w-[140px] w-[110px] md:h-[45px] h-[40px] flex justify-center items-center bg-[#000000E5] rounded-[8px] cursor-pointer md:text-base text-[14px] font-[500] font-nunitoSans text-white"
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
