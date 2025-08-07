"use client";
import { useEffect, useState } from "react";
import Logo from "./logo";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const [year, setYear] = useState("");

  useEffect(() => {
    const year = new Date().getFullYear();
    setYear(year.toString());
  }, []);

  return (
    <footer className="w-[96%] mx-auto max-w-[1500px] rounded-[20px] mb-6  bg-black flex flex-col lg:px-20 md:px-12 px-4 ">
      <section className="w-full flex md:flex-row flex-col md:justify-between justify-center items-center gap-6 md:gap-0 border-b border-gray-400 py-8">
        <Logo classname="md:w-[150px] w-[120px]" href="/" image="/black.png" />

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-300 transition hover:text-gray-100"
          >
            <FaGithub className="w-6 h-6" />
          </Link>
          <Link
            href="/"
            className="text-gray-300 transition hover:text-gray-100"
          >
            <FaXTwitter className="w-6 h-6" />
          </Link>
          <Link
            href="/"
            className="text-gray-300 transition hover:text-gray-100"
          >
            <FaLinkedin className="w-6 h-6" />
          </Link>
        </div>
      </section>
      <section className="w-full flex md:flex-row flex-col md:justify-between justify-center items-center gap-4 md:gap-0 py-8">
        <p className="text-sm md:text-base font-[400] font-poppins text-gray-200">
          Made by the Chronify Team
        </p>
        <p className="font-[400] font-poppins md:text-base text-sm text-gray-200">
          © {year} Chronify. All rights reserved.
        </p>
      </section>
    </footer>
  );
};

export default Footer;
