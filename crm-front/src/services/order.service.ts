import axios from "./http.interceptor";
import { Order } from "@/assets/types/order";

const API_URL = "http://localhost:3000/order";

class OrderService {
	getAll() {
		return axios.get(API_URL);
	}

	getOne(id: number) {
		return axios.get(`${API_URL}/${id}`);
	}

	create(order: any) {
		return axios.post(API_URL, order);
	}
}

export default new OrderService();
