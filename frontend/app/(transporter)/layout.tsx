"use client";
import Footer from "@/components/shared/dash-footer";
import Header from "@/components/shared/header";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/shared/logo";
import { IoIosArrowRoundBack } from "react-icons/io";
import { MdDeliveryDining } from "react-icons/md";
import { GoGear } from "react-icons/go";
import { useAppKitAccount } from "@reown/appkit/react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const { isConnected } = useAppKitAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  return (
    <div className=" bg-white lg:p-1.5">
      {/* Page Wrapper Start  */}
      <div className="flex h-screen gap-1 overflow-hidden">
        {/* Sidebar Start */}
        <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* Sidebar End  */}

        {/* Content Area Start  */}
        <div className="relative flex min-h-screen rounded-t-[8px] bg-white flex-1 border border-[#E5E7EB] flex-col justify-between overflow-y-auto overflow-x-hidden no-scrollbar">
          <section>
            {/*  Header Start */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/*  Header End */}

            {/*  Main Content Start */}
            <main>
              <div className="mx-auto 2xl:max-w-screen-2xl max-w-[800px] mt-4 pb-6 md:pt-4 md:pb-10 2xl:p-10">
                <section className="w-full lg:px-1.5 px-3">{children}</section>
              </div>
            </main>
          </section>
          {/*  Main Content End  */}
          <Footer />
        </div>
        {/*  Content Area End  */}
      </div>
      {/*  Page Wrapper End  */}
    </div>
  );
}

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
                {SideBarLinks.map((link, index: number) => (
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

const SideBarLinks = [
  {
    href: "/transport",
    title: "Delivery",
    icon: <MdDeliveryDining className="w-[20px] h-[20px]" />,
  },
  {
    href: "/transport/account",
    title: "Account",
    icon: <GoGear className="w-[20px] h-[20px]" />,
  },
];
