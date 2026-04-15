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
    console.log(`API Call: Verifying ${email} with code ${code}`);
    try {
      const response = await axios.post('/auth/verify', { email, code });
      console.log('API Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
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
