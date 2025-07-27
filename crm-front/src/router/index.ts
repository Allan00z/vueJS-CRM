import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '@/views/Register.vue'
import Login from '@/views/Login.vue'
import Cart from '@/views/Cart.vue'
import ProductList from '@/views/ProductList.vue'
import Profile from '@/views/Profile.vue'
import AuthService from '@/services/auth.service'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/products',
    name: 'ProductList',
    component: ProductList
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// check authentication for protected routes
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/'];
  const loggedIn = AuthService.isLoggedIn();

  if ((to.path === '/login' || to.path === '/register') && loggedIn) {
    next({ path: '/', replace: true });
  } else if (!publicPages.includes(to.path) && !loggedIn) {
    next({ path: '/login', replace: true });
  } else {
    next();
  }
});


export default router
