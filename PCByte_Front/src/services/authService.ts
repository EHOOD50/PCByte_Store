import axios from 'axios';

const API_URL = "https://unrarefied-unpervasive-pandora.ngrok-free.dev/api/auth";

export const authService = {
  register: async (userData: any) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  login: async (email: string, pass: string) => {
    const token = btoa(`${email}:${pass}`);
    const response = await axios.post(`${API_URL}/login`, {}, {
      headers: { 'Authorization': `Basic ${token}` }
    });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('auth_token', token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  }
};