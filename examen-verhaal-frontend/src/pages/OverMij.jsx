import React, { useState, useEffect } from 'react';
import HeaderSection from '../components/sections/HeaderSection';
import DeveloperSection from '../components/sections/DeveloperSection';

const OverMij = () => {
  const [profileData, setProfileData] = useState({
    tekst: '',
    afbeelding: null
  });

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://vinininja123.pythonanywhere.com'}/overmijpagina/overmij/`);
      if (response.ok) {
        const data = await response.json();
        setProfileData({
          tekst: data.tekst || '',
          afbeelding: data.afbeelding || null
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  useEffect(() => {
    fetchProfileData();

    const handleProfileUpdate = () => {
      fetchProfileData();
    };

    window.addEventListener('profileDataUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileDataUpdated', handleProfileUpdate);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 pt-40 pb-20">
      <HeaderSection profilePhoto={profileData.afbeelding} />

      <div className="max-w-3xl mx-auto animate-slideDown">
        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">Over Mij</h2>
          
          <p className="text-gray-600 leading-relaxed mb-16">
            {profileData.tekst || "Op deze site staan korte verhalen, columns, 50-woordenverhalen en andere literaire schetsen en schrijfsels. De naam 'Ings' verwijst naar de schrijver, en 'Scribblings' naar het plezier van schrijven zonder vaste kaders."}
          </p>
        </article>
        
        <div className="flex items-center my-16">
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        
        <DeveloperSection />
      </div>
    </div>
  );
};

export default OverMij; 