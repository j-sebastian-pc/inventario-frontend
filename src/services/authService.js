// src/services/authService.js
import api from './api';

const register = async (userData) => {
  const response = await api.post('/register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post('/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

const logout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  isAdmin
};