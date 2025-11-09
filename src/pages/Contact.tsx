import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      reset();
      console.log('Contact form data:', data);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Us',
      details: 'support@ConnectU.com',
      description: 'Send us an email anytime!',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Call Us',
      details: '+91 98765 43210',
      description: 'Mon-Fri from 9am to 6pm',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Visit Us',
      details: 'PCTE Campus, baddowaL, Punjab',
      description: 'Come say hello at our campus!',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Working Hours',
      details: 'Monday - Friday: 9AM - 6PM',
      description: 'Saturday: 10AM - 4PM',
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  const faqData = [
    {
      question: 'How do I create an account on ConnectU?',
      answer: 'Simply click on the "Join Now" button on our homepage and fill out the registration form with your details. You\'ll need to verify your email to complete the process.'
    },
    {
      question: 'Is ConnectU free to use?',
      answer: 'Yes, ConnectU is completely free for students and alumni. We believe in making career opportunities accessible to everyone in our community.'
    },
    {
      question: 'How do I connect with mentors?',
      answer: 'Browse our Mentorship Hub, find mentors that align with your career interests, and send them a mentorship request. Most mentors respond within 48 hours.'
    },
    {
      question: 'Can I post job opportunities?',
      answer: 'Yes, verified alumni and authorized companies can post job opportunities. Contact us at support@ConnectU.com to get verification for job posting privileges.'
    },
    {
      question: 'How do I report inappropriate content?',
      answer: 'Use the report button on any content or message that violates our community guidelines. Our moderation team reviews all reports within 24 hours.'
    }
  ];

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">
            Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className={`w-12 h-12 ${info.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                {info.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
              <p className="text-gray-800 font-medium mb-1">{info.details}</p>
              <p className="text-sm text-gray-600">{info.description}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

            {submitStatus === 'success' && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Thank you! Your message has been sent successfully. We'll get back to you soon.</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>Something went wrong. Please try again later.</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  {...register('subject', { required: 'Please select a subject' })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.subject ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  {...register('message', { 
                    required: 'Message is required',
                    minLength: { value: 10, message: 'Message must be at least 10 characters' }
                  })}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none ${
                    errors.message ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Tell us how we can help you..."
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </div>
                )}
              </button>
            </form>
          </motion.div>

          {/* FAQ and Map */}
          <div className="space-y-8">
            {/* Campus Location Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Location</h3>
                <div className="h-64 bg-gradient-to-br from-blue-100 to-sky-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-700 font-medium">PCTE Campus</p>
                    <p className="text-gray-600 text-sm">baddowaL, Punjab, India</p>
                    <p className="text-blue-600 text-sm mt-2 cursor-pointer hover:underline">
                      View on Google Maps
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqData.slice(0, 3).map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
                <div className="pt-4">
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View all FAQs →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Additional FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 bg-white rounded-2xl shadow-sm p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">More Questions?</h2>
            <p className="text-gray-600">
              Check out our comprehensive FAQ section or reach out to us directly
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqData.slice(3).map((faq, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">{faq.question}</h4>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;