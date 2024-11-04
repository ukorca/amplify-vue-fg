// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from '../src/router'; // Import your router

createApp(App)
  .use(router) // Register the router
  .mount('#app');
