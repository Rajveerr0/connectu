import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Users, ChevronDown, User, LogOut, Settings } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const handleApplyAction = (path) => {
    if (!isAuthenticated) {
      alert('Please login first to access this feature');
      navigate('/login');
      return;
    }
    navigate(path);
  };

  const getUserDashboardPath = () => {
    switch (user?.role) {
      case 'Student':
        return '/student/dashboard';
      case 'Alumni':
        return '/alumni/dashboard';
      case 'Admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
<Link to="/" className="flex items-center space-x-2">
  <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center">
    <Users className="w-5 h-5 text-white" />
  </div>
  <span className="text-xl font-bold text-gray-900">ConnectU</span>
</Link>

        
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Features
            </Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              How It Works
            </Link>
            <Link to="/jobs" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Jobs
            </Link>
            <Link to="/mentorship" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Mentorship
            </Link>
            <Link to="/entrepreneurs" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Entrepreneurs
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  <User size={20} />
                  <span>{user?.name}</span>
                  <ChevronDown size={16} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to={getUserDashboardPath()}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings size={16} />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/features"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/how-it-works"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <button
                onClick={() => {
                  handleApplyAction('/jobs');
                  setIsMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Jobs
              </button>
              <button
                onClick={() => {
                  handleApplyAction('/mentorship');
                  setIsMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Mentorship
              </button>
              <button
                onClick={() => {
                  handleApplyAction('/entrepreneurs');
                  setIsMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Entrepreneurs
              </button>

              {/* Mobile Auth */}
              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <User size={20} />
                      <span className="font-medium">{user?.name}</span>
                    </div>
                    <Link
                      to={getUserDashboardPath()}
                      className="block text-blue-600 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block text-red-600 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="block text-gray-700 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;