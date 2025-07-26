import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:3000/";

export default {
	async login(email: string, password: string) {
		const response = await axios.post(API_URL + "auth/login", {
			email,
			password,
		});
		if (response.data.token) {
			const userInfos = jwtDecode(response.data.token);

			localStorage.setItem("token", response.data.token);
			localStorage.setItem("user", JSON.stringify(userInfos));
		}
		return response.data;
	},

	logout() {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	},

	async register(
		firstName: string,
		lastName: string,
		email: string,
		password: string
	) {
		return await axios.post(API_URL + "user", {
			firstName,
			lastName,
			email,
			password,
		});
	},

	getCurrentUser() {
		const userStr = localStorage.getItem("user");
		if (userStr) return JSON.parse(userStr);
		return null;
	},

	getToken() {
		return localStorage.getItem("token");
	},

	isLoggedIn() {
		return !!this.getToken();
	},
};
