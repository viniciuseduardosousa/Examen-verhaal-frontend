import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#DFE9EB] py-16">
      <div className="container mx-auto px-8">
        {/* Main footer content met verticale dividers */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 relative">
          {/* Logo/Brand section */}
          <div className="relative">
            <h3 className="text-xl font-medium mb-4">ReadKeep</h3>
            <p className="text-gray-700">
              Ontdek verhalen die je raken, 
              inspireren en vermaken. Een plek 
              waar woorden tot leven komen.
            </p>
            {/* Verticale divider rechts */}
            <div className="hidden md:block absolute right-[-1rem] top-0 bottom-0 w-[1px] bg-gray-800/20"></div>
          </div>

          {/* Pagina's section */}
          <div className="relative">
            <h3 className="text-xl font-medium mb-4">Pagina's</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
              </li>
              <li>
                <Link to="/verhalen" className="text-gray-700 hover:text-gray-900">Verhalen</Link>
              </li>
              <li>
                <Link to="/over-mij" className="text-gray-700 hover:text-gray-900">Over mij</Link>
              </li>
            </ul>
            {/* Verticale divider rechts */}
            <div className="hidden md:block absolute right-[-1rem] top-0 bottom-0 w-[1px] bg-gray-800/20"></div>
          </div>

          {/* Contact section */}
          <div className="relative">
            <h3 className="text-xl font-medium mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@readkeep.nl" className="text-gray-700 hover:text-gray-900">
                  info@readkeep.nl
                </a>
              </li>
              <li>
                <a href="tel:+31612345678" className="text-gray-700 hover:text-gray-900">
                  +31 6 12345678
                </a>
              </li>
            </ul>
            {/* Verticale divider rechts */}
            <div className="hidden md:block absolute right-[-1rem] top-0 bottom-0 w-[1px] bg-gray-800/20"></div>
          </div>

          {/* Legal section */}
          <div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/cookie-beleid" className="text-gray-600 hover:text-[#303655] transition-colors">
                    Cookie Beleid
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-beleid" className="text-gray-600 hover:text-[#303655] transition-colors">
                    Privacy Beleid
                  </Link>
                </li>
                <li>
                  <Link to="/algemene-voorwaarden" className="text-gray-600 hover:text-[#303655] transition-colors">
                    Algemene Voorwaarden
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Horizontale divider boven copyright */}
        <div className="w-full h-[1px] bg-gray-800/20 mb-8"></div>

        {/* Copyright */}
        <div className="text-center text-gray-700">
          <p>&copy; {currentYear} ReadKeep. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 