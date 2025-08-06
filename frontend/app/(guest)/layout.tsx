// import Footer from "@/components/shared/footer";
import NavBar from "@/components/shared/navbar";

export default function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full">
      <NavBar />
      {children}
      {/*<Footer />*/}
    </main>
  );
}
