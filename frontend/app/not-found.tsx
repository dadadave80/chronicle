"use client";
import Link from "next/link";
import { TbError404 } from "react-icons/tb";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-white p-4 fixed top-0 left-0 z-[999]">
      {/* 404 Icon */}
      <TbError404 className="md:w-[300px] md:h-[300px] w-[200px] h-[200px] text-[#000000E5]" />

      {/* Heading */}
      <h1 className="text-center text-[#000000E5]/90 font-marcellus font-bold lg:text-[52px] lg:leading-[52px] text-[36px] leading-[36px] tracking-tight lg:-mt-6 mb-4">
        Page is not chronified yet!
      </h1>

      {/* Subtext */}
      <p className="text-lg text-[#000000E5]/70 font-normal font-nunitoSans mb-6 text-center max-w-[500px]">
        This page seems to have de-pegged from our ecosystem. Let&apos;s
        rebalance and get you back on track!
      </p>

      {/* Action Buttons */}
      <div className="w-full flex justify-center items-center gap-4 md:gap-8">
        <Link
          href="/"
          className="w-[150px] h-[45px] flex justify-center items-center rounded-lg bg-[#000000E5] text-white font-nunitoSans font-medium shadow-lg text-sm hover:bg-black transition"
        >
          Return Home
        </Link>

        <button
          type="button"
          onClick={() => router.back()}
          className="w-[150px] h-[45px] flex justify-center items-center bg-[#FFFFFF0D] border-[#545454] rounded-lg border shadow-sm cursor-pointer text-sm font-medium font-nunitoSans text-white hover:bg-white hover:border-[#000000E5] hover:text-[#000000E5] transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
