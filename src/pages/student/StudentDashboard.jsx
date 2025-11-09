import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentsAPI } from '../../services/api';
import {
  Briefcase,
  UserCheck,
  Rocket,
  LogOut,
  Search,
  BarChart3,
  BookOpen,
  Handshake,
  Clock,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  Users,
  Award,
  TrendingUp
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchData();
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

const fetchData = async () => {
  try {
    setLoading(true);
    
    const [jobsRes, applicationsRes] = await Promise.all([
      studentsAPI.browseJobs().catch(err => {
        console.error('Error fetching jobs:', err);
        return { data: { jobs: [] } }; // Return proper structure
      }),
      studentsAPI.getApplications().catch(err => {
        console.error('Error fetching applications:', err);
        return { data: { jobApplications: [] } }; // Return proper structure
      })
    ]);

    // FIX: Access the correct nested fields
    setJobs(jobsRes?.data?.jobs || []);
    setApplications(applicationsRes?.data?.jobApplications || []);

    // Debug logging
    console.log('Jobs response:', jobsRes?.data);
    console.log('Applications response:', applicationsRes?.data);

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    setJobs([]);
    setApplications([]);
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': 
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'Pending').length,
    interviewsScheduled: applications.filter(app => app.status === 'Reviewed').length,
    offersReceived: applications.filter(app => app.status === 'Accepted').length
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'jobs', name: 'Browse Jobs', icon: Briefcase },
    { id: 'applications', name: 'My Applications', icon: BookOpen },
    { id: 'mentorship', name: 'Mentorship', icon: UserCheck },
    { id: 'collaborations', name: 'Collaborations', icon: Handshake },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={stats} applications={applications} />;
      case 'jobs':
        return <JobsTab jobs={filteredJobs} loading={loading} searchTerm={searchTerm} onSearchChange={setSearchTerm} />;
      case 'applications':
        return <ApplicationsTab applications={applications} loading={loading} />;
      case 'mentorship':
        return <MentorshipTab />;
      case 'collaborations':
        return <CollaborationsTab />;
      default:
        return <OverviewTab stats={stats} applications={applications} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Same style as AlumniDashboard */}
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
              <p className="text-sm text-gray-500">Student</p>
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
              {activeTab === 'jobs' && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderTabContent()
          )}
        </main>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ stats, applications }) => (
  <div className="space-y-8">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Applications"
        value={stats.totalApplications}
        icon={Briefcase}
        color="blue"
        description="Jobs applied to"
      />
      <StatCard
        title="Pending Reviews"
        value={stats.pendingApplications}
        icon={Clock}
        color="yellow"
        description="Awaiting response"
      />
      <StatCard
        title="Interviews"
        value={stats.interviewsScheduled}
        icon={Users}
        color="green"
        description="Scheduled meetings"
      />
      <StatCard
        title="Offers Received"
        value={stats.offersReceived}
        icon={Award}
        color="purple"
        description="Job offers"
      />
    </div>

    {/* Quick Actions */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <QuickActionCard
        title="Browse Jobs"
        description="Find your next career opportunity"
        icon={Briefcase}
        color="blue"
        onClick={() => window.location.href = '/jobs'}
      />
      <QuickActionCard
        title="Find Mentors"
        description="Connect with industry experts"
        icon={UserCheck}
        color="green"
        onClick={() => window.location.href = '/mentorship'}
      />
      <QuickActionCard
        title="Collaborate"
        description="Work with startups and entrepreneurs"
        icon={Rocket}
        color="purple"
        onClick={() => window.location.href = '/entrepreneurs'}
      />
    </div>

    
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
        <button 
          onClick={() => window.location.href = '/jobs'}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View All
        </button>
      </div>
      <div className="space-y-4">

{applications.slice(0, 5).map((application) => (
  <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
    <div className="flex-1">
      {/* FIX: Access nested job object */}
      <h3 className="font-semibold text-gray-900">
        {application.job?.title || 'Job Title Not Available'}
      </h3>
      <p className="text-gray-600 text-sm">
        {application.job?.company || 'Company Not Available'}
      </p>
      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
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
      <button className="text-blue-600 hover:text-blue-800 p-2">
        <ExternalLink size={16} />
      </button>
    </div>
  </div>
))}
        {applications.length === 0 && (
          <div className="text-center py-8">
            <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No applications yet</p>
            <button 
              onClick={() => window.location.href = '/jobs'}
              className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Browse Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Jobs Tab Component
const JobsTab = ({ jobs, loading, searchTerm, onSearchChange }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
          <p className="text-gray-600 mt-2">Find your next career opportunity</p>
        </div>
        <div className="text-gray-600">
          {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Briefcase className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs available</h3>
          <p className="text-gray-500">Check back later for new opportunities</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

// Job Card Component
const JobCard = ({ job }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-200">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-bold text-gray-900 text-lg mb-1">{job.title}</h3>
        <p className="text-blue-600 font-semibold">{job.company}</p>
      </div>
      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
        {job.job_type}
      </span>
    </div>

    <div className="space-y-3 mb-4">
      <div className="flex items-center text-sm text-gray-600">
        <MapPin size={16} className="mr-2" />
        {job.location}
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

    <button
      onClick={() => window.location.href = `/jobs/${job.id}`}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
    >
      Apply Now
    </button>
  </div>
);

// Applications Tab Component
const ApplicationsTab = ({ applications, loading }) => {
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
        <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
        <p className="text-gray-600 mt-2">Track your job applications</p>
      </div>

      <div className="p-6">
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-500 mb-6">Start by applying to jobs that interest you</p>
            <button 
              onClick={() => window.location.href = '/jobs'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Application Card Component
// Application Card Component - FIXED VERSION
const ApplicationCard = ({ application }) => (
  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div>
        {/* FIX: Access nested job object */}
        <h3 className="font-bold text-gray-900 text-lg">
          {application.job?.title || 'Job Title Not Available'}
        </h3>
        <p className="text-blue-600 font-semibold">
          {application.job?.company || 'Company Not Available'}
        </p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
        application.status === 'Accepted' ? 'bg-green-100 text-green-800' :
        application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {application.status}
      </span>
    </div>

    <div className="flex items-center justify-between text-sm text-gray-600">
      <span>Applied on {new Date(application.applied_at).toLocaleDateString()}</span>
      <button className="text-blue-600 hover:text-blue-800 font-medium">
        View Details
      </button>
    </div>
  </div>
);

// Mentorship Tab Component
const MentorshipTab = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="text-center py-12">
      <UserCheck className="mx-auto text-gray-400 mb-4" size={64} />
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Mentorship Program</h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Connect with experienced alumni mentors who can guide your career journey and provide valuable insights.
      </p>
      <button 
        onClick={() => window.location.href = '/mentorship'}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
      >
        Browse Mentors
      </button>
    </div>
  </div>
);

// Collaborations Tab Component
const CollaborationsTab = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="text-center py-12">
      <Handshake className="mx-auto text-gray-400 mb-4" size={64} />
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Entrepreneur Collaborations</h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Work with innovative startups and entrepreneurs on exciting projects and gain real-world experience.
      </p>
      <button 
        onClick={() => window.location.href = '/entrepreneurs'}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
      >
        Explore Opportunities
      </button>
    </div>
  </div>
);

// Reusable Components
const StatCard = ({ title, value, icon: Icon, color, description }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200',
    green: 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200'
  };

  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-xl transition-all duration-200 text-left border-2 ${colorClasses[color]} hover:scale-105 hover:shadow-md`}
    >
      <Icon size={32} className="mb-3" />
      <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </button>
  );
};

export default StudentDashboard;
