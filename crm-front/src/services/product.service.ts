import axios from './http.interceptor';

const API_URL = 'http://localhost:3000/product';

class ProductService {
  getAll() {
    return axios.get(API_URL);
  }

  getOne(id: number) {
    return axios.get(`${API_URL}/${id}`);
  }

  create(product: any) {
    return axios.post(API_URL, product);
  }

  update(id: number, product: any) {
    return axios.put(`${API_URL}/${id}`, product);
  }

  delete(id: number) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

export default new ProductService();