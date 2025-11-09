import { adminAPI } from '/src/services/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserCheck,
  Building,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  UserCog,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  DollarSign,
  Users as UsersIcon
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalMentors: 0,
    totalEntrepreneurs: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, [navigate]);

  const checkAuthentication = () => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }

    try {
      const userObj = JSON.parse(userData);
      
      if (userObj.role !== 'Admin') {
        if (userObj.role === 'Student') {
          navigate('/student/dashboard');
        } else if (userObj.role === 'Alumni') {
          navigate('/alumni/dashboard');
        } else {
          navigate('/');
        }
        return;
      }
      
      setUser(userObj);
      fetchDashboardData();
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setAuthChecked(true);
    }
  };

  const fetchDashboardData = async () => {
  try {
    setLoading(true);
    const statsData = await adminAPI.getDashboardStats();
    setStats(statsData.data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navigationItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'users', name: 'Manage Users', icon: Users },
    { id: 'jobs', name: 'Job Management', icon: Briefcase },
    { id: 'mentors', name: 'Mentor Hub', icon: UserCheck },
    { id: 'entrepreneurs', name: 'Entrepreneurs', icon: Building },
    { id: 'approvals', name: 'Pending Approvals', icon: Clock, badge: stats.pendingApprovals },
    ...(user?.role === 'Admin' ? [{ id: 'admins', name: 'Admin Management', icon: Shield }] : []),
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const renderSectionContent = () => {
    const sections = {
      overview: <OverviewSection stats={stats} />,
      users: <UserManagementSection />,
      jobs: <JobManagementSection />,
      mentors: <MentorManagementSection />,
      entrepreneurs: <EntrepreneurManagementSection />,
      approvals: <ApprovalManagementSection />,
      admins: <AdminManagementSection user={user} />,
      analytics: <AnalyticsSection />,
      settings: <SettingsSection />
    };
    return sections[activeSection] || <OverviewSection stats={stats} />;
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-xl transition-all duration-300 flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CB</span>
              </div>
              <span className="text-xl font-bold text-gray-800">CampusBridge</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 relative ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
                {item.badge > 0 && (
                  <span className="absolute right-3 top-3 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {navigationItems.find(item => item.id === activeSection)?.name || 'Dashboard'}
              </h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderSectionContent()
          )}
        </main>
      </div>
    </div>
  );
};

// Overview Section Component
const OverviewSection = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalMentors: 0,
    totalEntrepreneurs: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all data individually
      const [usersRes, jobsRes, mentorsRes, entrepreneursRes, pendingRes] = await Promise.all([
        adminAPI.getUsers().catch(() => ({ data: [] })),
        adminAPI.getJobs().catch(() => ({ data: [] })),
        adminAPI.getMentors().catch(() => ({ data: [] })),
        adminAPI.getEntrepreneurs().catch(() => ({ data: [] })),
        adminAPI.getPendingApprovals().catch(() => ({ data: [] }))
      ]);

      const statsData = {
        totalUsers: usersRes.data?.length || 0,
        totalJobs: jobsRes.data?.length || 0,
        totalMentors: mentorsRes.data?.length || 0,
        totalEntrepreneurs: entrepreneursRes.data?.length || 0,
        pendingApprovals: pendingRes.data?.length || 0
      };

      console.log('Stats data:', statsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-sm p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-16 bg-gray-200 rounded mb-2"></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
          change="+12%"
        />
        <StatCard
          title="Active Jobs"
          value={stats.totalJobs}
          icon={Briefcase}
          color="green"
          change="+5%"
        />
        <StatCard
          title="Mentors"
          value={stats.totalMentors}
          icon={UserCheck}
          color="purple"
          change="+8%"
        />
        <StatCard
          title="Entrepreneurs"
          value={stats.totalEntrepreneurs}
          icon={Building}
          color="orange"
          change="+15%"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={Clock}
          color="red"
          change="+3"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, change }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
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

// Recent Activity Component
const RecentActivity = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent users, jobs, mentors, entrepreneurs
      const [usersRes, jobsRes, mentorsRes, entrepreneursRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getJobs(),
        adminAPI.getMentors(),
        adminAPI.getEntrepreneurs()
      ]);

      const recentUsers = usersRes.data.slice(0, 3).map(user => ({
        type: 'user',
        user: user.name,
        action: 'created account',
        time: new Date(user.created_at).toLocaleDateString(),
        status: 'approved'
      }));

      const recentJobs = jobsRes.data.slice(0, 2).map(job => ({
        type: 'job',
        user: job.users?.name || 'Unknown',
        action: 'posted a new job',
        time: new Date(job.created_at).toLocaleDateString(),
        status: 'approved'
      }));

      const pendingMentors = mentorsRes.data
        .filter(mentor => !mentor.is_verified)
        .slice(0, 2)
        .map(mentor => ({
          type: 'mentor',
          user: mentor.name,
          action: 'applied as mentor',
          time: new Date(mentor.created_at).toLocaleDateString(),
          status: 'pending'
        }));

      const pendingEntrepreneurs = entrepreneursRes.data
        .filter(entrepreneur => !entrepreneur.is_verified)
        .slice(0, 2)
        .map(entrepreneur => ({
          type: 'startup',
          user: entrepreneur.name,
          action: 'registered startup',
          time: new Date(entrepreneur.created_at).toLocaleDateString(),
          status: 'pending'
        }));

      const allActivities = [
        ...recentUsers,
        ...recentJobs,
        ...pendingMentors,
        ...pendingEntrepreneurs
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

      setActivities(allActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'job' ? 'bg-blue-100' :
                activity.type === 'mentor' ? 'bg-green-100' :
                activity.type === 'startup' ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                {activity.type === 'job' && <Briefcase size={16} className="text-blue-600" />}
                {activity.type === 'mentor' && <UserCheck size={16} className="text-green-600" />}
                {activity.type === 'startup' && <Building size={16} className="text-purple-600" />}
                {activity.type === 'user' && <Users size={16} className="text-gray-600" />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              activity.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {activity.status}
            </span>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-center text-gray-500 py-4">No recent activity</p>
        )}
      </div>
    </div>
  );
};
// Quick Actions Component
const QuickActions = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
    <div className="grid grid-cols-2 gap-4">
      <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
        <Users className="text-blue-600" size={20} />
        <span className="font-medium text-gray-900">Add User</span>
      </button>
      <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
        <Briefcase className="text-green-600" size={20} />
        <span className="font-medium text-gray-900">Post Job</span>
      </button>
      <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
        <UserCheck className="text-purple-600" size={20} />
        <span className="font-medium text-gray-900">Manage Mentors</span>
      </button>
      <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors">
        <Building className="text-orange-600" size={20} />
        <span className="font-medium text-gray-900">View Startups</span>
      </button>
    </div>
  </div>
);

// User Management Section
const UserManagementSection = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add New User
          </button>
        </div>
        
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'Alumni' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Job Management Section
const JobManagementSection = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getJobs();
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await adminAPI.deleteJob(jobId);
        setJobs(jobs.filter(job => job.id !== jobId));
        alert('Job deleted successfully');
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Post New Job
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="mx-auto text-gray-400" size={48} />
            <p className="text-gray-500 mt-4">No jobs found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.company} • {job.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(job.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign size={16} className="mr-2" />
                    {job.salary_range || 'Not specified'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase size={16} className="mr-2" />
                    {job.job_type}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UsersIcon size={16} className="mr-2" />
                    {job.experience_level}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    {new Date(job.created_at).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{job.description}</p>

                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    job.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {job.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Posted by: {job.users?.name || 'Unknown'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Mentor Management Section
const MentorManagementSection = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getMentors();
      setMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMentor = async (mentorId) => {
    try {
      await adminAPI.verifyMentor(mentorId);
      setMentors(mentors.map(mentor => 
        mentor.id === mentorId ? { ...mentor, is_verified: true } : mentor
      ));
      alert('Mentor verified successfully');
    } catch (error) {
      console.error('Error verifying mentor:', error);
      alert('Failed to verify mentor');
    }
  };

  const handleDeleteMentor = async (mentorId) => {
    if (window.confirm('Are you sure you want to delete this mentor?')) {
      try {
        await adminAPI.deleteMentor(mentorId);
        setMentors(mentors.filter(mentor => mentor.id !== mentorId));
        alert('Mentor deleted successfully');
      } catch (error) {
        console.error('Error deleting mentor:', error);
        alert('Failed to delete mentor');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Mentor Hub</h2>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Manage Mentors
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : mentors.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck className="mx-auto text-gray-400" size={48} />
            <p className="text-gray-500 mt-4">No mentors found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={mentor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=random`}
                      alt={mentor.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{mentor.name}</h3>
                      <p className="text-sm text-gray-600">{mentor.expertise}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!mentor.is_verified && (
                      <button 
                        onClick={() => handleVerifyMentor(mentor.id)}
                        className="text-green-600 hover:text-green-800"
                        title="Verify Mentor"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteMentor(mentor.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Mail size={14} className="mr-2" />
                    {mentor.users?.email}
                  </div>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-2" />
                    {mentor.location}
                  </div>
                  <div className="flex items-center">
                    <Briefcase size={14} className="mr-2" />
                    {mentor.years_of_experience} years experience
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{mentor.bio}</p>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    mentor.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {mentor.is_verified ? 'Verified' : 'Pending Verification'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    mentor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {mentor.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Entrepreneur Management Section
const EntrepreneurManagementSection = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntrepreneurs();
  }, []);

  const fetchEntrepreneurs = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getEntrepreneurs();
      setEntrepreneurs(response.data);
    } catch (error) {
      console.error('Error fetching entrepreneurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEntrepreneur = async (entrepreneurId) => {
    try {
      await adminAPI.verifyEntrepreneur(entrepreneurId);
      setEntrepreneurs(entrepreneurs.map(entrepreneur => 
        entrepreneur.id === entrepreneurId ? { ...entrepreneur, is_verified: true } : entrepreneur
      ));
      alert('Entrepreneur verified successfully');
    } catch (error) {
      console.error('Error verifying entrepreneur:', error);
      alert('Failed to verify entrepreneur');
    }
  };

  const handleDeleteEntrepreneur = async (entrepreneurId) => {
    if (window.confirm('Are you sure you want to delete this entrepreneur?')) {
      try {
        await adminAPI.deleteEntrepreneur(entrepreneurId);
        setEntrepreneurs(entrepreneurs.filter(entrepreneur => entrepreneur.id !== entrepreneurId));
        alert('Entrepreneur deleted successfully');
      } catch (error) {
        console.error('Error deleting entrepreneur:', error);
        alert('Failed to delete entrepreneur');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Entrepreneur Management</h2>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            Manage Startups
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : entrepreneurs.length === 0 ? (
          <div className="text-center py-12">
            <Building className="mx-auto text-gray-400" size={48} />
            <p className="text-gray-500 mt-4">No entrepreneurs found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {entrepreneurs.map((entrepreneur) => (
              <div key={entrepreneur.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={entrepreneur.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(entrepreneur.startup_name)}&background=random`}
                      alt={entrepreneur.startup_name}
                      className="w-12 h-12 rounded-lg"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{entrepreneur.startup_name}</h3>
                      <p className="text-sm text-gray-600">{entrepreneur.industry}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!entrepreneur.is_verified && (
                      <button 
                        onClick={() => handleVerifyEntrepreneur(entrepreneur.id)}
                        className="text-green-600 hover:text-green-800"
                        title="Verify Entrepreneur"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteEntrepreneur(entrepreneur.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <UserCheck size={14} className="mr-2" />
                    {entrepreneur.name}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={14} className="mr-2" />
                    {entrepreneur.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp size={14} className="mr-2" />
                    {entrepreneur.funding_stage}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign size={14} className="mr-2" />
                    {entrepreneur.funding || 'Not specified'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UsersIcon size={14} className="mr-2" />
                    {entrepreneur.employees} employees
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={14} className="mr-2" />
                    Founded {entrepreneur.founded}
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4">{entrepreneur.description}</p>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    entrepreneur.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {entrepreneur.is_verified ? 'Verified' : 'Pending Verification'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Contact: {entrepreneur.users?.email}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Approval Management Section
const ApprovalManagementSection = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPendingApprovals();
      setApprovals(response.data || []);
    } catch (error) {
      console.error('Error fetching approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, type) => {
    try {
      if (type === 'mentor') {
        await adminAPI.approveMentor(id);
      } else {
        await adminAPI.approveEntrepreneur(id);
      }
      alert(`${type} approved successfully!`);
      fetchPendingApprovals(); // Refresh the list
    } catch (error) {
      console.error('Error approving:', error);
      alert('Failed to approve');
    }
  };

  const handleReject = async (id, type) => {
    try {
      await adminAPI.rejectApproval(id, { type });
      alert(`${type} rejected successfully!`);
      fetchPendingApprovals(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Failed to reject');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
        <p className="text-gray-600 mt-2">Review and approve mentor and entrepreneur registrations</p>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : approvals.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto text-green-500" size={48} />
            <p className="text-gray-500 mt-4">No pending approvals</p>
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval) => (
              <div key={approval.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    approval.type === 'mentor' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {approval.type === 'mentor' ? 
                      <UserCheck className="text-green-600" size={24} /> : 
                      <Building className="text-purple-600" size={24} />
                    }
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{approval.name}</h3>
                    <p className="text-sm text-gray-600">
                      {approval.type === 'mentor' ? 
                        `Expertise: ${approval.expertise}` : 
                        `Startup: ${approval.startup_name}`
                      }
                    </p>
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(approval.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleApprove(approval.id, approval.type)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={16} />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(approval.id, approval.type)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle size={16} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Analytics Section
const AnalyticsSection = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Reports</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">User Growth</h3>
          <p className="text-gray-600">Total Users: {analytics?.userGrowth?.length || 0}</p>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Job Postings</h3>
          <p className="text-gray-600">Total Jobs: {analytics?.jobPostings?.length || 0}</p>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg lg:col-span-2">
          <h3 className="font-semibold text-gray-900 mb-4">Role Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analytics?.roleDistribution?.reduce((acc, user) => {
              acc[user.role] = (acc[user.role] || 0) + 1;
              return acc;
            }, {}) && Object.entries(analytics.roleDistribution.reduce((acc, user) => {
              acc[user.role] = (acc[user.role] || 0) + 1;
              return acc;
            }, {})).map(([role, count]) => (
              <div key={role} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Other sections (keep as is)
const AdminManagementSection = ({ user }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
        Create Admin
      </button>
    </div>
    <p className="text-gray-600">Manage admin users and permissions.</p>
  </div>
);

const SettingsSection = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
    <p className="text-gray-600">Configure platform settings and preferences.</p>
  </div>
);

export default Dashboard;