"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AiOutlineMenu } from "react-icons/ai";
import { Link as Spy } from "react-scroll";
import Logo from "./logo";
import { MdOutlineArrowOutward } from "react-icons/md";

const MobileNav = () => {
  const [year, setYear] = useState("");

  useEffect(() => {
    const year = new Date().getFullYear();
    setYear(year.toString());
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="w-[39px] h-[39px] flex justify-center items-center bg-black rounded-[4px] text-gray-100 cursor-pointer border-[1px] border-white/15">
          <AiOutlineMenu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-full bg-gray-200 border-none outline-none">
        <SheetHeader className="w-full pt-8">
          <Logo classname="w-[160px]" image="/black_logo.png" href="/" />
          <SheetDescription className="text-gray-800 font-nunitoSans pl-2 text-base">
            Explore EulerPhi, the fintech platform offering stable, appreciating
            digital assets for Web3 investors.
          </SheetDescription>
        </SheetHeader>
        <main className="w-full h-[420px] overflow-y-auto no-scrollbar flex flex-col">
          {/* Navigation Links */}
          <nav className="w-full mt-4 flex flex-col px-6">
            <SheetClose asChild>
              <Spy
                to="whyStrimz"
                smooth={true}
                spy={true}
                duration={500}
                className={`capitalize font-poppins text-strimzPrimary font-[500] text-2xl cursor-pointer hover:underline flex items-center gap-2`}
              >
                why strimz?
                <MdOutlineArrowOutward className="w-6 h-6" />
              </Spy>
            </SheetClose>
            <SheetClose asChild>
              <Spy
                to="features"
                smooth={true}
                spy={true}
                duration={500}
                className={`capitalize font-poppins text-strimzPrimary font-[500] text-2xl cursor-pointer hover:underline flex items-center gap-2`}
              >
                features
                <MdOutlineArrowOutward className="w-6 h-6" />
              </Spy>
            </SheetClose>
          </nav>
        </main>
        <SheetFooter>
          <p className=" text-gray-900 text-center font-nunitoSans text-xs">
            &copy; {year} EulerPhi. All rights reserved.
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
