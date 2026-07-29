import { useState, useCallback, useEffect } from 'react';
import { profileAPI, requestsAPI, curatorAPI, categoriesAPI, authAPI } from '../api/client';

// Хук для работы с профилем
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [profileRes, statsRes] = await Promise.all([
        profileAPI.getProfile(),
        profileAPI.getStats()
      ]);
      setProfile(profileRes.data);
      setStats(statsRes.data);
      authAPI.setUserData(profileRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { profile, stats, loading, error, reload: loadProfile };
};

// Хук для работы с заявками (студент)
export const useRequests = (statusFilter = null) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await requestsAPI.getRequests(statusFilter);
      setRequests(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const createRequest = useCallback(async (data) => {
    try {
      const response = await requestsAPI.createRequest(data);
      await loadRequests();
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || err.message 
      };
    }
  }, [loadRequests]);

  const cancelRequest = useCallback(async (id) => {
    try {
      await requestsAPI.cancelRequest(id);
      await loadRequests();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || err.message 
      };
    }
  }, [loadRequests]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  return { 
    requests, 
    loading, 
    error, 
    reload: loadRequests,
    createRequest,
    cancelRequest
  };
};

// Хук для работы с заявками (куратор)
export const useCuratorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await curatorAPI.getRequests();
      setRequests(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRequest = useCallback(async (id, data) => {
    try {
      const response = await curatorAPI.updateRequest(id, data);
      await loadRequests();
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || err.message 
      };
    }
  }, [loadRequests]);

  const approveRequest = useCallback(async (id, finalXp = null) => {
    try {
      const data = { status: 'approved' };
      if (finalXp !== null) data.final_xp = finalXp;
      const response = await curatorAPI.approveRequest(id, data);
      await loadRequests();
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || err.message 
      };
    }
  }, [loadRequests]);

  const rejectRequest = useCallback(async (id, comment = '') => {
    try {
      const data = { status: 'rejected' };
      if (comment) data.comment = comment;
      const response = await curatorAPI.rejectRequest(id, data);
      await loadRequests();
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || err.message 
      };
    }
  }, [loadRequests]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  return { 
    requests, 
    loading, 
    error, 
    reload: loadRequests,
    updateRequest,
    approveRequest,
    rejectRequest
  };
};

// Хук для работы с категориями
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoriesAPI.getCategories();
      setCategories(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return { categories, loading, error, reload: loadCategories };
};

// Хук для авторизации
export const useAuth = () => {
  const [user, setUser] = useState(authAPI.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login({ email, password });
      const { access, refresh, user: userData } = response.data;
      
      localStorage.setItem('access_token', access);
      if (refresh) localStorage.setItem('refresh_token', refresh);
      
      authAPI.setUserData(userData);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.register(data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
  }, []);

  return { user, loading, error, login, register, logout };
};