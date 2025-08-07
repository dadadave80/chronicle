import { IBM_Plex_Mono, Nunito_Sans, Marcellus } from "next/font/google";
import "@/styles/globals.css";
import { getMetadata } from "@/utils/getMetadata";
import ContextProvider from "@/context";
import { headers } from "next/headers";
import { Toaster } from "sonner";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
});

const marcellus = Marcellus({
  subsets: ["latin"],
  variable: "--font-marcellus",
  weight: "400",
});

const ibmplexmono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = getMetadata({
  title: "Chronify: The Future of Supply Chain Transparency, Built on Hedera",
  description:
    "Chronify leverages the power of Hedera and the modular EIP-2535 Diamond Standard to deliver an unparalleled, secure, and scalable supply chain solution. Track products from origin to consumer with verifiable trust and efficiency.",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunitoSans.variable} ${marcellus.variable} ${ibmplexmono.variable} antialiased bg-white`}
      >
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
