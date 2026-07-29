import axios from 'axios';

export const BASE_URL = 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Получение токена
const getAuthToken = () => {
  const accessToken = localStorage.getItem('access_token');
  const sessionToken = sessionStorage.getItem('access_token');
  return accessToken || sessionToken || null;
};

// Интерсептор для добавления токена
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерсептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Очищаем токены и перенаправляем на логин
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API для авторизации
export const authAPI = {
  login: (credentials) => apiClient.post('/api/auth/login/', credentials),
  register: (data) => apiClient.post('/api/auth/register/', data),
  logout: () => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user_data');
  },
  getCurrentUser: () => {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },
  setUserData: (data) => {
    localStorage.setItem('user_data', JSON.stringify(data));
  }
};

// API для профиля
export const profileAPI = {
  getProfile: () => apiClient.get('/api/profile/'),
  getStats: () => apiClient.get('/api/profile/stats/'),
  updateProfile: (data) => apiClient.patch('/api/profile/', data),
};

// API для заявок (студент)
export const requestsAPI = {
  getRequests: (status) => {
    const params = status ? { params: { status } } : {};
    return apiClient.get('/api/requests/', params);
  },
  createRequest: (data) => apiClient.post('/api/requests/', data),
  getRequest: (id) => apiClient.get(`/api/requests/${id}/`),
  cancelRequest: (id) => apiClient.delete(`/api/requests/${id}/`),
};

// API для заявок (куратор)
export const curatorAPI = {
  getRequests: () => apiClient.get('/api/curator/requests/'),
  updateRequest: (id, data) => apiClient.patch(`/api/curator/requests/${id}/`, data),
  approveRequest: (id, data) => apiClient.patch(`/api/curator/requests/${id}/`, { 
    status: 'approved',
    ...data 
  }),
  rejectRequest: (id, data) => apiClient.patch(`/api/curator/requests/${id}/`, { 
    status: 'rejected',
    ...data 
  }),
};

// API для справочников
export const categoriesAPI = {
  getCategories: () => apiClient.get('/api/categories/'),
  getCategory: (id) => apiClient.get(`/api/categories/${id}/`),
};

export default apiClient;