import axios from './axios';

export const authService = {
  login: async (email, password) => {
    const response = await axios.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
  },

  verifyEmail: async (email, code) => {
    const response = await axios.post('/auth/verify', { email, code });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axios.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (email, code, newPassword) => {
    const response = await axios.post('/auth/reset-password', { email, code, newPassword });
    return response.data;
  }
};
