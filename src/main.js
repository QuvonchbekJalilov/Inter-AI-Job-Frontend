import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import "vue3-toastify/dist/index.css"
import Vue3Toastify from "vue3-toastify"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App)
app.use(Vue3Toastify, { autoClose: 4000 })

app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.config.globalProperties.$locale = "https://api.inter-ai.uz/api"

app.config.globalProperties.$production = "https://api.inter-ai.uz/api"
app.use(router)
app.mount('#app')
