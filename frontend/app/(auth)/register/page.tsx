import RegisterForm from "@/components/auth/register-form";
import Logo from "@/components/shared/logo";

export default function Register() {
  return (
    <main className="w-full min-h-[100dvh] grid md:grid-cols-8 px-5 md:px-0">
      <section className="md:col-span-3 hidden md:flex flex-col justify-center items-center bg-[#000000] overflow-hidden relative lg:pt-12 pt-8 lg:px-12 px-6 gap-16">
        <Logo classname="md:w-[240px] w-[115px]" href="/" image="/black.png" />
        <div className="px-6 flex flex-col justify-center items-center gap-10">
          <h3 className="text-4xl text-center font-bold font-ibm text-white">
            Track products from origin to consumer with verifiable trust and
            efficiency
          </h3>
          <p className="text-xl font-[400] font-marcellus capitalize text-gray-300">
            Register to manage and track products
          </p>
        </div>
      </section>
      <section className="md:col-span-5 flex justify-center items-center bg-white">
        <RegisterForm />
      </section>
    </main>
  );
}
