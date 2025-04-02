const OverMij = () => {
  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      <div className="flex flex-col md:flex-row items-center gap-12 mb-16 animate-fadeIn">
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

        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Over Mij</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Welkom op mijn verhalenplatform! Als verhalenverteller en schrijver deel ik graag 
            mijn passie voor woorden en verhalen met jullie.
          </p>
        </div>
      </div>

      {/* Content sectie met animaties */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Linker kolom */}
        <div className="space-y-8 animate-slideDown">
          <div className="prose prose-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Mijn Reis</h2>
            <p className="text-gray-600">
              Mijn liefde voor verhalen begon al op jonge leeftijd. Met een boek in mijn handen 
              en mijn hoofd in de wolken, ontdekte ik de magie van woorden en hun vermogen om 
              nieuwe werelden te creëren.
            </p>
            <p className="text-gray-600">
              Door de jaren heen heb ik mijn passie voor schrijven ontwikkeld en verfijnd. 
              Elk verhaal is een nieuwe uitdaging, een kans om emoties te delen en lezers te 
              raken.
            </p>
          </div>
        </div>

        {/* Rechter kolom */}
        <div className="space-y-8 animate-slideDown" style={{ animationDelay: '0.2s' }}>
          <div className="prose prose-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Mijn Visie</h2>
            <p className="text-gray-600">
              Ik geloof in de kracht van verhalen om mensen te verbinden en nieuwe perspectieven 
              te openen. Elk verhaal, of het nu fictie is of gebaseerd op waargebeurde feiten, 
              heeft het vermogen om ons te raken en te inspireren.
            </p>
            <p className="text-gray-600">
              Met ReadKeep wil ik een platform bieden waar verhalen tot leven komen en lezers 
              kunnen verdwalen in woorden. Een plek waar creativiteit en verbeeldingskracht 
              centraal staan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverMij; 