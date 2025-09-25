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
        <p class="text-lg font-semibold text-green-700">
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
        <p class="font-bold">{{ formatDate(vacancy.published_at) }}</p>
      </div>

      <div>
        <a
            :href="vacancy.apply_alternate_url"
            target="_blank"
            rel="noopener noreferrer"
            class="block w-full bg-blue-600 py-3 rounded-lg text-white font-medium text-center"
        >
          {{ translations.reply }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import Header from "@/components/Header.vue"
import { useI18n } from "@/i18n-lite"

const { translations } = useI18n()
const route = useRoute()
const vacancyId = route.params.id
const vacancy = ref(null)

const fetchVacancy = async () => {
  try {
    const res = await fetch(`https://api.hh.ru/vacancies/${vacancyId}`)
    const data = await res.json()
    vacancy.value = data
  } catch (e) {
    console.error("API error:", e)
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
