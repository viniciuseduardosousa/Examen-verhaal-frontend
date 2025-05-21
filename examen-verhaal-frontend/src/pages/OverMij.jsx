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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Calvin</h3>
            <p className="text-gray-600 text-sm">Mediacollege Amsterdam</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Uday</h3>
            <p className="text-gray-600 text-sm">Mediacollege Amsterdam</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Vinicius</h3>
            <p className="text-gray-600 text-sm">Mediacollege Amsterdam</p>
          </div>
        </div>
        
        <p className="text-center text-gray-500 italic text-sm mb-10">
          Met veel dank aan deze ontwikkelaars voor het maken van deze site!
        </p>
      </div>
    </div>
  );
};

export default OverMij; 