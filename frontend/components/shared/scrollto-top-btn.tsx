"use client";
import { useEffect, useState } from "react";
import { MdDoubleArrow } from "react-icons/md";

const ScrollToTopBtn = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls down 200px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Scroll to top when button is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed md:bottom-8 md:right-8 bottom-6 right-4 z-[999]">
      {isVisible && (
        <button
          type="button"
          onClick={scrollToTop}
          className="px-3.5 py-3.5 duration-200 transition-all text-white md:text-2xl text-base rounded-[8px] bg-gradient-to-br from-black to-[#000000E5]"
        >
          <MdDoubleArrow className=" -rotate-90" />
        </button>
      )}
    </div>
  );
};

export default ScrollToTopBtn;
