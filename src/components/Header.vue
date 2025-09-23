<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-white text-black px-4 py-3 shadow-md">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-8">
        <div class="text-white px-2 mt-5 rounded font-bold text-lg">
          <RouterLink to="/">
            <img src="https://www.inter-ai.uz/Logo1.svg" alt="Inter-AI" class="h-8 mx-auto mb-4" />
          </RouterLink>
        </div>


      </div>

      <div class="flex items-center space-x-4">
        <button
            v-if="showBack"
            @click="goBack"
            class="flex items-center text-blue-600 font-medium hover:underline"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{{ translations.back }}</span>
        </button>

        <RouterLink
            v-else
            to="/profile"
            class="flex items-center space-x-2 hover:text-gray-500"
        >
          <span v-if="user">{{ user?.first_name }}</span>
          <svg class="w-9 h-9" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="500" cy="500" r="396.364" fill="white" stroke="#C6C6C6" stroke-width="7.27273"/>
            <path d="M612.317 162.336C125.918 493.239 560.25 774.264 744.155 527.855C394.377 1306.54 -83.9093 341.001 612.317 162.336Z" fill="#5078FF"/>
            <path d="M630.583 459.366C630.583 514.87 586.313 559.865 531.704 559.865C477.094 559.865 432.825 514.87 432.825 459.366C432.825 403.861 477.094 358.866 531.704 358.866C586.313 358.866 630.583 403.861 630.583 459.366Z" fill="#5078FF"/>
          </svg>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/i18n-lite'
import axios from "axios";

const user = ref(null)
const loading = ref(true)
const error = ref("")

onMounted(async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (!token) {
      router.push({ name: "login" })
      return
    }

    const { data } = await axios.get("http://127.0.0.1:8000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    user.value = data.data
  } catch (e) {
    error.value = "Foydalanuvchi ma’lumotlarini olishda xatolik."
  } finally {
    loading.value = false
  }
})

const { translations } = useI18n()
const route = useRoute()
const router = useRouter()

const showBack = computed(() => route.meta?.headerBack === true)

const goBack = () => {
  if (window.history.length > 2) router.back()
  else router.push('/')
}
</script>
