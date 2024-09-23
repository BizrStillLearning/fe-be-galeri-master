import { createApp } from 'vue';
import router from './router';
import { createPinia } from 'pinia'
import './assets/main.css';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.mount('#app');
app.use(pinia)
