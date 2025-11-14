import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import "vue3-toastify/dist/index.css"
import Vue3Toastify from "vue3-toastify"

const app = createApp(App)
app.use(Vue3Toastify, { autoClose: 4000 })
app.config.globalProperties.$locale = "https://api.inter-ai.uz/api"
app.config.globalProperties.$production = "https://api.inter-ai.uz/api"
app.use(router)
app.mount('#app')
