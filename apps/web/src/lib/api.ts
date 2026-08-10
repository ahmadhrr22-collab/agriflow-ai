import axios from 'axios';

let baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1').trim();
if (baseUrl.endsWith('/')) {
  baseUrl = baseUrl.slice(0, -1);
}
if (!baseUrl.includes('/api/v1')) {
  baseUrl = `${baseUrl}/api/v1`;
}

const api = axios.create({
  baseURL: baseUrl,
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