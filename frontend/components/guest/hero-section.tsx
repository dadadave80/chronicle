import { RetroGrid } from "../magicui/retro-grid";

const HeroSection = () => {
  return (
    <section className="w-full h-[100dvh] md:h-[100dvh] bg-white relative overflow-hidden">
      {/* Container for your main text content, centered */}
      <div className="flex flex-col items-center justify-center w-full h-full px-4 lg:px-0">
        <h1 className="text-5xl md:text-6xl lg:text-8xl tracking-tighter capitalize font-ibm font-extrabold text-center text-[#000000E5] max-w-[1200px]">
          Trace Every Step with Chronify
        </h1>
        <p className="mt-4 md:text-3xl text-xl font-marcellus text-[#000000CC] font-medium text-center max-w-4xl">
          Chronify, empowers businesses and consumers with a secure, scalable
          platform to track products from origin to you.
        </p>
        <div className="w-full flex md:flex-row flex-col justify-center items-center md:gap-6 gap-4 lg:mt-8 mt-6">
          <button
            type="button"
            className="h-[45px] flex justify-center items-center bg-black rounded-[8px] cursor-pointer text-base  font-[500] font-nunitoSans text-white px-6 border border-black"
          >
            Track your Product
          </button>
          <button
            type="button"
            className="h-[45px] flex justify-center items-center bg-white rounded-[8px] cursor-pointer text-base  font-[500] font-nunitoSans text-black px-6 border border-black"
          >
            Explore the Tech
          </button>
        </div>
      </div>

      {/*Retro Grid*/}
      <RetroGrid />
    </section>
  );
};

export default HeroSection;
