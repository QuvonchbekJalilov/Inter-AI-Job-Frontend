<template>
  <div class="min-h-screen bg-[#f2f2f2]">
    <Header />
    <div
        v-if="vacancy"
        class="max-w-5xl pt-[110px] mx-auto p-6 bg-white rounded-2xl shadow space-y-6"
    >
      <div>
        <h3 class="text-2xl font-medium mb-2">{{ vacancy.name }}</h3>
        <p class="text-gray-700 font-medium">{{ vacancy.employer?.name }}</p>
        <p class="text-gray-500">{{ vacancy.area?.name }}</p>
      </div>

      <div v-if="vacancy.salary" class="p-4 bg-gray-50 rounded-lg">
        <p class="text-lg font-medium text-green-700">
          {{ formatSalary(vacancy.salary) }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 border rounded-lg">
          <p class="text-sm text-gray-500">{{ translations.Schedule }}</p>
          <p class="font-medium">{{ vacancy.schedule?.name }}</p>
        </div>
        <div class="p-4 border rounded-lg">
          <p class="text-sm text-gray-500">{{ translations.Type_of_employment }}</p>
          <p class="font-medium">{{ vacancy.employment?.name }}</p>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-medium mb-2">{{ translations.Job_Description }}</h2>
        <div class="text-gray-600 prose max-w-none" v-html="vacancy.description"></div>
      </div>

      <div class="bg-gray-50 rounded-lg text-center">
        <p class="text-sm text-gray-500">{{ translations.Published }}</p>
        <p class="font-medium">{{ formatDate(vacancy.published_at) }}</p>
      </div>

      <div>
        <button
            v-if="vacancy"
            :disabled="status"
            @click="applyToVacancy(vacancy.id)"
            class="block w-full py-3 rounded-lg text-white font-medium text-center"
            :class="status
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700'"
        >
          {{ translations.reply }}
        </button>
      </div>
    </div>
  </div>
  <LoadingModal :show="showLoading" />
</template>

<script setup>
import {ref, onMounted, getCurrentInstance} from "vue"
import { useRoute } from "vue-router"
import Header from "@/components/Header.vue"
import { useI18n } from "@/i18n-lite"
import LoadingModal from "@/components/modal/LodaingModal.vue";
const { proxy } = getCurrentInstance()

const { translations } = useI18n()
const route = useRoute()
const vacancyId = route.params.id
const vacancy = ref(null)
const status = ref(null)
const showLoading = ref(false);

const applyToVacancy = async (vacancyId) => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    const res = await fetch(
        proxy.$locale + `/v1/hh/vacancies/${vacancyId}/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({}) // bo'sh body
        }
    )

    if (!res.ok) throw new Error(`HTTP error! ${res.status}`)

    const data = await res.json()
    console.log("✅ Apply javobi:", data)

    if (data.success) {
      status.value = true
      vacancy.value.status = true
      alert("Muvaffaqiyatli yuborildi ✅")
    }

  } catch (e) {
    console.error("❌ Apply error:", e.message)
    alert("Xatolik: " + e.message)
  }
}

const fetchVacancy = async () => {
  try {
    showLoading.value = true
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    const res = await fetch(
        proxy.$locale + `/v1/hh/vacancies/${vacancyId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
    )

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()
    vacancy.value = data.data.raw
    status.value = data.data.status
    console.log("✅ Vacancy:", data.data)
  } catch (e) {
    showLoading.value = false
    console.error("❌ API error:", e.message)
  } finally {
    showLoading.value = false
  }
}


onMounted(fetchVacancy)

const formatSalary = (salary) => {
  if (!salary) return "-"
  let text = ""
  if (salary.from) text += `от ${salary.from}`
  if (salary.to) text += (salary.from ? " до " : "до ") + salary.to
  if (salary.currency) text += ` ${salary.currency}`
  if (salary.gross === false) text += " (на руки)"
  else if (salary.gross === true) text += " (до вычета налогов)"
  return text
}

const formatDate = (dateStr) => {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
</script>
