import { reactive } from 'vue';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  isLoggedIn: boolean;
  user: any;
}

const state = reactive<AuthState>({
  isLoggedIn: !!localStorage.getItem('token'),
  user: null
});

const token = localStorage.getItem('token');
if (token) {
  try {
    state.user = jwtDecode(token);
  } catch (error) {
    localStorage.removeItem('token');
    state.isLoggedIn = false;
  }
}

export const authStore = {
  state,
  
  login(token: string) {
    localStorage.setItem('token', token);
    state.isLoggedIn = true;
    state.user = jwtDecode(token);
  },
  
  logout() {
    localStorage.removeItem('token');
    state.isLoggedIn = false;
    state.user = null;
  }
};