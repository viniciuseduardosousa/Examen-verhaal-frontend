import React from 'react';

const AlgemeneVoorwaarden = () => {
  return (
    <div className="container min-h-screen mx-auto px-4 py-32 max-w-4xl">
      <h1 className="text-4xl font-bold mb-12">Algemene Voorwaarden</h1>
      
      <div className="prose prose-lg">
        <p className="mb-6">
          Door gebruik te maken van ReadKeep gaat u akkoord met deze algemene voorwaarden. 
          Lees deze voorwaarden zorgvuldig door voordat u onze diensten gebruikt.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definities</h2>
        <p className="mb-6">
          In deze voorwaarden wordt verstaan onder:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">"Platform": de website en diensten van ReadKeep</li>
          <li className="mb-2">"Gebruiker": iedereen die gebruik maakt van het Platform</li>
          <li className="mb-2">"Inhoud": alle teksten, afbeeldingen en andere materialen op het Platform</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">2. Gebruik van het Platform</h2>
        <p className="mb-6">
          Door gebruik te maken van het Platform gaat u akkoord met:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Het respecteren van intellectuele eigendomsrechten</li>
          <li className="mb-2">Het niet plaatsen van onwettige of aanstootgevende inhoud</li>
          <li className="mb-2">Het niet verstoren van de werking van het Platform</li>
          <li className="mb-2">Het niet delen van valse of misleidende informatie</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">3. Intellectueel Eigendom</h2>
        <p className="mb-6">
          Alle inhoud op het Platform is intellectueel eigendom van ReadKeep of haar 
          licentiegevers. Gebruikers mogen deze inhoud niet kopiëren, distribueren of 
          op andere wijze gebruiken zonder voorafgaande schriftelijke toestemming.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">4. Aansprakelijkheid</h2>
        <p className="mb-6">
          ReadKeep is niet aansprakelijk voor:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Directe of indirecte schade door gebruik van het Platform</li>
          <li className="mb-2">Fouten of onjuistheden in de inhoud</li>
          <li className="mb-2">Onderbrekingen of storingen van het Platform</li>
          <li className="mb-2">Schade veroorzaakt door derden</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">5. Wijzigingen</h2>
        <p className="mb-6">
          ReadKeep behoudt zich het recht voor om deze voorwaarden op elk moment te wijzigen. 
          Wijzigingen worden van kracht zodra ze op het Platform worden gepubliceerd.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">6. Contact</h2>
        <p className="mb-6">
          Voor vragen over deze voorwaarden kunt u contact met ons opnemen via 
          <a href="mailto:info@readkeep.nl" className="text-[#303655] hover:underline ml-1">
            info@readkeep.nl
          </a>
        </p>

        <p className="text-sm text-[#303655] mt-8">
          Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}
        </p>
      </div>
    </div>
  );
};

export default AlgemeneVoorwaarden; 