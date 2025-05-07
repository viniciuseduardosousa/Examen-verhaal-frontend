import { Link } from 'react-router-dom';

const AlgemeneVoorwaarden = () => {
  return (
    <div className="container mx-auto px-4 pt-32 pb-8 animate-fadeIn">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Algemene Voorwaarden</h1>
        
        <div className="prose prose-lg">
          <p className="mb-6">
            Welkom op onze website. Deze algemene voorwaarden zijn van toepassing op het gebruik van deze website.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Gebruik van de Website</h2>
          <p className="mb-6">
            Deze website is specifiek ontwikkeld voor het lezen van verhalen. Het is niet toegestaan om de inhoud van deze website te kopiëren, te verspreiden of op een andere manier te gebruiken zonder toestemming.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Intellectueel Eigendom</h2>
          <p className="mb-6">
            Alle rechten met betrekking tot de verhalen en andere inhoud op deze website zijn voorbehouden. De verhalen mogen alleen voor persoonlijk gebruik worden gelezen.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Contact</h2>
          <p className="mb-6">
            Voor vragen over deze voorwaarden kunt u contact opnemen via het contactformulier.
          </p>
        </div>

        <div className="mt-12">
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            ← Terug naar home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AlgemeneVoorwaarden; 