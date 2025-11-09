import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const studentsAPI = {
  browseJobs: (params) => api.get('/students/jobs', { params }),
  getJob: (id) => api.get(`/students/jobs/${id}`),
  // NOTE: If you are using job/:id/apply, you will need to adjust the backend route in studentApplications.js
  // For now, we rely on the simpler centralized endpoint: POST /students/jobs/apply
  applyToJob: (data) => api.post(`/students/jobs/apply`, data), 
  getApplications: (params) => api.get('/students/applications', { params }),
  updateApplication: (id, data) => api.put(`/students/applications/${id}`, data),
  withdrawApplication: (id) => api.delete(`/students/applications/${id}`),
};

export const alumniAPI = {
  postJob: (data) => api.post('/alumni/jobs', data),
  getMyJobs: () => api.get('/alumni/jobs'),
  getApplications: () => api.get('/alumni/applications'), // Back to normal
  getJobApplications: (jobId) => api.get(`/alumni/jobs/${jobId}/applications`),
  updateApplicationStatus: (jobId, applicationId, data) => api.put(`/alumni/jobs/${jobId}/applications/${applicationId}`, data),
  registerAsMentor: (data) => api.post('/alumni/mentor-profile', data),
  registerAsEntrepreneur: (data) => api.post('/alumni/entrepreneur-profile', data),
  getMentorProfile: () => api.get('/alumni/mentor-profile'),
  getEntrepreneurProfile: () => api.get('/alumni/entrepreneur-profile'),
};

// Public API endpoints for job listings, mentors, and entrepreneurs
// These are often needed for logged-out or basic browsing views
export const publicAPI = {
  // Jobs endpoints
  getJobs: (params) => api.get('/public/jobs', { params }),
  getJob: (id) => api.get(`/public/jobs/${id}`),
  
  // Mentors endpoints
  getMentors: (params) => api.get('/public/mentors', { params }),
  getMentor: (id) => api.get(`/public/mentors/${id}`),
  
  // Entrepreneurs endpoints
  getEntrepreneurs: (params) => api.get('/public/entrepreneurs', { params }),
  getEntrepreneur: (id) => api.get(`/public/entrepreneurs/${id}`),
};

// Application API endpoints for jobs, mentorship, and entrepreneurs
export const applicationsAPI = {
  // Job Applications
  applyForJob: (data) => api.post('/students/jobs/apply', data),
  getMyJobApplications: () => api.get('/students/applications'),
  
  // Mentorship Applications
  bookMentorshipSession: (data) => api.post('/students/mentorship-sessions', data),
  getMyMentorshipSessions: () => api.get('/students/mentorship-sessions'),
  
  // Entrepreneur Collaboration
  requestCollaboration: (data) => api.post('/students/collaborations', data),
  getMyCollaborations: () => api.get('/students/collaborations'),
  
  // Save Jobs
  saveJob: (jobId) => api.post(`/students/jobs/${jobId}/save`),
};


// Admin API endpoints - SINGLE DECLARATION
export const adminAPI = {
  // Dashboard
  getStats: () => api.get('/admin/stats'),
  
  // User Management
  getUsers: (params) => api.get('/admin/users', { params }),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Job Management
  getJobs: (params) => api.get('/admin/jobs', { params }),
  createJob: (data) => api.post('/admin/jobs', data),
  updateJob: (id, data) => api.put(`/admin/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  
  // Mentor Management
  getMentors: (params) => api.get('/admin/mentors', { params }),
  verifyMentor: (id) => api.put(`/admin/mentors/${id}/verify`),
  deleteMentor: (id) => api.delete(`/admin/mentors/${id}`),
  
  // Entrepreneur Management
  getEntrepreneurs: (params) => api.get('/admin/entrepreneurs', { params }),
  verifyEntrepreneur: (id) => api.put(`/admin/entrepreneurs/${id}/verify`),
  deleteEntrepreneur: (id) => api.delete(`/admin/entrepreneurs/${id}`),
  
  // Approval System
  getPendingApprovals: () => api.get('/admin/pending-approvals'),
  approveMentor: (id) => api.post(`/admin/approve-mentor/${id}`),
  approveEntrepreneur: (id) => api.post(`/admin/approve-entrepreneur/${id}`),
  rejectApproval: (id, data) => api.post(`/admin/reject-approval/${id}`, data),
  
  // Analytics
  getAnalytics: () => api.get('/admin/analytics'),
};

export default api;