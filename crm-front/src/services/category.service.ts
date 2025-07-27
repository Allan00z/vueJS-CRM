import axios from "./http.interceptor";

const API_URL = "http://localhost:3000/category";

class CategoryService {
	getAll() {
		return axios.get(API_URL);
	}

	getOne(id: number) {
		return axios.get(`${API_URL}/${id}`);
	}

	create(category: any) {
		return axios.post(API_URL, category);
	}

	update(id: number, category: any) {
		return axios.put(`${API_URL}/${id}`, category);
	}

	delete(id: number) {
		return axios.delete(`${API_URL}/${id}`);
	}
}

export default new CategoryService();
