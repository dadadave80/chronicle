"use client";
import Footer from "@/components/shared/dash-footer";
import Header from "@/components/shared/header";
import SideBar from "@/components/shared/sidebar";
import { useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
