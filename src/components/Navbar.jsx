// import { NavLink } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// function Navbar() {
//   const { isAuthenticated, user, logout } = useAuth();
//   console.log(isAuthenticated);

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center py-4">
//           <NavLink to="/" className="text-xl font-bold text-blue-600">
//             PQ-ACE
//           </NavLink>

//           {isAuthenticated ? (
//             <div className="flex items-center space-x-4">
//               <ul className="flex space-x-2">
//                 <li>
//                   <NavLink
//                     to="/dashboard"
//                     className={({ isActive }) =>
//                       `px-4 py-2 rounded-md ${
//                         isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
//                       }`
//                     }
//                   >
//                     Dashboard
//                   </NavLink>
//                 </li>
//                 <li>
//                   <NavLink
//                     to="/past-questions"
//                     className={({ isActive }) =>
//                       `px-4 py-2 rounded-md ${
//                         isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
//                       }`
//                     }
//                   >
//                     Past Questions
//                   </NavLink>
//                 </li>
//               </ul>
//               <button
//                 onClick={logout}
//                 className="px-4 py-2 text-red-600 hover:text-red-800"
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <NavLink
//               to="/"
//               className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//             >
//               Login
//             </NavLink>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

// src/components/Navigation.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await login();
      navigate('/');
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-purple-600">
            PQ-ACE
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md"
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md"
                >
                  Dashboard
                </Link>
                <Link
                  to="/past-questions"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md"
                >
                  Past-Questions
                </Link>
                <div className="flex items-center space-x-2">
                  {user.photoURL && (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span>{user.displayName}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleLogout}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
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
                {/* <Link 
                  to="/login" 
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Login
                </Link> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
