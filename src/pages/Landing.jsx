import { useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';

const Landing = () => {
  const navigate = useNavigate();

  const carouselImages = [
    {
      url: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'Connect with Alumni',
      description: 'Build meaningful connections with successful alumni from your institution',
    },
    {
      url: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'Discover Opportunities',
      description: 'Find exciting job opportunities posted by alumni and industry leaders',
    },
    {
      url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'Learn from Mentors',
      description: 'Get guidance from experienced mentors in your field of interest',
    },
    {
      url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'Entrepreneurship Support',
      description: 'Connect with entrepreneurs and explore startup opportunities',
    },
  ];

  const features = [
    {
      icon: '🎓',
      title: 'For Students',
      description: 'Browse job opportunities, apply for positions, and connect with mentors to kickstart your career.',
    },
    {
      icon: '🌟',
      title: 'For Alumni',
      description: 'Post job openings, become a mentor, or share your entrepreneurial journey with the community.',
    },
    {
      icon: '💼',
      title: 'Job Portal',
      description: 'Access a comprehensive job portal with opportunities tailored for PCTE students and alumni.',
    },
    {
      icon: '🤝',
      title: 'Mentorship Program',
      description: 'Connect students with experienced alumni mentors for career guidance and professional growth.',
    },
    {
      icon: '🚀',
      title: 'Startup Ecosystem',
      description: 'Discover startups founded by alumni and explore entrepreneurial opportunities.',
    },
    {
      icon: '🔒',
      title: 'Secure Platform',
      description: 'Your data is protected with industry-standard security measures and role-based access control.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">PCTE CampusBridge</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-blue-600">PCTE CampusBridge</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connecting students, alumni, and entrepreneurs in a vibrant community.
              Discover opportunities, find mentors, and grow your career.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/register?role=Student')}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg text-lg font-semibold"
              >
                Join as Student
              </button>
              <button
                onClick={() => navigate('/register?role=Alumni')}
                className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg text-lg font-semibold"
              >
                Join as Alumni
              </button>
              <button
                onClick={() => navigate('/register?role=Admin')}
                className="px-8 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all transform hover:scale-105 shadow-lg text-lg font-semibold"
              >
                Join as Admin
              </button>
            </div>
          </div>

          <div className="mb-16">
            <Carousel images={carouselImages} interval={4000} />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600">
              Everything you need to succeed in your career journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of students and alumni already using PCTE CampusBridge to advance their careers.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-10 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg text-lg font-semibold"
          >
            Create Your Account
          </button>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">PCTE CampusBridge</h3>
          <p className="text-gray-400 mb-8">
            Connecting the PCTE community for a brighter future.
          </p>
          <div className="border-t border-gray-800 pt-8 text-gray-400">
            <p>&copy; 2025 PCTE CampusBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
