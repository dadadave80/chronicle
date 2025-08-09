"use client";
import { useEffect, useRef } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import Logo from "./logo";
import { SideBarLinks } from "@/utils/sidebarLinks";
import { SideBarLinksTypes } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBar = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const trigger = useRef(null);
  const sidebar = useRef(null);

  const pathname = usePathname();



  const handleCloseSideBar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const toggleScroll = () => {
      document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
    };
    toggleScroll();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-[9999] flex h-[100dvh] w-72 flex-col justify-between overflow-y-hidden bg-black duration-300 ease-linear rounded-[8px] lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      <div className="flex flex-col">
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex flex-col gap-2 font-barlow px-6 py-8 lg:py-6.5">
          <div className="flex items-start justify-between gap-2  ">
            <Logo
              classname="md:w-[180px] w-[125px]"
              href="/"
              image="/black.png"
            />

            <button
              ref={trigger}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              className="block lg:hidden text-gray-100"
            >
              <IoIosArrowRoundBack className="text-2xl" />
            </button>
          </div>
        </div>

        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 pb-4 px-4 lg:mt-12 lg:px-6">
            {/* <!-- Menu Group --> */}
            <div>
              <ul className="font-ibm flex flex-col gap-6">
                {/* <!-- Menu Item Calendar --> */}
                {SideBarLinks.map((link: SideBarLinksTypes, index: number) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-2 text-sm md:text-base font-[500] p-[12px] rounded-[8px] font-ibm text-gray-300 transition-all border-b  border-[#E5E7EB] hover:text-gray-50 ${pathname === link.href && "bg-white  text-gray-800 hover:text-gray-800"}`}
                      onClick={handleCloseSideBar}
                    >
                      {link.icon}
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
