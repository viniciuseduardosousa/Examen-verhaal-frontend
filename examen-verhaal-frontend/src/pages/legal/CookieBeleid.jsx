import React from 'react';

const CookieBeleid = () => {
  return (
    <div className="container min-h-screen mx-auto px-4 py-32 max-w-4xl">
      <h1 className="text-4xl font-bold mb-12">Cookie Beleid</h1>
      
      <div className="prose prose-lg">
        <p className="mb-6">
        Ingscribblings gebruikt cookies om uw ervaring op onze website te verbeteren. 
          Door op "Accepteren" te klikken gaat u akkoord met het gebruik van alle cookies.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Wat zijn cookies?</h2>
        <p className="mb-6">
          Cookies zijn kleine tekstbestanden die op uw computer of mobiele apparaat worden opgeslagen 
          wanneer u onze website bezoekt. Ze helpen ons om uw voorkeuren te onthouden en de website 
          te verbeteren.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Welke cookies gebruiken wij?</h2>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <strong>Essentiële cookies:</strong> Deze zijn noodzakelijk voor het functioneren van de website.
          </li>
          <li className="mb-2">
            <strong>Analytische cookies:</strong> Deze helpen ons te begrijpen hoe bezoekers onze website gebruiken.
          </li>
          <li className="mb-2">
            <strong>Functionele cookies:</strong> Deze onthouden uw voorkeuren en instellingen.
          </li>
          <li className="mb-2">
            <strong>Marketing cookies:</strong> Deze worden gebruikt om relevante advertenties te tonen.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Hoe kunt u cookies beheren?</h2>
        <p className="mb-6">
          U kunt uw browserinstellingen aanpassen om cookies te verwijderen of te blokkeren. 
          Houd er wel rekening mee dat sommige functionaliteiten van onze website mogelijk niet 
          meer werken als u cookies uitschakelt.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Contact</h2>
        <p className="mb-6">
          Heeft u vragen over ons cookiebeleid? Neem dan contact met ons op via 
          <a href="mailto:info@Ingscribblings.nl" className="text-[#303655] hover:underline ml-1">
            info@Ingscribblings.nl
          </a>
        </p>

        <p className="text-sm text-gray-500 mt-8">
          Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}
        </p>
      </div>
    </div>
  );
};

export default CookieBeleid; 