import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { FiMessageSquare, FiHome, FiBook, FiLogOut, FiSun, FiMoon } from "react-icons/fi";

const Navigation = ({ darkMode, setDarkMode }) => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      await login();
      navigate("/");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Toggle the menu visibility
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg rounded-lg transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-md"
          >
            PQ-ACE
          </Link>

          {/* Navigation and Dark Mode Toggle */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-white hover:text-black px-3 py-2 rounded-md transition-colors bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-600 hover:to-purple-800"
            >
              Home
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-md focus:outline-none transition-colors bg-gray-200 dark:bg-gray-700"
            >
              {darkMode ? <FiSun className="w-5 h-5 text-yellow-500" /> : <FiMoon className="w-5 h-5 text-gray-800" />}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Icon */}
                <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleMenu}>
                  {user.photoURL && (
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                  )}
                </div>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-purple-300 focus:outline-none transform transition-all ease-out duration-200">
                    <div className="py-1" role="none">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-purple-50 transition duration-200"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-0"
                      >
                        <FiHome className="w-4 h-4 mr-2 text-purple-500" />
                        Dashboard
                      </Link>
                      <Link
                        to="/past-questions"
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-purple-50 transition duration-200"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-1"
                      >
                        <FiBook className="w-4 h-4 mr-2 text-purple-500" />
                        View Questions
                      </Link>
                      <Link
                        to="/gemini-chat"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-800 hover:bg-purple-50 transition duration-200"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-2"
                      >
                        <FiMessageSquare className="w-4 h-4 text-purple-500" />
                        <span>Chat with AI</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-purple-50 transition duration-200"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-3"
                      >
                        <FiLogOut className="w-4 h-4 mr-2 text-red-600" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Login Button
              <div className="flex space-x-3">
                <button
                  onClick={handleGoogleSignIn}
                  className="flex items-center text-white px-4 py-2 rounded-md transition-colors bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-700 hover:to-purple-900"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />
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
