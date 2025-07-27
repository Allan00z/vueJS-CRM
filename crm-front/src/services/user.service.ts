import axios from 'axios';
import AuthService from './auth.service';

const API_URL = 'http://localhost:3000/';

export default {
  async getOne(id: number) {
    const token = AuthService.getToken();
    return await axios.get(`${API_URL}user/${id}`);
  },

  async update(id: number, userData: any) {
    const token = AuthService.getToken();
    return await axios.put(`${API_URL}user/${id}`, userData);
  }
};