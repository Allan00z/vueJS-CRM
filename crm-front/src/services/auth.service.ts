import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/';

export default {
  login(email: string, password: string) {
    return axios
      .post(API_URL + 'login', {
        email,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
      });
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  register(firstName: string, lastName: string, email: string, password: string) {
    return axios.post(API_URL + 'register', {
      firstName,
      lastName,
      email,
      password
    });
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isLoggedIn() {
    return !!this.getToken();
  }
};