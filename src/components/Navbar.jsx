import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const Navigation = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      await login();
      navigate('/');
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Toggle the menu visibility
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-purple-600">
            PQ-ACE
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md"
            >
              Home
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                {/* User Icon */}
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={toggleMenu}
                >
                  {user.photoURL && (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                </div>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/past-questions"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      View Questions
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Login Button
              <div className="flex space-x-3">
                <button
                  onClick={handleGoogleSignIn}
                  className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <img 
                    src="https://www.google.com/favicon.ico" 
                    alt="Google" 
                    className="w-4 h-4 mr-2"
                  />
                  Sign in with Google
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
