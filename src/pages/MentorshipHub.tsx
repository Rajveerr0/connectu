import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, MapPin, Briefcase, MessageCircle, Calendar, Filter, Award, Clock, UserCheck } from 'lucide-react';
import { publicAPI } from '../services/api';
import { useApplication } from '../utils/authHelpers';
import { useAuth } from '../context/AuthContext';

const MentorshipHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingMentorId, setBookingMentorId] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: '30',
    topic: '',
    notes: ''
  });

  const { canApply } = useApplication();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchMentors();
  }, [searchTerm, expertiseFilter, locationFilter]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (expertiseFilter) params.expertise = expertiseFilter;
      if (locationFilter) params.location = locationFilter;

      const response = await publicAPI.getMentors(params);
      setMentors(response.data.mentors || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  // Get filter options from actual data
  const expertiseOptions = [...new Set(mentors.flatMap(mentor => 
    mentor.expertise ? [mentor.expertise] : []
  ))];
  
  const locationOptions = [...new Set(mentors.map(mentor => mentor.location).filter(Boolean))];

  // Fallback image URL
  const getFallbackImage = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`;
  };

  const handleMessageMentor = (mentor) => {
    if (!canApply('mentorship')) return;

    // Redirect to messaging system or open chat
    alert(`Messaging feature for ${mentor.name} will be implemented soon!`);
  };

  const handleRequestMentorship = (mentor) => {
    if (!canApply('mentorship')) return;

    setSelectedMentor(mentor);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setBookingMentorId(selectedMentor.id);
      
      const bookingRequest = {
        mentor_id: selectedMentor.id,
        mentee_id: user.id,
        session_date: bookingData.date,
        session_time: bookingData.time,
        duration: parseInt(bookingData.duration),
        topic: bookingData.topic,
        notes: bookingData.notes,
        status: 'pending'
      };

      const response = await publicAPI.bookMentorshipSession(bookingRequest);
      
      if (response.data.success) {
        alert('Mentorship session requested successfully! The mentor will review your request.');
        
        // Update mentor to show booking status
        setMentors(mentors.map(mentor => 
          mentor.id === selectedMentor.id 
            ? { ...mentor, has_requested: true, booking_status: 'pending' }
            : mentor
        ));
        
        setShowBookingModal(false);
        setSelectedMentor(null);
        setBookingData({
          date: '',
          time: '',
          duration: '30',
          topic: '',
          notes: ''
        });
      } else {
        alert('Failed to request mentorship session. Please try again.');
      }
    } catch (error) {
      console.error('Error booking mentorship session:', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Failed to request mentorship session. Please try again.');
      }
    } finally {
      setBookingMentorId(null);
    }
  };

  const getBookingButtonText = (mentor) => {
    if (mentor.has_requested) {
      return `Requested - ${mentor.booking_status || 'Pending'}`;
    }
    if (bookingMentorId === mentor.id) {
      return 'Requesting...';
    }
    return 'Request Mentorship';
  };

  const getBookingButtonStyle = (mentor) => {
    if (mentor.has_requested || mentor.available === false) {
      return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    }
    if (bookingMentorId === mentor.id) {
      return 'bg-blue-400 cursor-not-allowed';
    }
    return 'bg-blue-600 text-white hover:bg-blue-700';
  };

  const isMentorAvailable = (mentor) => {
    return mentor.available !== false && !mentor.has_requested;
  };

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mentorship Hub</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with industry experts and experienced professionals who can guide your career journey
          </p>
          {isAuthenticated && (
            <p className="text-sm text-green-600 mt-2">
              Welcome, {user?.name}! You can book mentorship sessions directly.
            </p>
          )}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search mentors by name, role, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={expertiseFilter}
                onChange={(e) => setExpertiseFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Expertise</option>
                {expertiseOptions.map(expertise => (
                  <option key={expertise} value={expertise}>{expertise}</option>
                ))}
              </select>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Locations</option>
                {locationOptions.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { number: `${mentors.length}+`, label: 'Expert Mentors' },
            { number: '100+', label: 'Sessions Completed' },
            { number: '4.8/5', label: 'Average Rating' },
            { number: '95%', label: 'Success Rate' },
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl text-center shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `Showing ${mentors.length} mentors`}
          </p>
          {isAuthenticated && (
            <button 
              onClick={() => window.location.href = user?.role === 'Alumni' ? '/alumni/dashboard' : '/student/dashboard'}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View My Sessions →
            </button>
          )}
        </div>

        {/* Mentor Cards */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : mentors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No mentors found matching your criteria</p>
            {!isAuthenticated && (
              <p className="text-sm text-gray-600">
                <button 
                  onClick={() => window.location.href = '/register'}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Create an account
                </button>{' '}
                to book mentorship sessions.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mentors.map((mentor, index) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all p-8"
              >
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img 
                      src={mentor.image || getFallbackImage(mentor.name)}
                      alt={mentor.name}
                      className="w-20 h-20 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = getFallbackImage(mentor.name);
                      }}
                    />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                      isMentorAvailable(mentor) ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{mentor.name}</h3>
                        <p className="text-blue-600 font-semibold">{mentor.expertise || 'Industry Expert'}</p>
                        <p className="text-gray-600">{mentor.company || 'Various Companies'}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center mb-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="ml-1 font-semibold">4.8</span>
                        </div>
                        <p className="text-sm text-gray-600">10+ sessions</p>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 space-x-4 mb-3">
                      {mentor.location && (
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {mentor.location}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {mentor.years_of_experience ? `${mentor.years_of_experience}+ years` : 'Experienced'}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {mentor.bio || `${mentor.name} is an experienced professional ready to guide you in your career journey.`}
                    </p>

                    {mentor.expertise && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {mentor.expertise}
                        </span>
                      </div>
                    )}

                    {/* Booking Status */}
                    {mentor.has_requested && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center text-yellow-800 text-sm">
                          <Clock className="w-4 h-4 mr-2" />
                          Your request is <span className="font-semibold ml-1">{mentor.booking_status || 'pending'}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        {isMentorAvailable(mentor) ? (
                          <span className="flex items-center text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Available for mentorship
                          </span>
                        ) : (
                          <span className="flex items-center text-gray-500">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                            {mentor.has_requested ? 'Request pending' : 'Currently unavailable'}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleMessageMentor(mentor)}
                          disabled={!isMentorAvailable(mentor)}
                          className={`flex items-center px-3 py-2 border rounded-lg transition-colors ${
                            isMentorAvailable(mentor)
                              ? 'text-blue-600 border-blue-600 hover:bg-blue-50'
                              : 'text-gray-400 border-gray-300 cursor-not-allowed'
                          }`}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Message
                        </button>
                        <button 
                          onClick={() => handleRequestMentorship(mentor)}
                          disabled={!isMentorAvailable(mentor) || bookingMentorId === mentor.id}
                          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${getBookingButtonStyle(mentor)}`}
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          {getBookingButtonText(mentor)}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedMentor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Request Mentorship Session
              </h3>
              <p className="text-gray-600 mb-6">
                with <span className="font-semibold">{selectedMentor.name}</span>
              </p>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    required
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={bookingData.duration}
                    onChange={(e) => setBookingData({...bookingData, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discussion Topic
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingData.topic}
                    onChange={(e) => setBookingData({...bookingData, topic: e.target.value})}
                    placeholder="What would you like to discuss?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                    placeholder="Any specific questions or areas you'd like to focus on?"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingModal(false);
                      setSelectedMentor(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingMentorId === selectedMentor.id}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {bookingMentorId === selectedMentor.id ? 'Requesting...' : 'Send Request'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipHub;