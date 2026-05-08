import axios from 'axios';

const api = axios.create({
  // HARDCODE: Memaksa URL ke Cloud Run untuk mem-bypass masalah env Turborepo
  baseURL: 'https://agriflow-api-694788844994.asia-southeast1.run.app/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('agriflow_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('agriflow_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;