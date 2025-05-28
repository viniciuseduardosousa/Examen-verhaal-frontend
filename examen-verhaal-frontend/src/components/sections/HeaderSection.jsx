import React from 'react';

const HeaderSection = ({ profilePhoto, subtitle }) => {
  return (
    <div className="max-w-4xl mx-auto mb-24">
      <div className="flex flex-col items-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 text-center">IngsScribblings</h1>
      </div>

      {profilePhoto && (
        <div className="flex justify-center mb-20 animate-slideDown">
          <div className="w-64 h-64 md:w-80 md:h-80 relative group">
            <div className="absolute inset-0 bg-gray-400/80 transform translate-x-2 translate-y-2 
                       group-hover:translate-x-1 group-hover:translate-y-1 
                       transition-transform duration-200"></div>
            <img 
              src={profilePhoto}
              alt="Profielfoto" 
              className="relative w-full h-full object-cover border-2 border-gray-800"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderSection; 