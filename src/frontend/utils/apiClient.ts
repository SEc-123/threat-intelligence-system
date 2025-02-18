import axios from 'axios';

// Configure API client with error handling
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for auth token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unified error handling
const handleError = (error) => {
  if (error.response) {
    console.error('API Error:', error.response.data);
    throw error.response.data;
  }
  throw new Error('Network Error');
};

export const safeRequest = {
  get: (url) => apiClient.get(url).catch(handleError),
  post: (url, data) => apiClient.post(url, data).catch(handleError),
  put: (url, data) => apiClient.put(url, data).catch(handleError),
  delete: (url) => apiClient.delete(url).catch(handleError)
};
