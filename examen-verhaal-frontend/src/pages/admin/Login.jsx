import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simuleer een API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock credentials check
      if (formData.email === 'admin@readkeep.nl' && formData.password === 'admin123') {
        // In een echte app zou je hier een JWT token opslaan
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Ongeldige inloggegevens');
      }
    } catch (err) {
      setError('Er is iets misgegaan. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFFF5] px-4">
      <div className="max-w-md w-full">
        <div className="relative p-8 rounded-lg">
          <div className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-gray-800 rounded-lg -z-10"></div>

          {/* Logo */}
          <div className="text-center mb-8">
            <a href="/" className="inline-block">
              <h1 className="text-3xl font-bold text-[#000000]">ReadKeep</h1>
            </a>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-3 border-2 border-gray-800 rounded-lg focus:outline-none
                         focus:ring-2 focus:ring-gray-500 transition-all text-lg"
                placeholder="E-mail"
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-6 py-3 border-2 border-gray-800 rounded-lg focus:outline-none
                         focus:ring-2 focus:ring-gray-500 transition-all text-lg"
                placeholder="wachtwoord"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Wachtwoord vergeten link */}
            <div className="text-center">
              <a 
                href="/admin/forgot-password" 
                className="text-[#bdc6c7] hover:underline text-sm"
              >
                Wachtwoord vergeten?
              </a>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-48 bg-[#DFE9EB] text-black py-3 px-6 rounded-lg
                         hover:bg-[#a7aeaf] focus:outline-none focus:ring-2 focus:ring-gray-500
                         transition-all disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center text-lg font-medium"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Inloggen...
                  </>
                ) : (
                  'Inloggen'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 