import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const loginAdmin = (data : any) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const changePassword = (data : any) => api.put('/auth/change-password', data);

// Jobs
export const getAdminJobs = (params : any) => api.get('/jobs/admin/all', { params });
export const createJob = (data : any) => api.post('/jobs/admin', data);
export const updateJob = (id : any, data : any) => api.put(`/jobs/admin/${id}`, data);
export const deleteJob = (id : any) => api.delete(`/jobs/admin/${id}`);
export const toggleJob = (id : any) => api.patch(`/jobs/admin/${id}/toggle`);

// Results
export const getAdminResults = (params : any) => api.get('/results/admin/all', { params });
export const createResult = (data : any) => api.post('/results/admin', data);
export const updateResult = (id : any, data : any) => api.put(`/results/admin/${id}`, data);
export const deleteResult = (id : any) => api.delete(`/results/admin/${id}`);
export const toggleResult = (id : any) => api.patch(`/results/admin/${id}/toggle`);

// Scholarships
export const getAdminScholarships = (params : any) => api.get('/scholarships/admin/all', { params });
export const createScholarship = (data : any) => api.post('/scholarships/admin', data);
export const updateScholarship = (id : any, data : any) => api.put(`/scholarships/admin/${id}`, data);
export const deleteScholarship = (id : any) => api.delete(`/scholarships/admin/${id}`);
export const toggleScholarship = (id : any) => api.patch(`/scholarships/admin/${id}/toggle`);

// Schemes
export const getAdminSchemes = (params : any) => api.get('/schemes/admin/all', { params });
export const createScheme = (data : any) => api.post('/schemes/admin', data);
export const updateScheme = (id : any, data : any) => api.put(`/schemes/admin/${id}`, data);
export const deleteScheme = (id : any) => api.delete(`/schemes/admin/${id}`);
export const toggleScheme = (id : any) => api.patch(`/schemes/admin/${id}/toggle`);

// Categories
export const getAdminCategories = (params : any) => api.get('/categories', { params });
export const createAdminCategory = (data : any) => api.post('/categories', data);
export const deleteAdminCategory = (id : any) => api.delete(`/categories/${id}`);

// News
export const getAdminNews = (params : any) => api.get('/news/admin/all', { params });
export const createNews = (data : any) => api.post('/news/admin', data);
export const updateNews = (id : any, data : any) => api.put(`/news/admin/${id}`, data);
export const deleteNews = (id : any) => api.delete(`/news/admin/${id}`);
export const toggleNews = (id : any) => api.patch(`/news/admin/${id}/toggle`);

// Contacts
export const getAdminContacts = (params : any) => api.get('/contacts/admin/all', { params });
export const markContactAsRead = (id : any) => api.patch(`/contacts/admin/${id}/read`);
export const deleteAdminContact = (id : any) => api.delete(`/contacts/admin/${id}`);

// Study Materials
export const getAdminStudyMaterials = (params : any) => api.get('/study-materials/admin/all', { params });
export const createStudyMaterial = (data : any) => api.post('/study-materials/admin', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateStudyMaterial = (id : any, data : any) => api.put(`/study-materials/admin/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteStudyMaterial = (id : any) => api.delete(`/study-materials/admin/${id}`);
export const toggleStudyMaterial = (id : any) => api.patch(`/study-materials/admin/${id}/toggle`);

export default api;
