import axios from "./http.interceptor";
import { User } from "@/assets/types/user";

const API_URL = "http://localhost:3000/user";

class UserService {
	async getAll() {
		return await axios.get<User[]>(API_URL);
	}

	async update(id: number, userData: any) {
		return await axios.put(`${API_URL}/${id}`, userData);
	}
}

export default new UserService();
