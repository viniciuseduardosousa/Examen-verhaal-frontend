import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 pt-32 pb-8 animate-fadeIn">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Privacybeleid</h1>
        
        <div className="prose prose-lg">
          <p className="mb-6">
            Dit privacybeleid beschrijft hoe wij omgaan met uw gegevens op deze website.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Gegevensverzameling</h2>
          <p className="mb-6">
            Deze website is specifiek ontwikkeld voor het lezen van verhalen. Wij verzamelen geen persoonlijke gegevens van bezoekers.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Cookies</h2>
          <p className="mb-6">
            Deze website maakt alleen gebruik van essentiële cookies die nodig zijn voor de werking van de website. Er worden geen tracking cookies gebruikt.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Contact</h2>
          <p className="mb-6">
            Voor vragen over dit privacybeleid kunt u contact opnemen via het contactformulier.
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

export default Privacy; 