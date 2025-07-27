import axios from "axios";
import { jwtDecode } from "jwt-decode"
import { authStore } from '@/stores/auth';

const API_URL = "http://localhost:3000/";

export default {
	async login(email: string, password: string) {
		const response = await axios.post(API_URL + "auth/login", {
			email,
			password,
		});
		if (response.data.token) {
			authStore.login(response.data.token);
		}
		return response.data;
	},

	logout() {
		authStore.logout();
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
		return authStore.state.user;
	},

	getToken() {
		return localStorage.getItem("token");
	},

	isLoggedIn() {
		return authStore.state.isLoggedIn;
	},
};
