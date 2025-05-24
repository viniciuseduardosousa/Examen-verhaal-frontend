import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileSettingsDialog from './ProfileSettingsDialog';
import { profileAPI } from '../../services/adminApi';

const AdminHeader = ({ onLogout }) => {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const data = await profileAPI.getOvermij();
        setProfilePhoto(data.afbeelding || "/src/assets/images/ingrid.jpg");
      } catch (error) {
        console.error('Error fetching profile photo:', error);
        setProfilePhoto("/src/assets/images/ingrid.jpg");
      }
    };

    fetchProfilePhoto();

    const handleProfileUpdate = () => {
      fetchProfilePhoto();
    };

    window.addEventListener('profileDataUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileDataUpdated', handleProfileUpdate);
    };
  }, []);

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Link to="/">
          <h1 className="text-xl font-mono font-bold">IngsScribblings</h1>
        </Link>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gray-400/40 transform translate-x-1 translate-y-1 
                       group-hover:translate-x-0.5 group-hover:translate-y-0.5 
                       transition-transform duration-200 rounded-full opacity-0 group-hover:opacity-100"></div>
            <button
              onClick={() => setIsProfileDialogOpen(true)}
              className="relative w-12 h-12 rounded-full overflow-hidden hover:opacity-90 transition-opacity border-2 border-gray-800"
            >
              <img 
                src={profilePhoto} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  <path d="m15 5 4 4"/>
                </svg>
              </div>
            </button>
          </div>
        <button 
          onClick={onLogout}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          Log-out
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.33333 18C2.96667 18 2.65278 17.8694 2.39167 17.6083C2.13056 17.3472 2 17.0333 2 16.6667V7.33333C2 6.96667 2.13056 6.65278 2.39167 6.39167C2.65278 6.13056 2.96667 6 3.33333 6H8V7.33333H3.33333V16.6667H8V18H3.33333ZM10.6667 15.3333L9.75 14.3667L11.45 12.6667H6V11.3333H11.45L9.75 9.63333L10.6667 8.66667L14 12L10.6667 15.3333Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      </div>

      {/* Welcome message */}
      <h2 className="text-xl font-mono font-bold mb-6">welkom, Ingrid</h2>

      {/* Profile Settings Dialog */}
      <ProfileSettingsDialog
        isOpen={isProfileDialogOpen}
        onClose={() => setIsProfileDialogOpen(false)}
      />
    </>
  );
};

export default AdminHeader; 