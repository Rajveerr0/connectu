import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative isolate z-[999] -mt-px overflow-hidden bg-blue-900 text-white before:absolute before:inset-x-0 before:-top-px before:h-px before:bg-blue-900">



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">ConnectU</span>
            </Link>
            <p className="text-gray-300 text-sm">
              Connecting students, alumni, and entrepreneurs to build successful careers together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-gray-300 hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/jobs" className="text-gray-300 hover:text-white transition-colors">Jobs</Link></li>
              <li><Link to="/mentorship" className="text-gray-300 hover:text-white transition-colors">Mentorship</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/entrepreneurs" className="text-gray-300 hover:text-white transition-colors">Entrepreneurs</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/signup" className="text-gray-300 hover:text-white transition-colors">Join Now</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>support@ConnectU.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>PCTE Campus, Punjab</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 PCTE ConnectU. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;