import { IBM_Plex_Mono, Nunito_Sans, Marcellus } from "next/font/google";
import "@/styles/globals.css";
import { getMetadata } from "@/utils/getMetadata";

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
  weight: "400",
});

export const metadata = getMetadata({
  title: "Chronify: Stable Web3 Investments for Predictable Growth",
  description:
    "Chronify is a revolutionary fintech protocol offering reliable, appreciating digital assets that provide stability and consistent returns, serving as a safe haven from market volatility. Our core offering, $FIBO, is engineered for zero downside risk, appreciating in predictable stages to mimic the stability of traditional bonds. Invest with confidence and achieve steady, transparent returns with Chronify.",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunitoSans.variable} ${marcellus.variable} ${ibmplexmono.variable} antialiased bg-white`}
      >
        {children}
      </body>
    </html>
  );
}
