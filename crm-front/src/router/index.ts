import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '@/views/Register.vue'
import Login from '@/views/Login.vue'
import Cart from '@/views/Cart.vue'
import ProductList from '@/views/ProductList.vue'
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// check authentication for protected routes
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = AuthService.isLoggedIn();

  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router
