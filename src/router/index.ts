// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router'; // Use type-only import for RouteRecordRaw
import Home from '../../src/components/Home.vue'; // Adjust path to your Home component
import Admin from '../../src/components/Admin.vue'; // Adjust path to your Admin component

// Assuming you have a function to check authentication status
const isAuthenticated = () => {
  // Implement your logic to check if the user is authenticated
  return true; // Replace with actual authentication check
};

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    // Redirect to login page or handle unauthorized access
    next('/login'); // Ensure you have a route defined for /login
  } else {
    next();
  }
});

export default router;
