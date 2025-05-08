import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#DFE9EB] py-16 min-h-[400px]">
      <div className="container mx-auto px-8">
        {/* Main footer content met verticale dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 relative">
          {/* Logo/Brand section */}
          <div className="relative min-h-[120px] flex flex-col">
            <h3 className="text-2xl font-medium mb-6 h-[32px]">Ingscribblings</h3>
            <p className="text-gray-700 flex-grow text-lg leading-relaxed">
              Ontdek verhalen die je raken, 
              inspireren en vermaken. Een plek 
              waar woorden tot leven komen.
            </p>
            {/* Verticale divider rechts */}
            <div className="hidden md:block absolute right-[-2rem] top-0 bottom-0 w-[1px] bg-gray-800/20"></div>
          </div>

          {/* Pagina's section */}
          <div className="relative min-h-[120px] flex flex-col">
            <h3 className="text-2xl font-medium mb-6 h-[32px]">Pagina's</h3>
            <ul className="space-y-4 flex-grow">
              <li>
                <Link to="/" className="text-gray-700 hover:text-gray-900 text-lg transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link to="/verhalen" className="text-gray-700 hover:text-gray-900 text-lg transition-colors duration-200">Verhalen</Link>
              </li>
              <li>
                <Link to="/over-mij" className="text-gray-700 hover:text-gray-900 text-lg transition-colors duration-200">Over mij</Link>
              </li>
            </ul>
            {/* Verticale divider rechts */}
            <div className="hidden md:block absolute right-[-2rem] top-0 bottom-0 w-[1px] bg-gray-800/20"></div>
          </div>

          {/* Contact section */}
          <div className="min-h-[120px] flex flex-col">
            <h3 className="text-2xl font-medium mb-6 h-[32px]">Contact</h3>
            <ul className="space-y-4 flex-grow">
              <li>
                <a 
                  href="mailto:info@Ingscribblings.nl" 
                  className="text-gray-700 hover:text-gray-900 text-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  info@Ingscribblings.nl
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Horizontale divider boven copyright */}
        <div className="w-full h-[1px] bg-gray-800/20 mb-8"></div>

        {/* Copyright */}
        <div className="text-center text-gray-700 h-[24px]">
          <p>&copy; {currentYear} Ingscribblings. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 