import axios from 'axios';
import AuthService from './auth.service';
import { Order } from '@/assets/types/order';

const API_URL = 'http://localhost:3000/';

export default {
  async create(orderData: any) {
    const token = AuthService.getToken();
    return await axios.post(`${API_URL}order`, orderData);
  },
};