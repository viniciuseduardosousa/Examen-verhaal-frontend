import { Link } from 'react-router-dom';
import { useState } from 'react';
import CategoryDropdown from './navigation/CategoryDropdown';
import MobileMenu from './navigation/MobileMenu';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Zoeken naar:', searchQuery);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-[#FFFFF5] shadow-sm">
      <nav className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Left side: Logo + Navigation */}
          <div className="flex items-center gap-12">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-gray-800">
              ReadKeep
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-12">
              <Link 
                to="/verhalen" 
                className="text-xl text-gray-800 relative group"
              >
                <span>Verhalen</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/over-mij" 
                className="text-xl text-gray-800 relative group"
              >
                <span>Over mij</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <CategoryDropdown />
            </div>
          </div>
          
          {/* Right side: Search + Mobile Menu */}
          <div className="flex items-center gap-6">
            {/* Desktop Search */}
            <div className="hidden md:block relative">
              <input
                type="text"
                placeholder="Zoeken..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 bg-white border-2 border-gray-800 rounded-full pr-10 focus:outline-none"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg
                className="w-8 h-8 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Header; 