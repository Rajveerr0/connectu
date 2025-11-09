import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, MessageCircle, TrendingUp, Shield, Bell, Award, Network } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Verified Alumni & Students',
      description: 'Connect with authenticated alumni and current students from PCTE and partner institutions. Our verification system ensures genuine connections.',
      color: 'text-blue-600 bg-blue-100',
      benefits: ['Email verification', 'Institution confirmation', 'Profile authentication', 'Trusted network']
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: 'Job & Internship Alerts',
      description: 'Get personalized notifications for job openings, internships, and career opportunities that match your profile and preferences.',
      color: 'text-green-600 bg-green-100',
      benefits: ['Personalized matching', 'Real-time alerts', 'Custom filters', 'Application tracking']
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Mentorship & Referrals',
      description: 'Access one-on-one mentorship from industry experts and get referrals for your dream companies through our extensive network.',
      color: 'text-purple-600 bg-purple-100',
      benefits: ['Expert mentors', 'Career guidance', 'Referral network', 'Skill development']
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Career Growth Tracking',
      description: 'Monitor your career progress, set goals, and get insights on how to advance in your chosen field with data-driven recommendations.',
      color: 'text-orange-600 bg-orange-100',
      benefits: ['Progress analytics', 'Goal setting', 'Skill gaps analysis', 'Growth recommendations']
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: 'Smart Networking',
      description: 'AI-powered recommendations help you connect with the right people based on your career interests, location, and professional goals.',
      color: 'text-indigo-600 bg-indigo-100',
      benefits: ['AI matching', 'Interest-based connections', 'Location filters', 'Professional compatibility']
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Recognition & Achievements',
      description: 'Showcase your accomplishments, certifications, and projects. Get recognized by peers and potential employers in your field.',
      color: 'text-red-600 bg-red-100',
      benefits: ['Portfolio showcase', 'Skill endorsements', 'Achievement badges', 'Peer recognition']
    }
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
            Powerful Features for <span className="text-blue-600">Career Success</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Discover all the tools and features designed to accelerate your career growth and help you build meaningful professional connections.
          </motion.p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Built with Security & Trust
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Your privacy and security are our top priorities. We use industry-standard encryption and verification processes.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Data Protection',
                description: 'End-to-end encryption and secure data storage with regular security audits.'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Identity Verification',
                description: 'Multi-step verification process ensures authentic connections and reduces spam.'
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Quality Assurance',
                description: 'Moderated content and community guidelines maintain professional standards.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl text-center"
              >
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Features;