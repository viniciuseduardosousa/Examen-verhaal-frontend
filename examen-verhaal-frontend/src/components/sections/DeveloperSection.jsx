import React from 'react';

const DeveloperCard = ({ name, role, linkedinUrl }) => (
  <a 
    href={linkedinUrl} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
  >
    <h3 className="font-semibold text-lg mb-2 text-gray-800">{name}</h3>
    <p className="text-gray-600 text-sm mb-3">{role}</p>
    <div className="flex justify-center">
      <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    </div>
  </a>
);

const DeveloperSection = () => {
  const developers = [
    {
      name: 'Calvin Heeres',
      role: 'Frontend Developer',
      linkedinUrl: 'https://www.linkedin.com/in/calvin-heeres/'
    },
    {
      name: 'Udayamar Singh',
      role: 'Frontend Developer',
      linkedinUrl: 'https://www.linkedin.com/in/udayamarsingh/'
    },
    {
      name: 'Vinicius De Sousa',
      role: 'Backend Developer',
      linkedinUrl: 'https://www.linkedin.com/in/viniciuseduardosousa/'
    }
  ];

  return (
    <>
      <div className="text-center mb-10">
        <h3 className="text-xl font-semibold mb-10 text-gray-700">Developers</h3>
      </div>
      <p className="text-center text-gray-500 italic text-sm mb-10">
        Met veel dank aan deze ontwikkelaars voor het maken van deze site!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {developers.map((dev, index) => (
          <DeveloperCard key={index} {...dev} />
        ))}
      </div>
    </>
  );
};

export default DeveloperSection; 