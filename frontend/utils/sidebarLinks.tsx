import { SideBarLinksTypes } from "@/types";
import { GoHome, GoGear } from "react-icons/go";
import { MdOutlineInventory, MdOutlineLocalShipping } from "react-icons/md";

export const SideBarLinks: SideBarLinksTypes[] = [
  {
    href: "/dashboard",
    title: "Home",
    icon: <GoHome className="w-[20px] h-[20px]" />,
  },
  {
    href: "/dashboard/products",
    title: "Products",
    icon: <MdOutlineInventory className="w-[20px] h-[20px]" />,
  },
  {
    href: "/dashboard/shipments",
    title: "Shipments",
    icon: <MdOutlineLocalShipping className="w-[20px] h-[20px]" />,
  },
  {
    href: "/dashboard/account",
    title: "Account",
    icon: <GoGear className="w-[20px] h-[20px]" />,
  },
];
