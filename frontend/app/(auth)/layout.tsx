'use client';
import useGetUser from "@/hooks/useGetUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const userData = useGetUser();

  useEffect(() => {
    // Only redirect if we have user data and user is registered
    if (userData?.isRegistered) {
      const { roleString } = userData;

      if (roleString === "Supplier" || roleString === "Retailer") {
        router.push("/dashboard");
      } else if (roleString === "Transporter") {
        router.push("/transport");
      }
    }
  }, [userData, router]);

  return <main className="w-full">{children}</main>;
}
