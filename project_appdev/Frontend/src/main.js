import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

// src/main.js or src/main.ts
import 'bootstrap/dist/css/bootstrap.min.css';

createApp(App).use(router).mount('#app')
