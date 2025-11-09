import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users, TrendingUp, CheckCircle } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <UserPlus className="w-12 h-12" />,
      title: 'Register',
      description: 'Create your profile with academic and professional details. Verify your email and institution to join our trusted community.',
      details: [
        'Fill out your profile with education details',
        'Verify your institutional email',
        'Upload a professional photo',
        'Set your career preferences'
      ],
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Connect',
      description: 'Discover and connect with alumni, mentors, and peers in your field. Build meaningful professional relationships.',
      details: [
        'Browse verified alumni profiles',
        'Send connection requests',
        'Join industry-specific groups',
        'Participate in networking events'
      ],
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: 'Grow',
      description: 'Access opportunities, get mentorship, and accelerate your career growth through our comprehensive platform.',
      details: [
        'Apply for job opportunities',
        'Get mentorship from experts',
        'Receive career guidance',
        'Track your progress'
      ],
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const benefits = [
    'Access to exclusive job postings',
    'Direct mentorship from industry experts',
    'Networking with verified professionals',
    'Career development resources',
    'Referral opportunities',
    'Skills development programs'
  ];

  return (
    <div className="py-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-sky-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            How <span className="text-blue-600">ConnectU</span> Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Simple steps to transform your career journey. From registration to career growth, we've made it easy to connect and succeed.
          </motion.p>
        </div>
      </section>

      {/* Steps Timeline */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full bg-gray-200"></div>
            
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative flex items-center mb-16 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Step Content */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                    <div className={`w-16 h-16 ${step.color} rounded-xl flex items-center justify-center mb-6`}>
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Step {index + 1}: {step.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                
                {/* Step number for mobile */}
                <div className="md:hidden w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              What You'll Get
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Join thousands who have already transformed their careers through our platform
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center p-4 bg-white rounded-lg shadow-sm"
              >
                <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Success By The Numbers
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '92%', label: 'Job Placement Rate' },
              { number: '500+', label: 'Partner Companies' },
              { number: '10,000+', label: 'Alumni Network' },
              { number: '4.8/5', label: 'User Satisfaction' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-sky-50"
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default HowItWorks;