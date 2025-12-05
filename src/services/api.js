import axios from 'axios';

// Prefer environment variable; fallback to your Render URL (no trailing slash)
const DEFAULT_API = 'https://connectu-backend-1xc9.onrender.com/api';
const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API).replace(/\/+$/, ''); // remove trailing slash if any

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
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // use location.assign to avoid React router state issues
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

// --- API groups ---

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const studentsAPI = {
  browseJobs: (params) => api.get('/students/jobs', { params }),
  getJob: (id) => api.get(`/students/jobs/${id}`),
  applyToJob: (data) => api.post(`/students/jobs/apply`, data),
  getApplications: (params) => api.get('/students/applications', { params }),
  updateApplication: (id, data) => api.put(`/students/applications/${id}`, data),
  withdrawApplication: (id) => api.delete(`/students/applications/${id}`),
};

export const alumniAPI = {
  postJob: (data) => api.post('/alumni/jobs', data),
  getMyJobs: () => api.get('/alumni/jobs'),
  getApplications: () => api.get('/alumni/applications'),
  getJobApplications: (jobId) => api.get(`/alumni/jobs/${jobId}/applications`),
  updateApplicationStatus: (jobId, applicationId, data) =>
    api.put(`/alumni/jobs/${jobId}/applications/${applicationId}`, data),
  registerAsMentor: (data) => api.post('/alumni/mentor-profile', data),
  registerAsEntrepreneur: (data) => api.post('/alumni/entrepreneur-profile', data),
  getMentorProfile: () => api.get('/alumni/mentor-profile'),
  getEntrepreneurProfile: () => api.get('/alumni/entrepreneur-profile'),
};

export const publicAPI = {
  getJobs: (params) => api.get('/public/jobs', { params }),
  getJob: (id) => api.get(`/public/jobs/${id}`),
  getMentors: (params) => api.get('/public/mentors', { params }),
  getMentor: (id) => api.get(`/public/mentors/${id}`),
  getEntrepreneurs: (params) => api.get('/public/entrepreneurs', { params }),
  getEntrepreneur: (id) => api.get(`/public/entrepreneurs/${id}`),
};

export const applicationsAPI = {
  applyForJob: (data) => api.post('/students/jobs/apply', data),
  getMyJobApplications: () => api.get('/students/applications'),
  bookMentorshipSession: (data) => api.post('/students/mentorship-sessions', data),
  getMyMentorshipSessions: () => api.get('/students/mentorship-sessions'),
  requestCollaboration: (data) => api.post('/students/collaborations', data),
  getMyCollaborations: () => api.get('/students/collaborations'),
  saveJob: (jobId) => api.post(`/students/jobs/${jobId}/save`),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getJobs: (params) => api.get('/admin/jobs', { params }),
  createJob: (data) => api.post('/admin/jobs', data),
  updateJob: (id, data) => api.put(`/admin/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  getMentors: (params) => api.get('/admin/mentors', { params }),
  verifyMentor: (id) => api.put(`/admin/mentors/${id}/verify`),
  deleteMentor: (id) => api.delete(`/admin/mentors/${id}`),
  getEntrepreneurs: (params) => api.get('/admin/entrepreneurs', { params }),
  verifyEntrepreneur: (id) => api.put(`/admin/entrepreneurs/${id}/verify`),
  deleteEntrepreneur: (id) => api.delete(`/admin/entrepreneurs/${id}`),
  getPendingApprovals: () => api.get('/admin/pending-approvals'),
  approveMentor: (id) => api.post(`/admin/approve-mentor/${id}`),
  approveEntrepreneur: (id) => api.post(`/admin/approve-entrepreneur/${id}`),
  rejectApproval: (id, data) => api.post(`/admin/reject-approval/${id}`, data),
  getAnalytics: () => api.get('/admin/analytics'),
};

export default api;
