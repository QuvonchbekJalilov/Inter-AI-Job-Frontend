<template>
  <div class="min-h-screen bg-[#f2f2f2]">
    <Header :user="user" />
    <div class="min-h-screen pt-[90px] bg-[#f7f8fa] py-2 mt-3">
      <div class="max-w-3xl mx-auto space-y-6">

        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <div class="flex items-stretch w-full max-w-md mx-auto gap-2 mb-6">
            <button
                v-for="tab in tabs"
                :key="tab.code"
                @click="changeTab(tab.code)"
                class="tab-btn min-w-0 basis-0 px-3 sm:px-4 rounded-xl transform transition-colors whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-center gap-1"
                :class="isActive(tab.code) ? activeClass : inactiveClass"
                :style="{ flexGrow: isActive(tab.code) ? 2 : 1 }"
            >
            <span
                class="tab-label inline-block leading-tight px-0.5 sm:px-1"
                :class="isActive(tab.code) ? activeTextClass : inactiveTextClass"
            >
              {{ tab.name }}
            </span>
            </button>
          </div>
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
            <span>👤</span> {{ translations.profiles?.title }}
          </h2>

          <div class="space-y-2 text-sm text-gray-700">
            <div>
              <span class="font-medium text-gray-500">{{ translations.profiles?.name }}:</span>
              {{ user?.first_name }} {{ user?.last_name }}
            </div>

            <div>
              <span class="font-medium text-gray-500">{{ translations.profiles?.email }}:</span>
              {{ user?.email }}
            </div>

            <div>
              <span class="font-medium text-gray-500">{{ translations.profiles?.phone }}:</span>
              {{ user?.phone }}
            </div>

            <div>
              <span class="font-medium text-gray-500">{{ translations.profiles?.industry }}:</span>
              {{ user?.preferences?.[0]?.industry?.name || '—' }}
            </div>

            <div>
              <span class="font-medium text-gray-500">{{ translations.profiles?.location }}:</span>
              {{ user?.locations?.[0]?.text || '—' }}
            </div>

            <div>
              <span class="font-medium text-gray-500">{{ translations.profiles?.salary }}:</span>
              {{ translations.profiles?.salary_from }} {{ user?.preferences?.[0]?.desired_salary_from || 0 }} ₽
              {{ translations.profiles?.salary_to }} {{ user?.preferences?.[0]?.desired_salary_to || 0 }} ₽
            </div>
          </div>
          <button
              class="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              @click="goToEdit"
          >
            Редактировать
          </button>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
            <span>📄</span> {{ translations.resumes?.title }}
          </h2>
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">
              {{ translations.resumes?.last_update }} <br />
              <span class="text-gray-700">3 {{ translations.resumes?.days_ago }}</span>
            </div>
            <span class="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs">{{ translations.resumes?.status_active }}</span>
          </div>
          <button
              class="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            {{ translations.resumes?.update_btn }}
          </button>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 class="text-lg font-semibold mb-2 flex items-center gap-2 text-black">
            ⚡ {{ translations.auto_apply?.title }}
          </h2>
          <p class="text-sm text-gray-600 mb-3">
            {{ translations.auto_apply?.description }}
          </p>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" />
            <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600
              after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"
            ></div>
          </label>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
            💳 {{ translations.plan?.title }}
          </h2>
          <div class="mb-3 text-sm text-gray-600 flex justify-between">
            <span>{{ translations.plan?.free_responses }}</span>
            <span class="text-green-600 font-medium">73/100</span>
          </div>
          <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div class="h-2 w-[73%] bg-blue-500"></div>
          </div>
          <p class="text-sm text-gray-500 mb-1">73 {{ translations.plan?.left_responses }}</p>
<!--          <p class="text-sm text-gray-700">-->
<!--            Дополнительные отклики: <span class="font-semibold">100,000 UZS</span> (100 откликов)-->
<!--          </p>-->
          <p class="text-sm text-gray-700">
            {{ translations.plan?.extra_responses, { price: '100,000 UZS', count: 74 } }}
          </p>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl px-6">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
            💰 {{ translations.payment?.title }}
          </h2>
          <div class="text-start text-sm text-gray-500 mb-4">
            {{ translations.payment?.no_methods }}
          </div>
          <div class="space-y-3">
            <button
                class="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              {{ translations.payment?.add_card }}
            </button>
            <button
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              {{ translations.payment?.buy_responses }}
            </button>
            <button
                class="mt-2 w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50"
                @click="logout"
            >
              {{ translations.payment?.logout }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import axios from 'axios'
import { useI18n } from '@/i18n-lite'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
const { translations } = useI18n()

const router = useRouter()
const { locale } = useI18n()

const user = ref(null)
const loading = ref(true)
const error = ref("")

// API dan user olish
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


const tabs = [
  { code: 'uz', name: 'Uzbek' },
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
]

const changeTab = (code) => {
  locale.value = code
}

const isActive = (code) => locale.value === code

const activeClass = 'bg-blue-600 text-white scale-100 py-2.5'
const inactiveClass = 'bg-gray-100 text-gray-700 hover:bg-gray-200 scale-95 py-2'
const activeTextClass = 'text-[13.5px] sm:text-[14px] scale-100'
const inactiveTextClass = 'text-[11.5px] sm:text-[12px] scale-90'

const logout = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (token) {
      await axios.post("http://127.0.0.1:8000/api/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
  } catch (e) {
    console.error("Logout error", e)
  } finally {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("expires_at")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("expires_at")

    router.push({ name: "login" })
  }
}
const goToEdit = () => {
  router.push({ name: "editProfile", params: { id: user.value.id } })
}
</script>


