import { createRouter, createWebHistory } from 'vue-router'

// komponentlarni import qilamiz
import Page from '../app/Page.vue'
import Login from '../app/Login.vue'
import Register from '../app/Register.vue'
import Profile from '../app/Profile.vue'
import VacancyDetail from '../app/SingleVacancy.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Page
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/profile',
        name: 'profile',
        component: Profile
    },
    {
        path: "/vacancy/:id",
        name: "vacancyDetail",
        component: VacancyDetail,
        props: true, // id props sifatida keladi
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
