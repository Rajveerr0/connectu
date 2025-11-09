import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { alumniAPI } from '../../services/api';
import {
  Briefcase,
  UserCheck,
  Rocket,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  BarChart3,
  Settings,
  Mail,
  Calendar,
  MapPin,
  DollarSign,
  Clock
} from 'lucide-react';

const AlumniDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [showEntrepreneurModal, setShowEntrepreneurModal] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    job_type: 'Full-time',
    salary_range: '',
    experience_level: 'Entry',
    application_deadline: '',
    contact_email: ''
  });
  const [mentorFormData, setMentorFormData] = useState({
    expertise: '',
    years_of_experience: '',
    bio: '',
    availability: 'Available',
    linkedin_profile: ''
  });
  const [entrepreneurFormData, setEntrepreneurFormData] = useState({
    startup_name: '',
    industry: '',
    description: '',
    website: '',
    funding_stage: 'Pre-seed',
    location: '',
    team_size: ''
  });
  const [formError, setFormError] = useState('');
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    mentorshipRequests: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    fetchMyJobs();
    fetchStats();
  }, [navigate]);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const response = await alumniAPI.getMyJobs();
      setMyJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

const fetchStats = async () => {
  try {
    // Get real data from API instead of mock data
    const applicationsResponse = await alumniAPI.getApplications();
    const jobsResponse = await alumniAPI.getMyJobs();
    
    const applicationsData = applicationsResponse.data?.jobs || [];
    const myJobs = jobsResponse.data || [];

    // Calculate real stats
    let totalApplications = 0;
    let pendingApplications = 0;

    // Count applications across all jobs
    applicationsData.forEach(job => {
      totalApplications += job.total_applications;
      
      // Count pending applications
      job.applications.forEach(app => {
        if (app.status === 'Pending') {
          pendingApplications++;
        }
      });
    });

    const activeJobs = myJobs.filter(job => job.is_active !== false).length;

    setStats({
      totalJobs: myJobs.length,
      activeJobs: activeJobs,
      totalApplications: totalApplications,
      pendingApplications: pendingApplications,
      // You can add mentorship requests when you have the API
      mentorshipRequests: 0 // Placeholder for now
    });

    console.log('Real stats calculated:', {
      totalJobs: myJobs.length,
      activeJobs: activeJobs,
      totalApplications: totalApplications,
      pendingApplications: pendingApplications
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    // Fallback to mock data if API fails
    setStats({
      totalJobs: myJobs.length,
      activeJobs: myJobs.filter(job => job.status === 'active').length,
      totalApplications: 0,
      pendingApplications: 0,
      mentorshipRequests: 0
    });
  }
};
useEffect(() => {
  const userData = localStorage.getItem('user');
  if (!userData) {
    navigate('/login');
    return;
  }
  setUser(JSON.parse(userData));
  fetchMyJobs();
}, [navigate]);

// Add this useEffect to fetch stats when myJobs changes
useEffect(() => {
  if (myJobs.length > 0) {
    fetchStats();
  }
}, [myJobs]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!jobFormData.title || !jobFormData.company || !jobFormData.description) {
      setFormError('Please fill in all required fields');
      return;
    }

    try {
      await alumniAPI.postJob(jobFormData);
      setShowJobModal(false);
      setJobFormData({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: '',
        job_type: 'Full-time',
        salary_range: '',
        experience_level: 'Entry',
        application_deadline: '',
        contact_email: ''
      });
      fetchMyJobs();
      alert('Job posted successfully!');
    } catch (error) {
      setFormError(error.response?.data?.error || 'Failed to post job');
    }
  };

  const handleMentorSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!mentorFormData.expertise || !mentorFormData.bio) {
      setFormError('Please fill in all required fields');
      return;
    }

    try {
      const response = await alumniAPI.registerAsMentor(mentorFormData);
      setShowMentorModal(false);
      setMentorFormData({
        expertise: '',
        years_of_experience: '',
        bio: '',
        availability: 'Available',
        linkedin_profile: ''
      });
      alert(response.data?.message || 'Successfully registered as a mentor!');
    } catch (error) {
      console.error('Mentor registration error:', error);
      setFormError(error.response?.data?.error || 'Failed to register as mentor');
    }
  };

  const handleEntrepreneurSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!entrepreneurFormData.startup_name || !entrepreneurFormData.description) {
      setFormError('Please fill in all required fields');
      return;
    }

    try {
      const response = await alumniAPI.registerAsEntrepreneur(entrepreneurFormData);
      setShowEntrepreneurModal(false);
      setEntrepreneurFormData({
        startup_name: '',
        industry: '',
        description: '',
        website: '',
        funding_stage: 'Pre-seed',
        location: '',
        team_size: ''
      });
      alert(response.data?.message || 'Successfully registered as an entrepreneur!');
    } catch (error) {
      console.error('Entrepreneur registration error:', error);
      setFormError(error.response?.data?.error || 'Failed to register as entrepreneur');
    }
  };

  const handleEditJob = (job) => {
    // Implement edit functionality
    console.log('Edit job:', job);
    alert('Edit functionality to be implemented');
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await alumniAPI.deleteJob(jobId);
        setMyJobs(myJobs.filter(job => job.id !== jobId));
        alert('Job deleted successfully!');
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job');
      }
    }
  };

  const handleViewJob = (job) => {
    // Navigate to job details page
    navigate(`/jobs/${job.id}`);
  };

  if (!user) {
    return null;
  }

// Add this to your navigation items in AlumniDashboard.jsx
const navigationItems = [
  { id: 'overview', name: 'Overview', icon: BarChart3 },
  { id: 'jobs', name: 'My Jobs', icon: Briefcase },
  { id: 'applications', name: 'Applications', icon: Users },
  { id: 'mentorship', name: 'Mentorship', icon: UserCheck },
  { id: 'startups', name: 'My Startup', icon: Rocket },
  { id: 'settings', name: 'Settings', icon: Settings },
];
const renderTabContent = () => {
  switch (activeTab) {
    case 'overview':
      return <OverviewTab stats={stats} myJobs={myJobs} />;
    case 'jobs':
      return <JobsTab 
        jobs={myJobs} 
        loading={loading}
        onEditJob={handleEditJob}
        onDeleteJob={handleDeleteJob}
        onViewJob={handleViewJob}
      />;
    case 'applications': // ADD THIS CASE
      return <ApplicationsTab />;
    case 'mentorship':
      return <MentorshipTab />;
    case 'startups':
      return <StartupsTab />;
    case 'settings':
      return <SettingsTab user={user} />;
    default:
      return <OverviewTab stats={stats} myJobs={myJobs} />;
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">Alumni</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {navigationItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
              </h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowJobModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>Post Job</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {renderTabContent()}
        </main>
      </div>

      {/* Quick Action Cards */}
      <div className="fixed bottom-8 right-8 flex flex-col space-y-4">
        <button
          onClick={() => setShowMentorModal(true)}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all transform hover:scale-110"
          title="Become a Mentor"
        >
          <UserCheck size={24} />
        </button>
        <button
          onClick={() => setShowEntrepreneurModal(true)}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all transform hover:scale-110"
          title="Register Startup"
        >
          <Rocket size={24} />
        </button>
      </div>

      {/* Modals */}
      <JobModal 
        show={showJobModal}
        onClose={() => setShowJobModal(false)}
        onSubmit={handleJobSubmit}
        formData={jobFormData}
        setFormData={setJobFormData}
        error={formError}
      />

      <MentorModal 
        show={showMentorModal}
        onClose={() => setShowMentorModal(false)}
        onSubmit={handleMentorSubmit}
        formData={mentorFormData}
        setFormData={setMentorFormData}
        error={formError}
      />

      <EntrepreneurModal 
        show={showEntrepreneurModal}
        onClose={() => setShowEntrepreneurModal(false)}
        onSubmit={handleEntrepreneurSubmit}
        formData={entrepreneurFormData}
        setFormData={setEntrepreneurFormData}
        error={formError}
      />
    </div>
  );
};

// Overview Tab Component
// Overview Tab Component - UPDATED with real data
const OverviewTab = ({ stats, myJobs }) => {
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    fetchRecentApplications();
  }, []);

  const fetchRecentApplications = async () => {
    try {
      const response = await alumniAPI.getApplications();
      const applicationsData = response.data?.jobs || [];
      
      // Flatten all applications and sort by date
      const allApplications = applicationsData.flatMap(job => 
        job.applications.map(app => ({
          ...app,
          job_title: job.job_title,
          company: job.company
        }))
      ).sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at))
      .slice(0, 5); // Get 5 most recent

      setRecentApplications(allApplications);
    } catch (error) {
      console.error('Error fetching recent applications:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid - Now using real data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Jobs Posted"
          value={stats.totalJobs}
          icon={Briefcase}
          color="blue"
          change=""
        />
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={Eye}
          color="green"
          change=""
        />
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={Users}
          color="purple"
          change=""
        />
        <StatCard
          title="Pending Reviews"
          value={stats.pendingApplications}
          icon={UserCheck}
          color="orange"
          change=""
        />
      </div>

      {/* Recent Applications - UPDATED with real data */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
          <button 
            onClick={() => window.location.hash = 'applications'}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentApplications.map((application) => (
            <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{application.job_title}</h3>
                <p className="text-gray-600 text-sm">{application.company}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Users size={14} className="mr-1" />
                    {application.student?.name || 'Unknown Student'}
                  </span>
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {new Date(application.applied_at).toLocaleDateString()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    application.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {application.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => window.location.hash = 'applications'}
                  className="text-blue-600 hover:text-blue-800 p-2"
                  title="View Details"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))}
          {recentApplications.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No applications yet</p>
              <p className="text-sm text-gray-400 mt-1">Applications will appear here when students apply to your jobs</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Jobs - UPDATED with application counts */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Job Postings</h2>
          <button 
            onClick={() => window.location.hash = 'jobs'}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-4">
          {myJobs.slice(0, 5).map((job) => (
            <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                <p className="text-gray-600 text-sm">{job.company} • {job.location}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    job.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.is_active !== false ? 'Active' : 'Inactive'}
                  </span>
                  {job.application_count > 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {job.application_count} application{job.application_count !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => window.location.hash = 'jobs'}
                  className="text-blue-600 hover:text-blue-800 p-2"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))}
          {myJobs.length === 0 && (
            <div className="text-center py-8">
              <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No jobs posted yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Jobs Tab Component
const JobsTab = ({ jobs, loading, onEditJob, onDeleteJob, onViewJob }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">My Job Postings</h2>
        <p className="text-gray-600 mt-2">Manage and track your job postings</p>
      </div>

      <div className="p-6">
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-500 mb-6">Start by posting your first job opportunity</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard 
                key={job.id}
                job={job}
                onEdit={onEditJob}
                onDelete={onDeleteJob}
                onView={onViewJob}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
// Applications Tab Component - ADD THIS
// Applications Tab Component - UPDATED
const ApplicationsTab = () => {
  const [applicationsData, setApplicationsData] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationsData();
  }, []);

  const fetchApplicationsData = async () => {
    try {
      setLoading(true);
      const response = await alumniAPI.getApplications();
      console.log('Applications data:', response.data);
      setApplicationsData(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      alert('Failed to load applications data');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobApplications = async (jobId) => {
    try {
      const response = await alumniAPI.getJobApplications(jobId);
      console.log('Job applications:', response.data);
      setJobApplications(response.data.applications || []);
      setSelectedJob(response.data.job);
    } catch (error) {
      console.error('Error fetching job applications:', error);
      alert('Failed to fetch applications for this job');
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    if (!selectedJob) return;
    
    try {
      await alumniAPI.updateApplicationStatus(selectedJob.id, applicationId, { status: newStatus });
      alert('Application status updated successfully!');
      
      // Refresh the data
      fetchJobApplications(selectedJob.id);
      fetchApplicationsData(); // Refresh the counts
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Job Applications Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Applications</h2>
        
        {applicationsData.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-500">Applications will appear here when students apply to your jobs</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Jobs List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applicationsData.map((job) => (
                <div 
                  key={job.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedJob?.id === job.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => fetchJobApplications(job.id)}
                >
                  <h3 className="font-bold text-gray-900">{job.job_title}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-2xl font-bold text-blue-600">{job.total_applications}</span>
                    <span className="text-sm text-gray-500">Applications</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Applications for Selected Job */}
            {selectedJob && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Applications for: {selectedJob.title}
                  </h3>
                  <button 
                    onClick={() => {
                      setSelectedJob(null);
                      setJobApplications([]);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </button>
                </div>

                {jobApplications.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No applications for this job yet</p>
                ) : (
                  <div className="space-y-4">
                    {jobApplications.map((application) => (
                      <div key={application.id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{application.student?.name || 'Unknown Student'}</h4>
                            <p className="text-sm text-gray-600">{application.student?.email || 'No email'}</p>
                          </div>
                          <select
                            value={application.status || 'Pending'}
                            onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          <p><strong>Applied:</strong> {new Date(application.applied_at).toLocaleDateString()}</p>
                          {application.cover_letter && (
                            <p className="mt-2"><strong>Cover Letter:</strong> {application.cover_letter}</p>
                          )}
                          {application.resume_url && (
                            <p className="mt-1">
                              <a href={application.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                View Resume
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
// Job Card Component
const JobCard = ({ job, onEdit, onDelete, onView }) => (
  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">

<div className="flex justify-between items-start mb-4">
  <div>
    <h3 className="font-bold text-gray-900 text-lg mb-1">{job.title}</h3>
    <p className="text-blue-600 font-semibold">{job.company}</p>
  </div>
  <div className="flex flex-col items-end space-y-1">
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
      job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
    }`}>
      {job.status}
    </span>
    
    {job.application_count > 0 && (
      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
        {job.application_count} application{job.application_count !== 1 ? 's' : ''}
      </span>
    )}
  </div>
</div>
    

    <div className="space-y-3 mb-4">
      <div className="flex items-center text-sm text-gray-600">
        <MapPin size={16} className="mr-2" />
        {job.location}
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <Briefcase size={16} className="mr-2" />
        {job.job_type}
      </div>
      {job.salary_range && (
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign size={16} className="mr-2" />
          {job.salary_range}
        </div>
      )}
      <div className="flex items-center text-sm text-gray-600">
        <Calendar size={16} className="mr-2" />
        Posted {new Date(job.created_at).toLocaleDateString()}
      </div>
    </div>

    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{job.description}</p>

    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
      <div className="flex space-x-2">
        <button
          onClick={() => onView(job)}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <Eye size={14} />
          <span>View</span>
        </button>
        <button
          onClick={() => onEdit(job)}
          className="flex items-center space-x-1 text-green-600 hover:text-green-800 text-sm font-medium"
        >
          <Edit size={14} />
          <span>Edit</span>
        </button>
      </div>
      <button
        onClick={() => onDelete(job.id)}
        className="text-red-600 hover:text-red-800 p-1"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, change }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'} mt-1`}>
            {change} from last month
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

// Modal Components
const JobModal = ({ show, onClose, onSubmit, formData, setFormData, error }) => {
  if (!show) return null;

  return (
    <Modal onClose={onClose} title="Post a New Job">
      {error && <ErrorAlert message={error} />}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Job Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Software Engineer"
          />
          <FormInput
            label="Company *"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g., Tech Corp"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., New York, NY"
          />
          <FormSelect
            label="Job Type"
            value={formData.job_type}
            onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
            options={[
              { value: 'Full-time', label: 'Full-time' },
              { value: 'Part-time', label: 'Part-time' },
              { value: 'Contract', label: 'Contract' },
              { value: 'Internship', label: 'Internship' },
              { value: 'Remote', label: 'Remote' }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Salary Range"
            value={formData.salary_range}
            onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
            placeholder="e.g., $80k - $120k"
          />
          <FormSelect
            label="Experience Level"
            value={formData.experience_level}
            onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
            options={[
              { value: 'Entry', label: 'Entry Level' },
              { value: 'Mid', label: 'Mid Level' },
              { value: 'Senior', label: 'Senior Level' },
              { value: 'Executive', label: 'Executive' }
            ]}
          />
        </div>

        <FormTextArea
          label="Job Description *"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the job role and responsibilities..."
          rows={4}
        />

        <FormTextArea
          label="Requirements"
          value={formData.requirements}
          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          placeholder="List the required skills and qualifications..."
          rows={3}
        />

        <ModalActions onCancel={onClose} submitText="Post Job" />
      </form>
    </Modal>
  );
};

const MentorModal = ({ show, onClose, onSubmit, formData, setFormData, error }) => {
  if (!show) return null;

  return (
    <Modal onClose={onClose} title="Register as Mentor">
      {error && <ErrorAlert message={error} />}
      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          label="Expertise Areas *"
          value={formData.expertise}
          onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
          placeholder="e.g., Software Development, Career Counseling, Product Management"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Years of Experience"
            type="number"
            value={formData.years_of_experience}
            onChange={(e) => setFormData({ ...formData, years_of_experience: e.target.value })}
            placeholder="e.g., 10"
          />
          <FormSelect
            label="Availability"
            value={formData.availability}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            options={[
              { value: 'Available', label: 'Available' },
              { value: 'Limited', label: 'Limited Availability' },
              { value: 'Unavailable', label: 'Currently Unavailable' }
            ]}
          />
        </div>

        <FormTextArea
          label="Bio *"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell students about your background and what you can help with..."
          rows={4}
        />

        <FormInput
          label="LinkedIn Profile"
          value={formData.linkedin_profile}
          onChange={(e) => setFormData({ ...formData, linkedin_profile: e.target.value })}
          placeholder="https://linkedin.com/in/yourprofile"
        />

        <ModalActions onCancel={onClose} submitText="Register as Mentor" />
      </form>
    </Modal>
  );
};

const EntrepreneurModal = ({ show, onClose, onSubmit, formData, setFormData, error }) => {
  if (!show) return null;

  return (
    <Modal onClose={onClose} title="Register Your Startup">
      {error && <ErrorAlert message={error} />}
      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          label="Startup Name *"
          value={formData.startup_name}
          onChange={(e) => setFormData({ ...formData, startup_name: e.target.value })}
          placeholder="e.g., InnovateTech"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Industry"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            placeholder="e.g., FinTech, EdTech, HealthTech"
          />
          <FormSelect
            label="Funding Stage"
            value={formData.funding_stage}
            onChange={(e) => setFormData({ ...formData, funding_stage: e.target.value })}
            options={[
              { value: 'Pre-seed', label: 'Pre-seed' },
              { value: 'Seed', label: 'Seed' },
              { value: 'Series A', label: 'Series A' },
              { value: 'Series B', label: 'Series B' },
              { value: 'Series C+', label: 'Series C+' }
            ]}
          />
        </div>

        <FormTextArea
          label="Description *"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your startup and what problem it solves..."
          rows={4}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://yourstartup.com"
          />
          <FormInput
            label="Team Size"
            value={formData.team_size}
            onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
            placeholder="e.g., 10-50 employees"
          />
        </div>

        <ModalActions onCancel={onClose} submitText="Register Startup" />
      </form>
    </Modal>
  );
};

// Reusable Components
const Modal = ({ onClose, title, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const ErrorAlert = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
    {message}
  </div>
);

const FormInput = ({ label, type = 'text', ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      {...props}
    />
  </div>
);

const FormSelect = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <select
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

const FormTextArea = ({ label, rows = 3, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <textarea
      rows={rows}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      {...props}
    />
  </div>
);

const ModalActions = ({ onCancel, submitText }) => (
  <div className="flex justify-end space-x-3 pt-4">
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
    >
      {submitText}
    </button>
  </div>
);

// Placeholder Components for other tabs
// Enhanced Mentorship Tab Component
const MentorshipTab = () => {
  const [mentorProfile, setMentorProfile] = useState(null);
  const [mentorshipSessions, setMentorshipSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMentorSection, setActiveMentorSection] = useState('profile');

  useEffect(() => {
    fetchMentorData();
  }, []);

  const fetchMentorData = async () => {
    try {
      setLoading(true);
      const [profileResponse, sessionsResponse] = await Promise.all([
        alumniAPI.getMentorProfile(),
        // You'll need to add this API endpoint: alumniAPI.getMentorshipSessions()
        Promise.resolve({ data: [] }) // Placeholder for now
      ]);

      setMentorProfile(profileResponse.data);
      setMentorshipSessions(sessionsResponse.data || []);
    } catch (error) {
      console.error('Error fetching mentor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAvailability = async (newAvailability) => {
    try {
      // You'll need to add this API endpoint
      // await alumniAPI.updateMentorProfile({ availability: newAvailability });
      setMentorProfile(prev => ({ ...prev, availability: newAvailability }));
      alert('Availability updated successfully!');
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Failed to update availability');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mentor Profile Header */}
      {mentorProfile ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mentor Profile</h2>
              <p className="text-gray-600">Manage your mentorship activities and availability</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                mentorProfile.is_verified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {mentorProfile.is_verified ? 'Verified' : 'Pending Verification'}
              </span>
              <select
                value={mentorProfile.availability}
                onChange={(e) => handleUpdateAvailability(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="Available">Available</option>
                <option value="Limited">Limited</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          {/* Mentor Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expertise Areas</label>
                <p className="text-gray-900">{mentorProfile.expertise_areas || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <p className="text-gray-900">{mentorProfile.years_of_experience || 'Not specified'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <p className="text-gray-900">{mentorProfile.bio || 'No bio provided'}</p>
              </div>
              {mentorProfile.linkedin_profile && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <a 
                    href={mentorProfile.linkedin_profile} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Profile
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{mentorshipSessions.length}</p>
              <p className="text-sm text-gray-600">Total Sessions</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {mentorshipSessions.filter(s => s.status === 'Completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {mentorshipSessions.filter(s => s.status === 'Scheduled').length}
              </p>
              <p className="text-sm text-gray-600">Scheduled</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {mentorshipSessions.filter(s => s.status === 'Requested').length}
              </p>
              <p className="text-sm text-gray-600">Pending Requests</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <UserCheck className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Not Registered as Mentor</h3>
          <p className="text-gray-600 mb-6">Register as a mentor to start helping students</p>
          <button 
            onClick={() => setShowMentorModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
          >
            Register as Mentor
          </button>
        </div>
      )}

      {/* Mentorship Sessions */}
      {mentorProfile && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Mentorship Sessions</h3>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View All
            </button>
          </div>

          {mentorshipSessions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No mentorship sessions yet</p>
              <p className="text-sm text-gray-400 mt-1">Sessions will appear here when students book time with you</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mentorshipSessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      Session with {session.student?.name || 'Student'}
                    </h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(session.session_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {session.duration} minutes
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        session.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        session.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        session.status === 'Requested' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    {session.notes && (
                      <p className="text-sm text-gray-600 mt-2">{session.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {session.status === 'Requested' && (
                      <>
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                          Accept
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Decline
                        </button>
                      </>
                    )}
                    <button className="text-blue-600 hover:text-blue-800 p-2">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Enhanced Startups Tab Component
const StartupsTab = () => {
  const [entrepreneurProfile, setEntrepreneurProfile] = useState(null);
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntrepreneurData();
  }, []);

  const fetchEntrepreneurData = async () => {
    try {
      setLoading(true);
      const [profileResponse, collaborationsResponse] = await Promise.all([
        alumniAPI.getEntrepreneurProfile(),
        // You'll need to add this API endpoint: alumniAPI.getCollaborations()
        Promise.resolve({ data: [] }) // Placeholder for now
      ]);

      setEntrepreneurProfile(profileResponse.data);
      setCollaborations(collaborationsResponse.data || []);
    } catch (error) {
      console.error('Error fetching entrepreneur data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Entrepreneur Profile Header */}
      {entrepreneurProfile ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{entrepreneurProfile.startup_name}</h2>
              <p className="text-gray-600">Manage your startup profile and collaborations</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                entrepreneurProfile.is_verified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {entrepreneurProfile.is_verified ? 'Verified' : 'Pending Verification'}
              </span>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Startup Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <p className="text-gray-900">{entrepreneurProfile.industry || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Funding Stage</label>
                <p className="text-gray-900">{entrepreneurProfile.funding_stage || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <p className="text-gray-900">{entrepreneurProfile.location || 'Not specified'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900">{entrepreneurProfile.description || 'No description provided'}</p>
              </div>
              {entrepreneurProfile.website && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <a 
                    href={entrepreneurProfile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              {entrepreneurProfile.team_size && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                  <p className="text-gray-900">{entrepreneurProfile.team_size}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{collaborations.length}</p>
              <p className="text-sm text-gray-600">Total Collaborations</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {collaborations.filter(c => c.status === 'Active').length}
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {collaborations.filter(c => c.status === 'Pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {collaborations.filter(c => c.status === 'Completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <Rocket className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Startup Registered</h3>
          <p className="text-gray-600 mb-6">Register your startup to connect with students for collaborations</p>
          <button 
            onClick={() => setShowEntrepreneurModal(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
          >
            Register Startup
          </button>
        </div>
      )}

      {/* Collaborations */}
      {entrepreneurProfile && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Collaboration Requests</h3>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View All
            </button>
          </div>

          {collaborations.length === 0 ? (
            <div className="text-center py-8">
              <Handshake className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No collaboration requests yet</p>
              <p className="text-sm text-gray-400 mt-1">Requests will appear here when students want to collaborate</p>
            </div>
          ) : (
            <div className="space-y-4">
              {collaborations.slice(0, 5).map((collaboration) => (
                <div key={collaboration.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      Collaboration with {collaboration.student?.name || 'Student'}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">{collaboration.project_title}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(collaboration.requested_at).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        collaboration.status === 'Active' ? 'bg-green-100 text-green-800' :
                        collaboration.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        collaboration.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {collaboration.status}
                      </span>
                    </div>
                    {collaboration.description && (
                      <p className="text-sm text-gray-600 mt-2">{collaboration.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {collaboration.status === 'Pending' && (
                      <>
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                          Accept
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Decline
                        </button>
                      </>
                    )}
                    <button className="text-blue-600 hover:text-blue-800 p-2">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SettingsTab = ({ user }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input type="text" value={user.name} className="w-full px-4 py-2 border border-gray-300 rounded-lg" readOnly />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input type="email" value={user.email} className="w-full px-4 py-2 border border-gray-300 rounded-lg" readOnly />
      </div>
    </div>
  </div>
);

export default AlumniDashboard;