import "boxicons/css/boxicons.min.css";

const Footer = () => {
  return (
    <footer className="flex items-center justify-between lg:mt-[15%] mt-[25%] py-8 lg:px-32 md:px-16 px-8 border-t-[0.3px] border-[#babaff]">
      <img className="h-10" src="/images/illu-text.png" alt="illu-text" />
      <img
        className="h-16 md:inline hidden"
        src="/images/illu-logo.png"
        alt="illu-logo"
      />

      <div className="flex gap-4">
        <a
          className="text-2xl md:text-3xl hover:text-violet-600 duration-300"
          href="#"
        >
          <i class="bx  bxl-twitter"></i>
        </a>
        <a
          className="text-2xl md:text-3xl hover:text-violet-600 duration-300"
          href="#"
        >
          <i class="bx  bxl-youtube"></i>
        </a>
        <a
          className="text-2xl md:text-3xl hover:text-violet-600 duration-300"
          href="#"
        >
          <i class="bx  bxl-discord"></i>
        </a>
        <a
          className="text-2xl md:text-3xl hover:text-violet-600 duration-300"
          href="#"
        >
          <i class="bx  bxl-linkedin-square"></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
