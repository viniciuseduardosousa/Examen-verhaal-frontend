import React from 'react';

const ProfilePhotoUpload = ({ photoPreview, onPhotoChange, onPhotoRemove }) => {
  return (
    <div>
      <label className="block text-sm font-mono font-bold mb-1">
        Profielfoto
      </label>
      <div className="relative w-48 h-48 mx-auto flex items-center justify-center border-2 border-dashed border-gray-400 rounded-full bg-[#D9D9D9] cursor-pointer group overflow-hidden">
        <input
          type="file"
          name="profilePhoto"
          onChange={onPhotoChange}
          accept="image/*"
          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
          tabIndex="-1"
        />
        {photoPreview ? (
          <>
            <img src={photoPreview} alt="Preview profiel" className="w-full h-full object-cover" />
            <div 
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center z-20 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                document.querySelector('input[name="profilePhoto"]').click();
              }}
            >
              <div className="flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-white text-sm font-mono">
                  Klik om te vervangen
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPhotoRemove();
                  }}
                  className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  title="Verwijder profielfoto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_159_301)">
                <path d="M30 26.6667L22.5 20M22.5 20L15 26.6667M22.5 20V35M38.2312 30.65C40.06 29.7638 41.5047 28.3615 42.3373 26.6644C43.1698 24.9673 43.3429 23.072 42.8291 21.2778C42.3154 19.4836 41.144 17.8925 39.5 16.7557C37.856 15.619 35.8329 15.0012 33.75 15H31.3875C30.82 13.0487 29.7622 11.2372 28.2937 9.70165C26.8251 8.16608 24.9841 6.94641 22.9089 6.13434C20.8338 5.32227 18.5785 4.93892 16.3127 5.01313C14.0469 5.08734 11.8295 5.61716 9.8272 6.56277C7.82491 7.50838 6.08983 8.84516 4.75241 10.4726C3.415 12.1001 2.51004 13.9759 2.10559 15.959C1.70113 17.9421 1.8077 19.9809 2.41727 21.9221C3.02685 23.8633 4.12358 25.6564 5.625 27.1667" stroke="#F3F3F3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_159_301">
                  <rect width="45" height="40" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <span className="text-gray-500 text-center text-sm select-none pointer-events-none z-0">Klik om profielfoto toe te voegen</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePhotoUpload; 