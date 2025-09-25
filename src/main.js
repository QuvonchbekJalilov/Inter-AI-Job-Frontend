import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
app.config.globalProperties.$locale = "http://127.0.0.1:8000/api"
app.config.globalProperties.$production = "https://inter-ai.uz/api"
app.use(router)
app.mount('#app')
