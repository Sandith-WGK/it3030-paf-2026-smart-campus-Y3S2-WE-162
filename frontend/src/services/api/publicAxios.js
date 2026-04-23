import axios from 'axios';

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1',
  withCredentials: false,
});

export default publicApi;
