import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Briefcase, Building, Filter, Heart, ExternalLink } from 'lucide-react';
import { publicAPI, studentsAPI } from '../services/api';
import { useApplication } from '../utils/authHelpers';
import { useAuth } from '../context/AuthContext';

const AlertBar: React.FC<{ type: 'success' | 'error'; message: string; onClose: () => void }> = ({ type, message, onClose }) => {
  if (!message) return null;
  
  const base = 'fixed bottom-6 right-6 z-[9999] shadow-lg rounded-lg border px-5 py-3 flex items-center space-x-3 transition-all transform animate-toast-slide';
  const classes =
    type === 'success'
      ? `${base} bg-green-100 border-green-300 text-green-800`
      : `${base} bg-red-100 border-red-300 text-red-800`;

  return (
    <div className={classes}>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-3 text-sm hover:opacity-70">✕</button>
    </div>
  );
};


const JobListings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);
const [expandedIds, setExpandedIds] = useState<{ [key: number]: boolean }>({});
const toggleExpand = (id: number) => {
  setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
};

  const { canApply } = useApplication();
  const { user, isAuthenticated } = useAuth();

  // Alert state + timeout ref to clear previous timers
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const alertTimerRef = useRef<number | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    // clear existing timer
    if (alertTimerRef.current) {
      window.clearTimeout(alertTimerRef.current);
      alertTimerRef.current = null;
    }

    setAlert({ type, message });

    // auto-hide after 3s
    alertTimerRef.current = window.setTimeout(() => {
      setAlert({ type: '', message: '' });
      alertTimerRef.current = null;
    }, 3000);
  };

useEffect(() => {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes toast-slide {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-toast-slide {
      animation: toast-slide 0.4s ease-out forwards;
    }
  `;
  document.head.appendChild(style);
  return () => {
    if (style.parentNode) style.parentNode.removeChild(style);
    if (alertTimerRef.current) {
      window.clearTimeout(alertTimerRef.current);
      alertTimerRef.current = null;
    }
  };
}, []);


  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, locationFilter, typeFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (locationFilter) params.location = locationFilter;
      if (typeFilter) params.type = typeFilter;

      const response = await publicAPI.getJobs(params);
      const list = response.data?.jobs || [];
      setJobs(list);

      // Extract unique locations and types for filters
      const uniqueLocations = [...new Set(list.map((job: any) => job.location))];
      const uniqueTypes = [...new Set(list.map((job: any) => job.job_type))];
      setLocations(uniqueLocations);
      setTypes(uniqueTypes);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      showAlert('error', 'Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs; // Already filtered by API

  const handleApply = async (jobId: number, jobTitle: string) => {
    if (!canApply('job')) return;

    try {
      setApplyingJobId(jobId);

      // CORRECT data structure for your backend
      const applicationData = {
        jobId: jobId, // This matches what backend expects
        cover_letter: `I am interested in applying for the ${jobTitle} position.`
        // Add resumeUrl if needed
      };

      console.log('Applying to job:', applicationData);

      // CORRECT API call - single parameter
      const response = await studentsAPI.applyToJob(applicationData);

      if (response.data) {
        // replaced native alert with stylish alert
        showAlert('success', 'Application submitted successfully!');

        // Update UI
        setJobs(jobs.map(job =>
          job.id === jobId
            ? { ...job, has_applied: true, application_status: 'Pending' }
            : job
        ));
      }
    } catch (error: any) {
      console.error('Error applying for job:', error);
      showAlert('error', error?.response?.data?.error || 'Failed to apply for job');
    } finally {
      setApplyingJobId(null);
    }
  };

  const checkIfApplied = async (jobId: number) => {
    try {
      // This would be an API call to check if user has already applied
      // For now, we'll check locally
      const job = jobs.find(j => j.id === jobId);
      return job?.has_applied || false;
    } catch (error) {
      console.error('Error checking application status:', error);
      return false;
    }
  };

  const handleSaveJob = async (jobId: number) => {
    if (!isAuthenticated) {
      showAlert('error', 'Please login to save jobs');
      return;
    }

    try {
      // API call to save job for later
      await publicAPI.saveJob(jobId);
      showAlert('success', 'Job saved successfully!');

      // Update job to show saved status
      setJobs(jobs.map(job =>
        job.id === jobId
          ? { ...job, is_saved: true }
          : job
      ));
    } catch (error) {
      console.error('Error saving job:', error);
      showAlert('error', 'Failed to save job. Please try again.');
    }
  };

  const getApplicationButtonText = (job: any) => {
    if (job.has_applied) {
      return `Applied - ${job.application_status || 'Pending'}`;
    }
    if (applyingJobId === job.id) {
      return 'Applying...';
    }
    return 'Apply Now';
  };

  const getApplicationButtonStyle = (job: any) => {
    if (job.has_applied) {
      return 'bg-gray-400 cursor-not-allowed';
    }
    if (applyingJobId === job.id) {
      return 'bg-blue-400 cursor-not-allowed';
    }
    return 'bg-blue-600 hover:bg-blue-700';
  };

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      {/* AlertBar */}
      {alert.message && (
        <div className="animate-fade-in">
          <AlertBar type={alert.type as 'success' | 'error'} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Opportunities</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your next career opportunity from our curated list of jobs and internships
          </p>
          {isAuthenticated && (
            <p className="text-sm text-green-600 mt-2">
              Welcome, {user?.name}! You can apply for jobs directly.
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
                placeholder="Search jobs, companies, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-3">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `Showing ${filteredJobs.length} jobs`}
          </p>
        </div>

        {/* Job Cards */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building className="w-8 h-8 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <div className="flex items-center text-gray-600 text-sm space-x-4">
                            <span className="flex items-center">
                              <Building className="w-4 h-4 mr-1" />
                              {job.company}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(job.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Save Job Button */}
                        {isAuthenticated && (
                          <button
                            onClick={() => handleSaveJob(job.id)}
                            className={`p-2 rounded-lg transition-colors ${job.is_saved ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                            title={job.is_saved ? 'Remove from saved' : 'Save job'}
                          >
                            <Heart className="w-5 h-5" fill={job.is_saved ? 'currentColor' : 'none'} />
                          </button>
                        )}
                      </div>

                      <div className="text-gray-700 mb-4">
  {expandedIds[job.id] ? (
    <>
      {job.description}
      <button
        onClick={() => toggleExpand(job.id)}
        className="text-blue-600 hover:text-blue-800 font-medium ml-2 focus:outline-none"
      >
        Show less
      </button>
    </>
  ) : (
    <>
      {job.description && job.description.length > 150
        ? `${job.description.slice(0, 150)}...`
        : job.description}
      {job.description && job.description.length > 150 && (
        <button
          onClick={() => toggleExpand(job.id)}
          className="text-blue-600 hover:text-blue-800 font-medium ml-2 focus:outline-none"
        >
          Read more
        </button>
      )}
    </>
  )}
</div>


                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 text-xs rounded-full ${job.job_type === 'Internship' ? 'bg-orange-100 text-orange-800' : job.job_type === 'Full-time' ? 'bg-green-100 text-green-800' : job.job_type === 'Part-time' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                            {job.job_type}
                          </span>
                          {job.salary_range && (
                            <span className="text-sm font-semibold text-green-600">{job.salary_range}</span>
                          )}
                          {job.has_applied && (
                            <span className={`px-2 py-1 text-xs rounded-full ${job.application_status === 'approved' ? 'bg-green-100 text-green-800' : job.application_status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {job.application_status || 'Pending'}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleApply(job.id, job.title)}
                            disabled={job.has_applied || applyingJobId === job.id}
                            className={`text-white px-6 py-2 rounded-lg font-medium transition-colors ${getApplicationButtonStyle(job)}`}
                          >
                            {getApplicationButtonText(job)}
                          </button>

                          {isAuthenticated && (
                            <button
                              onClick={() => window.location.href = `/jobs/${job.id}`}
                              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                              title="View Job Details"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No jobs found matching your criteria</p>
            {!isAuthenticated && (
              <p className="text-sm text-gray-600">
                <button
                  onClick={() => window.location.href = '/register'}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Create an account
                </button>{' '}
                to get notified when new jobs are posted.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;
