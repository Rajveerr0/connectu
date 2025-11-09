import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Briefcase, MessageCircle, TrendingUp, ArrowRight, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  const [user, setUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'Connect with Alumni Network',
      subtitle: 'Build meaningful professional relationships'
    },
    {
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'Discover Career Opportunities',
      subtitle: 'Access exclusive jobs and internships'
    },
    {
      image: 'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'Get Expert Mentorship',
      subtitle: 'Learn from industry professionals'
    },
    {
      image: 'https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'Collaborate with Entrepreneurs',
      subtitle: 'Join innovative startup ventures'
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const stats = [
    { number: '1,000+', label: 'Alumni Connected' },
    { number: '50+', label: 'Job Placements' },
    { number: '500+', label: 'Active Students' },
    { number: '20+', label: 'Startup Partners' },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer at Google',
      content: 'This platform helped me to connect with the right mentors and land my dream job.',
      image: 'https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Rahul Gupta',
      role: 'Startup Founder',
      content: 'The entrepreneur network here is incredible. Found my co-founder through this platform.',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Sylvester Lee',
      role: 'Marketing Manager',
      content: 'The mentorship program guided me through career transitions seamlessly.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150&h=150&fit=crop&crop=face'
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative text-white min-h-screen flex items-center overflow-hidden">
        {/* Carousel Background */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-sky-700/80"></div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center px-4">
            {/* Dynamic slide content */}
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-sky-300 mb-2">
                {heroSlides[currentSlide].title}
              </h2>
              <p className="text-sm sm:text-lg text-gray-200">
                {heroSlides[currentSlide].subtitle}
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Your Career, <span className="text-sky-300">Our Network</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto"
            >
              Connect with verified alumni, discover career opportunities, and build meaningful relationships that transform your professional journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-12 sm:mb-16 px-4"
            >
              <Link
                to="/Register"
                className="bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Join Now
              </Link>
              <Link
                to="/features"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all transform hover:scale-105"
              >
                Learn More
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-300 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base text-gray-300">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Why Choose ConnectU?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Connect, learn, and grow with our comprehensive career networking platform
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-12 h-12" />,
                title: 'Verified Network',
                description: 'Connect with authenticated alumni and current students from your institution',
                color: 'text-blue-600 bg-blue-100',
              },
              {
                icon: <Briefcase className="w-12 h-12" />,
                title: 'Career Opportunities',
                description: 'Access exclusive job postings and internship opportunities from our network',
                color: 'text-green-600 bg-green-100',
              },
              {
                icon: <MessageCircle className="w-12 h-12" />,
                title: 'Mentorship Program',
                description: 'Get guidance from experienced professionals in your field of interest',
                color: 'text-purple-600 bg-purple-100',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 ${feature.color} rounded-lg flex items-center justify-center mb-4 sm:mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Success Stories
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600"
            >
              Hear from our community members who found success through ConnectU
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 p-6 sm:p-8 rounded-xl"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-3 sm:mr-4"
                  />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Home;