const Hero = () => {
  return (
    <main className="relative w-full h-screen overflow-hidden flex justify-center mb-[5%]">
      <video
        src="/videos/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-[95%] object-cover top-0 first-letter:left-0 -z-10"
      ></video>

      <div className="absolute bottom-[15%] flex flex-col items-center gap-5">
        <img
          src="/images/illu-text.png"
          alt="illu-text"
          className="md:w-[30rem] w-[20rem]"
        />

        <h1 className="md:text-2xl text-1xl font-bold">
          Explore, Capture, Conquer
        </h1>

        <div className="md:w-[75%] w-[60%] h-[0.1px] bg-[#baba]"></div>

        <button className="h-10 px-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg font-medium text-nowrap hover:opacity-70 transition-all duration-300">
          PLAY NOW
        </button>

        <div className="flex gap-5 items-center text-3xl font-extrabold text-gray-200">
          <img
            className="md:h-16 h-12"
            src="/images/illu-logo.png"
            alt="illu-logo"
          />{" "}
          Zero
        </div>

        <p className="text-center text-[#baba] md:w-[80%]">
          Notice: Illuvim Games are in Beta. Participation involves risk. Read
          our full Diclaimer here.
        </p>
      </div>

      <div className="absolute bottom-28 lg:right-10 right-5 mt-24 animate-bounce sm:inline-block hidden">
        <div className="flex flex-col items-center">
          <div className="w-8 h-12 border-2 border-[#babaff] rounded-full flex justify-center pt-1">
            <div className="w-1 h-3 bg-[#babaff] rounded-full animate-pulse"></div>
          </div>
          <p className="mt-2 text-[#babaff]">Scroll Down</p>
        </div>
      </div>
    </main>
  );
};

export default Hero;
