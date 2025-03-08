import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // 👈 Import useNavigate for redirection

  const handleLogout = async () => {
    await logout(); // Perform logout
    navigate('/home'); // Redirect to home after logout
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Blog App
            </Link>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/" className="px-4 py-2 text-blue-600 hover:text-blue-800">
                  Home
                </Link>
                <Link to="/login" className="px-4 py-2 text-blue-600 hover:text-blue-800">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
