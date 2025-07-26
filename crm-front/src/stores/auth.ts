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

// Initialize user from token
const token = localStorage.getItem('token');
if (token) {
  try {
    state.user = jwtDecode(token);
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    state.isLoggedIn = false;
  }
}

export const authStore = {
  state,
  
  login(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    state.isLoggedIn = true;
    state.user = jwtDecode(token);
  },
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    state.isLoggedIn = false;
    state.user = null;
  }
};