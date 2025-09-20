<template>
  <div class="min-h-screen bg-[#f2f2f2]">
    <Header />
    <div class="max-w-5xl pt-[110px] mx-auto p-6 bg-white rounded-2xl shadow space-y-6">
      <div>
        <h1 class="text-2xl font-bold mb-2">{{ vacancy.title }}</h1>
        <p class="text-gray-700 font-semibold">{{ vacancy.employer?.name }}</p>
        <p class="text-gray-500">
          {{ vacancy.area?.name }}
        </p>
      </div>

      <div v-if="vacancy.salary_from || vacancy.salary_to" class="p-4 bg-gray-50 rounded-lg">
        <p class="text-lg font-semibold text-green-700">
          {{ formatSalary(vacancy.salary_from, vacancy.salary_to, vacancy.salary_currency, vacancy.salary_gross) }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 border rounded-lg">
          <p class="text-sm text-gray-500">{{translations.Schedule}}</p>
          <p class="font-medium">{{ vacancy.schedule?.name }}</p>
        </div>
        <div class="p-4 border rounded-lg">
          <p class="text-sm text-gray-500">{{translations.Type_of_employment}}</p>
          <p class="font-medium">{{ vacancy.employment?.name }}</p>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-2">{{translations.Job_Description}}</h2>
        <p class="text-gray-600 whitespace-pre-line">
          {{ vacancy.description }}
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 text-center gap-4">
        <div class="p-3 bg-gray-50 rounded-lg text-center">
          <p class="text-sm text-gray-500">{{translations.Views}}</p>
          <p class="font-bold">{{ vacancy.views_count }}</p>
        </div>
        <div class="p-3 bg-gray-50 rounded-lg text-center">
          <p class="text-sm text-gray-500">{{translations.applies}}</p>
          <p class="font-bold">{{ vacancy.responses_count }}</p>
        </div>
      </div>
      <div class="bg-gray-50 rounded-lg text-center">
        <p class="text-sm text-gray-500">{{ translations.Published }}</p>
        <p class="font-bold">{{ formatDate(vacancy.published_at) }}</p>
      </div>

      <div>
        <a
            :href="vacancy.apply_url"
            target="_blank"
            rel="noopener noreferrer"
            class="block w-full bg-blue-600 py-3 rounded-lg text-white font-bold text-center"
        >
          {{translations.reply}}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRoute } from "vue-router"
import Header from "@/components/Header.vue"
import { useI18n } from '@/i18n-lite'
const { translations, locale, t } = useI18n()

const route = useRoute()
const vacancyId = route.params.id
const vacancy = ref({
  id: vacancyId,
  title: "Senior Backend Developer (Laravel)",
  description:
      "Мы ищем опытного backend-разработчика для работы над масштабируемыми проектами.\nОбязанности: проектирование API, оптимизация баз данных, интеграция внешних сервисов.",
  salary_from: 2000,
  salary_to: 3500,
  salary_currency: "USD",
  salary_gross: true,
  published_at: "2025-09-10",
  expires_at: "2025-10-01",
  status: "publish",
  apply_url: "https://example.com/apply",
  views_count: 120,
  responses_count: 8,
  employer: {
    name: "Tech Corp LLC",
    url: "https://example.com",
  },
  area: {
    name: "Ташкент, Мирзо-Улугбекский район",
  },
  schedule: {
    name: "Полный день",
  },
  employment: {
    name: "Полная занятость",
  },
})
const formatSalary = (from, to, currency, gross) => {
  let text = ""
  if (from) text += `от ${from}`
  if (to) text += (from ? " до " : "до ") + to
  if (currency) text += ` ${currency}`
  if (gross) text += " (до вычета налогов)"
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
