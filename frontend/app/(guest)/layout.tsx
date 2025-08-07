import Footer from "@/components/shared/footer";
import NavBar from "@/components/shared/navbar";
import ScrollToTopBtn from "@/components/shared/scrollto-top-btn";

export default function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full">
      <NavBar />
      {children}
      <ScrollToTopBtn />
      <Footer />
    </main>
  );
}
