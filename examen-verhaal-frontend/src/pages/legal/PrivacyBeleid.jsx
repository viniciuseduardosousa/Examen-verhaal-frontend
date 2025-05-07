import React from 'react';

const PrivacyBeleid = () => {
  return (
    <div className="container min-h-screen mx-auto px-4 py-32 max-w-4xl">
      <h1 className="text-4xl font-bold mb-12">Privacy Beleid</h1>
      
      <div className="prose prose-lg">
        <p className="mb-6">
        Ingscribblings hecht grote waarde aan uw privacy. In dit privacybeleid leggen we uit 
          welke gegevens we verzamelen en hoe we deze gebruiken.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Welke gegevens verzamelen wij?</h2>
        <p className="mb-6">
          We verzamelen alleen de gegevens die nodig zijn voor het functioneren van onze diensten:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Technische gegevens zoals IP-adres en browsergegevens</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Hoe gebruiken wij uw gegevens?</h2>
        <p className="mb-6">
          We gebruiken uw gegevens voor:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Het leveren van onze diensten</li>
          <li className="mb-2">Het verbeteren van onze website</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Uw rechten</h2>
        <p className="mb-6">
          U heeft het recht om:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Uw gegevens in te zien</li>
          <li className="mb-2">Uw gegevens te laten verwijderen</li>
          <li className="mb-2">Uw toestemming in te trekken</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Contact</h2>
        <p className="mb-6">
          Voor vragen over ons privacybeleid kunt u contact met ons opnemen via 
          <a href="mailto:info@Ingscribblings.nl" className="text-[#303655] hover:underline ml-1">
            info@Ingscribblings.nl
          </a>
        </p>

        <p className="text-sm text-[#303655] mt-8">
          Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}
        </p>
      </div>
    </div>
  );
};

export default PrivacyBeleid; 