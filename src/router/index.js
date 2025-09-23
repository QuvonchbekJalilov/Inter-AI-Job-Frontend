import { createRouter, createWebHistory } from 'vue-router'

import Page from '../app/Page.vue'
import Login from '../app/Login.vue'
import Register from '../app/Register.vue'
import Profile from '../app/Profile.vue'
import VacancyShow from '../app/VacancyShow.vue'
import EditProfile from "@/app/EditProfile.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: Page,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { guest: true }
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: { guest: true }
    },
    {
        path: '/profile',
        name: 'profile',
        component: Profile,
        meta: { requiresAuth: true, headerBack: true }
    },
    {
        path: '/vacancy/:id',
        name: 'vacancyDetail',
        component: VacancyShow,
        props: true,
        meta: { requiresAuth: true, headerBack: true }
    },
    {
        path: '/users/:id',
        name: 'editProfile',
        component: EditProfile,
        props: true,
        meta: { requiresAuth: true, headerBack: true }
    },
    {
        path: '/interview/:id',
        name: 'showInterview',
        component: EditProfile,
        props: true,
        meta: { requiresAuth: true, headerBack: true }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (to.meta.requiresAuth && !token) {
        next({ name: "login" });
    } else if (to.meta.guest && token) {
        next({ name: "home" });
    } else {
        next();
    }
});

export default router
