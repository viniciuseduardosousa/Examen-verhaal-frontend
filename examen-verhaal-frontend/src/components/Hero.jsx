import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#FFFFF5] pt-24">
      <div className="text-center px-4">
        <h1 className="text-[3rem] md:text-[5.5rem] leading-none font-medium mb-8 md:mb-16 text-gray-800 tracking-tighter">
        Ingscribblings
        </h1>
        
        <div className="relative inline-block group">
          <div 
            className="absolute inset-0 bg-gray-400/80 transform translate-x-2 translate-y-2 
                     md:translate-x-3 md:translate-y-3 
                     group-hover:translate-x-1 group-hover:translate-y-1
                     md:group-hover:translate-x-2 md:group-hover:translate-y-2 
                     transition-transform duration-200"
          >
          </div>
          <Link
            to="/verhalen"
            className="relative inline-block px-6 md:px-24 py-3 md:py-5 text-lg md:text-[1.5rem] font-medium text-gray-800 
                     bg-[#DFE9EB] border-2 border-gray-800
                     transform transition-all duration-200
                     hover:scale-[1.02] hover:-rotate-1
                     active:scale-95 active:rotate-0
                     w-[280px] md:w-auto md:min-w-[400px]"
          >
            Bekijk alle verhalen
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero; 