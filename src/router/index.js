import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'

import Page from '../app/Page.vue'
import Login from '../app/auth/Login.vue'
import Register from '../app/auth/Register.vue'
import Profile from '../app/Profile.vue'
import VacancyShow from '../app/VacancyShow.vue'
import EditProfile from "@/app/EditProfile.vue";
import InterviewShow from '../app/InterviewShow.vue'
import DemoVacancy from '../app/demo/DemoVacancy.vue'
import DemoRegister from "@/app/demo/DemoRegister.vue"
import VacancyTelegramShow from '../app/VacancyTelegramShow.vue'


const routes = [
    {
        path: '/',
        name: 'home',
        component: Page,
        meta: { requiresAuth: true }
    },
    {
        path: '/interview/:id',
        name: 'interviewDetail',
        component: InterviewShow,
        props: true,
        meta: { requiresAuth: true, headerBack: true }
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
        path: '/v1/telegram/vacancies/:id',
        name: 'vacancyTelegramDetail',
        component: VacancyTelegramShow,
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
        path: '/demo-register',
        name: 'demoRegister',
        component: DemoRegister,
    },
    {
        path: '/demo-vacancy',
        name: 'demoVacancy',
        component: DemoVacancy,
    },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }

        if (from.name === "home" && to.name === "vacancy-show") {
            sessionStorage.setItem("vacancy_scroll", window.scrollY);
        }

        if (from.name === "vacancy-show" && to.name === "home") {
            const scroll = sessionStorage.getItem("vacancy_scroll");
            if (scroll) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve({ left: 0, top: parseInt(scroll) });
                    }, 300);
                });
            }
        }

        return { top: 0 };
    },
});
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (to.meta.requiresAuth && !token) {
        next({ name: "register" });
    } else if (to.meta.guest && token) {
        next({ name: "home" });
    } else {
        next();
    }
});

export default router
