const HeroSection = () => {
  return (
    <section className="w-full h-[calc(100dvh-96px)] md:h-[calc(100dvh-110px)] bg-white relative overflow-hidden">
      {/* Container for your main text content, centered */}
      <div className="absolute inset-0 flex flex-col lg:items-start md:items-center justify-center z-10 pl-4 md:pl-8 xl:pl-32">
        <h1 className="text-4xl font-nunitoSans md:text-6xl xl:text-7xl md:text-center lg:text-start font-extrabold text-white">
          A New Dimension <br /> of Stability
        </h1>
        <p className="mt-4 text-xl xl:text-2xl font-marcellus text-[#FFFFFFCC] md:text-center lg:text-start max-w-xl xl:max-w-3xl">
          EulerFi turns data into steady returns, charts a path to financial
          resilience and unlock new growth opportunities.
        </p>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 md:-right-[10%] xl:-right-[5%] w-[90vh] h-[90vh] md:w-[100vh] md:h-[100vh] z-0 opacity-60 lg:opacity-100"></div>
    </section>
  );
};

export default HeroSection;
