import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// Posts
export const postsAPI = {
  getAll: (params) => api.get('/posts', { params }),
  getBySlug: (slug) => api.get(`/posts/${slug}`),
  toggleLike: (id) => api.post(`/posts/${id}/like`),
};

// Comments
export const commentsAPI = {
  getByPost: (postId) => api.get(`/posts/${postId}/comments`),
  create: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  delete: (id) => api.delete(`/comments/${id}`),
};

// Categories
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
};

// Admin
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getPosts: (params) => api.get('/admin/posts', { params }),
  createPost: (data) => api.post('/admin/posts', data),
  updatePost: (id, data) => api.put(`/admin/posts/${id}`, data),
  deletePost: (id) => api.delete(`/admin/posts/${id}`),
  getUsers: () => api.get('/admin/users'),
  toggleUserRole: (id) => api.put(`/admin/users/${id}/toggle-role`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
};

export default api;
