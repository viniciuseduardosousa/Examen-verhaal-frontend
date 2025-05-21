const OverMij = () => {
  return (
    <div className="container mx-auto px-4 pt-40 pb-20">
      {/* Header section - clean and centered */}
      <div className="max-w-4xl mx-auto mb-24">
        <div className="flex flex-col items-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 text-center">IngsScribblings</h1>
          <p className="text-xl text-gray-600 mb-4 text-center max-w-2xl">
            De persoonlijke schrijfplek van Ingrid
          </p>
          <p className="text-gray-500 italic text-center">
            Ook wel Inge genoemd
          </p>
        </div>

        <div className="flex justify-center mb-20">
          <div className="w-64 h-64 md:w-80 md:h-80 relative group">
            <div className="absolute inset-0 bg-gray-400/80 transform translate-x-2 translate-y-2 
                       group-hover:translate-x-1 group-hover:translate-y-1 
                       transition-transform duration-200"></div>
            <img 
              src="/src/assets/images/person.webp" 
              alt="Profielfoto" 
              className="relative w-full h-full object-cover border-2 border-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Content section - clean and simple */}
      <div className="max-w-3xl mx-auto animate-slideDown">
        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">Over Mij</h2>
          
          <p className="text-gray-600 leading-relaxed mb-16">
            Op deze site staan korte verhalen, columns, 50-woordenverhalen en andere literaire 
            schetsen en schrijfsels. De naam 'Ings' verwijst naar de schrijver, en 'Scribblings' 
            naar het plezier van schrijven zonder vaste kaders.
          </p>
        </article>
        
        {/* Simple divider */}
        <div className="flex items-center my-16">
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        
        {/* Developer section - clean and balanced */}
        <div className="text-center mb-10">
          <h3 className="text-xl font-semibold mb-10 text-gray-700">Developers</h3>
        </div>
        <p className="text-center text-gray-500 italic text-sm mb-10">
          Met veel dank aan deze ontwikkelaars voor het maken van deze site!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <a href="https://www.linkedin.com/in/calvin-heeres/" target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200">
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Calvin Heeres</h3>
            <p className="text-gray-600 text-sm mb-3">Frontend Developer</p>
            <div className="flex justify-center">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
          </a>
          
          <a href="https://www.linkedin.com/in/udayamarsingh/" target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200">
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Udayamar Singh</h3>
            <p className="text-gray-600 text-sm mb-3">Frontend Developer</p>
            <div className="flex justify-center">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
          </a>
          
          <a href="https://www.linkedin.com/in/viniciuseduardosousa/" target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200">
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Vinicius De Sousa</h3>
            <p className="text-gray-600 text-sm mb-3">Backend Developer</p>
            <div className="flex justify-center">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default OverMij; 