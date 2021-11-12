import { createApp } from 'vue'
import store from './store/index.js';
import App from './App.vue'

const app = createApp(App);
app.use(store)
app.mount('#app')
