<template>
  <div class="bg-white rounded-2xl shadow-md p-6 space-y-4 max-w-3xl mx-auto">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-semibold text-gray-800">{{ title }}</h3>
        <p class="text-blue-600 font-medium">{{ company }}</p>
      </div>
      <span class="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">{{translations.assigned}}</span>
    </div>

    <div class="flex items-center text-gray-600 space-x-2">
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-7H3v7a2 2 0 002 2z"/>
      </svg>
      <span>{{ date }}</span>
    </div>

    <div>
      <h4 class="text-gray-700 font-medium mb-2">Возможные вопросы от AI:</h4>
      <ul class="list-decimal list-inside space-y-1 text-gray-600">
        <li v-for="(q,i) in questions" :key="i">{{ q }}</li>
      </ul>
    </div><main class="basis-3/5 bg-gray-100"></main>

    <button class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl">
      {{translations.prepare_for_the_interview}}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from '@/i18n-lite'
const { translations, locale, t } = useI18n()
defineProps({
  title: String,
  company: String,
  date: String,
  questions: Array
})
</script>
