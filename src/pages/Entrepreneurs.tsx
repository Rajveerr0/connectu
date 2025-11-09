import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Users, Globe, MapPin, Calendar, ExternalLink, Star, Filter, Building, MessageCircle, Handshake } from 'lucide-react';
import { publicAPI } from '../services/api';
import { useApplication } from '../utils/authHelpers';
import { useAuth } from '../context/AuthContext';

interface Entrepreneur {
  id: number;
  name: string;
  title: string;
  company: string;
  startup_name: string;
  image: string;
  location: string;
  industry: string;
  stage: string;
  funding_stage: string;
  founded: string;
  employees: string;
  funding: string;
  description: string;
  achievements: string[];
  website: string;
  rating: number;
  collaborations: number;
  looking_for: string[];
  logo: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  alumni_id: number;
  users?: {
    name: string;
    email: string;
  };
  has_requested?: boolean;
  collaboration_status?: string;
}

const Entrepreneurs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [collaboratingEntrepreneurId, setCollaboratingEntrepreneurId] = useState<number | null>(null);
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState<Entrepreneur | null>(null);
  const [collaborationData, setCollaborationData] = useState({
    interest_area: '',
    skills: '',
    time_commitment: 'part-time',
    message: '',
    collaboration_type: 'general'
  });

  const { canApply } = useApplication();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchEntrepreneurs();
  }, [searchTerm, industryFilter, stageFilter]);

  const fetchEntrepreneurs = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (industryFilter) params.industry = industryFilter;
      if (stageFilter) params.stage = stageFilter;

      const response = await publicAPI.getEntrepreneurs(params);
      setEntrepreneurs(response.data.entrepreneurs || []);
    } catch (error) {
      console.error('Error fetching entrepreneurs:', error);
      setEntrepreneurs([]);
    } finally {
      setLoading(false);
    }
  };

  // Get filter options from actual data
  const industries = [...new Set(entrepreneurs.flatMap(entrepreneur => 
    entrepreneur.industry ? [entrepreneur.industry] : []
  ))];
  
  const stages = [...new Set(entrepreneurs.flatMap(entrepreneur => 
    (entrepreneur.stage || entrepreneur.funding_stage) ? [entrepreneur.stage || entrepreneur.funding_stage] : []
  ))];

  // Handle collaboration request
  const handleCollaborate = (entrepreneur: Entrepreneur) => {
    if (!canApply('entrepreneur')) return;

    setSelectedEntrepreneur(entrepreneur);
    setShowCollaborationModal(true);
  };

  const handleCollaborationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEntrepreneur) return;

    try {
      setCollaboratingEntrepreneurId(selectedEntrepreneur.id);
      
      const collaborationRequest = {
        entrepreneur_id: selectedEntrepreneur.id,
        collaborator_id: user.id,
        interest_area: collaborationData.interest_area,
        skills: collaborationData.skills,
        time_commitment: collaborationData.time_commitment,
        message: collaborationData.message,
        collaboration_type: collaborationData.collaboration_type,
        status: 'pending'
      };

      const response = await publicAPI.requestCollaboration(collaborationRequest);
      
      if (response.data.success) {
        alert('Collaboration request sent successfully! The entrepreneur will review your request.');
        
        // Update entrepreneur to show collaboration status
        setEntrepreneurs(entrepreneurs.map(entrepreneur => 
          entrepreneur.id === selectedEntrepreneur.id 
            ? { ...entrepreneur, has_requested: true, collaboration_status: 'pending' }
            : entrepreneur
        ));
        
        setShowCollaborationModal(false);
        setSelectedEntrepreneur(null);
        setCollaborationData({
          interest_area: '',
          skills: '',
          time_commitment: 'part-time',
          message: '',
          collaboration_type: 'general'
        });
      } else {
        alert('Failed to send collaboration request. Please try again.');
      }
    } catch (error) {
      console.error('Error sending collaboration request:', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Failed to send collaboration request. Please try again.');
      }
    } finally {
      setCollaboratingEntrepreneurId(null);
    }
  };

  // Handle send message
  const handleSendMessage = (entrepreneur: Entrepreneur) => {
    if (!canApply('entrepreneur')) return;

    // Redirect to messaging system or open chat
    alert(`Messaging feature for ${entrepreneur.name || entrepreneur.users?.name} will be implemented soon!`);
  };

  const getCollaborationButtonText = (entrepreneur: Entrepreneur) => {
    if (entrepreneur.has_requested) {
      return `Requested - ${entrepreneur.collaboration_status || 'Pending'}`;
    }
    if (collaboratingEntrepreneurId === entrepreneur.id) {
      return 'Sending...';
    }
    return 'Collaborate Now';
  };

  const getCollaborationButtonStyle = (entrepreneur: Entrepreneur) => {
    if (entrepreneur.has_requested) {
      return 'bg-gray-400 text-white cursor-not-allowed';
    }
    if (collaboratingEntrepreneurId === entrepreneur.id) {
      return 'bg-blue-400 cursor-not-allowed';
    }
    return 'bg-blue-600 text-white hover:bg-blue-700';
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Entrepreneur Collaboration</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with innovative startups and entrepreneurs. Discover collaboration opportunities, join exciting ventures, or find your next career opportunity.
          </p>
          {isAuthenticated && (
            <p className="text-sm text-green-600 mt-2">
              Welcome, {user?.name}! You can send collaboration requests directly.
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
                placeholder="Search entrepreneurs, startups, or industries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Filter Toggle for Mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filters - Collapsible on mobile */}
          <div className={`mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Stages</option>
              {stages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
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
            { number: `${entrepreneurs.length}+`, label: 'Verified Startups' },
            { number: '$10M+', label: 'Total Funding' },
            { number: '500+', label: 'Jobs Created' },
            { number: '85%', label: 'Success Rate' },
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
            {loading ? 'Loading...' : `Showing ${entrepreneurs.length} entrepreneurs`}
          </p>
          {isAuthenticated && (
            <button 
              onClick={() => window.location.href = user?.role === 'Alumni' ? '/alumni/dashboard' : '/student/dashboard'}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View My Requests →
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : entrepreneurs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Verified Entrepreneurs Yet</h3>
              <p className="text-gray-600 mb-4">
                There are currently no approved entrepreneurs in the system. Check back later or contact admin.
              </p>
              {!isAuthenticated && (
                <p className="text-sm text-gray-600">
                  <button 
                    onClick={() => window.location.href = '/register'}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Create an account
                  </button>{' '}
                  to be notified when new entrepreneurs join.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {entrepreneurs.map((entrepreneur, index) => (
              <motion.div
                key={entrepreneur.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all p-8"
              >
                {/* Collaboration Status Banner */}
                {entrepreneur.has_requested && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center text-yellow-800">
                      <Handshake className="w-5 h-5 mr-2" />
                      Your collaboration request is <span className="font-semibold ml-1">{entrepreneur.collaboration_status || 'pending'}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left Section - Profile */}
                  <div className="lg:w-1/3">
                    <div className="flex items-center space-x-4 mb-4">
                      <img 
                        src={entrepreneur.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(entrepreneur.name || entrepreneur.users?.name || 'Entrepreneur')}&background=random&size=150`}
                        alt={entrepreneur.name || entrepreneur.users?.name}
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(entrepreneur.name || entrepreneur.users?.name || 'Entrepreneur')}&background=random&size=150`;
                        }}
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{entrepreneur.name || entrepreneur.users?.name}</h3>
                        <p className="text-blue-600 font-semibold">{entrepreneur.title || 'Founder'}</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span className="text-sm font-semibold">{entrepreneur.rating || 4.5}</span>
                          <span className="text-sm text-gray-600 ml-2">({entrepreneur.collaborations || 0} collaborations)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {entrepreneur.location || 'Remote'}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Founded in {entrepreneur.founded || '2023'}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {entrepreneur.employees || '5-10'} employees
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        {entrepreneur.funding || 'Pre-seed'} raised
                      </div>
                    </div>
                  </div>

                  {/* Center Section - Company Info */}
                  <div className="lg:w-1/2">
                    <div className="flex items-center mb-4">
                      <img 
                        src={entrepreneur.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(entrepreneur.company || entrepreneur.startup_name || 'Startup')}&background=random&size=100`}
                        alt={entrepreneur.company || entrepreneur.startup_name}
                        className="w-12 h-12 rounded-lg object-cover mr-3"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(entrepreneur.company || entrepreneur.startup_name || 'Startup')}&background=random&size=100`;
                        }}
                      />
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{entrepreneur.company || entrepreneur.startup_name}</h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            (entrepreneur.stage === 'Pre-Seed' || entrepreneur.funding_stage === 'Pre-Seed') ? 'bg-yellow-100 text-yellow-800' :
                            (entrepreneur.stage === 'Seed' || entrepreneur.funding_stage === 'Seed') ? 'bg-green-100 text-green-800' :
                            (entrepreneur.stage === 'Series A' || entrepreneur.funding_stage === 'Series A') ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {entrepreneur.stage || entrepreneur.funding_stage || 'Early Stage'}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            {entrepreneur.industry || 'Technology'}
                          </span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {entrepreneur.description || `${entrepreneur.company || entrepreneur.startup_name} is an innovative startup looking to make an impact in the ${entrepreneur.industry || 'technology'} industry.`}
                    </p>

                    {entrepreneur.achievements && entrepreneur.achievements.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-900 mb-2">Key Achievements:</h5>
                        <div className="space-y-1">
                          {entrepreneur.achievements.map((achievement, achIndex) => (
                            <div key={achIndex} className="flex items-center text-sm text-gray-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                              {achievement}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {entrepreneur.looking_for && entrepreneur.looking_for.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-900 mb-2">Currently Looking For:</h5>
                        <div className="flex flex-wrap gap-2">
                          {entrepreneur.looking_for.map((item, itemIndex) => (
                            <span
                              key={itemIndex}
                              className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Actions */}
                  <div className="lg:w-1/4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <button 
                        onClick={() => handleCollaborate(entrepreneur)}
                        disabled={entrepreneur.has_requested || collaboratingEntrepreneurId === entrepreneur.id}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${getCollaborationButtonStyle(entrepreneur)}`}
                      >
                        {getCollaborationButtonText(entrepreneur)}
                      </button>
                      <button 
                        onClick={() => handleSendMessage(entrepreneur)}
                        className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 mr-2 inline" />
                        Send Message
                      </button>
                      {entrepreneur.website && (
                        <a
                          href={entrepreneur.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Visit Website
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      )}
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h6 className="font-semibold text-gray-900 text-sm mb-2">Quick Stats</h6>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Stage:</span>
                          <span className="font-medium">{entrepreneur.stage || entrepreneur.funding_stage || 'Early Stage'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Funding:</span>
                          <span className="font-medium">{entrepreneur.funding || 'Pre-seed'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Team Size:</span>
                          <span className="font-medium">{entrepreneur.employees || '5-10'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Collaboration Modal */}
        {showCollaborationModal && selectedEntrepreneur && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Request Collaboration
              </h3>
              <p className="text-gray-600 mb-6">
                with <span className="font-semibold">{selectedEntrepreneur.name || selectedEntrepreneur.users?.name}</span> from <span className="font-semibold">{selectedEntrepreneur.company || selectedEntrepreneur.startup_name}</span>
              </p>

              <form onSubmit={handleCollaborationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collaboration Type
                  </label>
                  <select
                    required
                    value={collaborationData.collaboration_type}
                    onChange={(e) => setCollaborationData({...collaborationData, collaboration_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General Collaboration</option>
                    <option value="internship">Internship Opportunity</option>
                    <option value="project">Project Collaboration</option>
                    <option value="partnership">Partnership</option>
                    <option value="investment">Investment Inquiry</option>
                    <option value="mentorship">Mentorship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area of Interest
                  </label>
                  <input
                    type="text"
                    required
                    value={collaborationData.interest_area}
                    onChange={(e) => setCollaborationData({...collaborationData, interest_area: e.target.value})}
                    placeholder="What area are you interested in collaborating on?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Skills/Expertise
                  </label>
                  <input
                    type="text"
                    required
                    value={collaborationData.skills}
                    onChange={(e) => setCollaborationData({...collaborationData, skills: e.target.value})}
                    placeholder="What skills can you bring to this collaboration?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Commitment
                  </label>
                  <select
                    value={collaborationData.time_commitment}
                    onChange={(e) => setCollaborationData({...collaborationData, time_commitment: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="part-time">Part-time</option>
                    <option value="full-time">Full-time</option>
                    <option value="flexible">Flexible</option>
                    <option value="project-basis">Project Basis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    required
                    value={collaborationData.message}
                    onChange={(e) => setCollaborationData({...collaborationData, message: e.target.value})}
                    placeholder="Tell them why you're interested in collaborating and what you hope to achieve..."
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCollaborationModal(false);
                      setSelectedEntrepreneur(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={collaboratingEntrepreneurId === selectedEntrepreneur.id}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {collaboratingEntrepreneurId === selectedEntrepreneur.id ? 'Sending...' : 'Send Request'}
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

export default Entrepreneurs;