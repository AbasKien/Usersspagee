import { createRouter, createWebHistory } from 'vue-router';
import loginview from '../views/loginview.vue';
import register from '../views/register.vue';
import home from '../views/home.vue';
import admin from '../views/admin.vue';
import product from '../views/product.vue';
import cart from '../views/cart.vue';
import checkout from '../views/checkout.vue';
import landingpage from '../views/landingpage.vue';
import profile from '../views/profile.vue';
import adminprod from '../views/adminprod.vue';
import axios from 'axios';

const routes = [
  {
    path: '/',
    name: 'landingpage',
    component: landingpage,
  },
  {
    path: '/login',
    name: 'login',
    component: loginview,
  },
  {
    path: '/signup',
    name: 'signup',
    component: register,
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    meta: { requiresRole: 'client' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: profile,
  },
  {
    path: '/admin/dashboard',
    name: 'admin',
    component: admin,
    meta: { requiresRole: 'admin' },
  },
  {
    path: '/admin/products',
    name: 'adminprod',
    component: adminprod,
    meta: { requiresRole: 'admin' },
  },
  
  { path: '/cart', component: cart,
    meta: { requiresRole: 'client' },
  },
  { path: '/product', component: product },
  {
    path: '/checkout',
    name: 'checkout',
    component: checkout,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: cart,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const userRole = localStorage.getItem('userRole'); // Get role from localStorage
  const isLoggedIn = userRole !== null; // Check if a session exists

  // If the route requires a specific role
  if (to.meta.requiresRole) {
    // Check session info from the backend
    try {
      const response = await axios.get('http://localhost:5555/check-session', { withCredentials: true });

      if (response.data.role === to.meta.requiresRole) {
        next(); // Role matches, proceed to route
      } else {
        next('/login'); // Redirect to login if the role doesn't match
      }
    } catch (error) {
      console.error(error);
      next('/login'); // Redirect to login if there's an error
    }
  } 
  // If trying to access the login page while already logged in // kapag may session pang naka login
  else if (to.name === 'login' && isLoggedIn) {
    // Redirect to the appropriate page based on the user role
    if (userRole === 'client') {
      next('/home'); // Redirect to home for clients
    } else if (userRole === 'admin') {
      next('/admin/dashboard'); // Redirect to admin dashboard
    } else {
      next(); 
    }
  } 
  else {
    next(); // No role required, proceed normally
  }
});

export default router;
