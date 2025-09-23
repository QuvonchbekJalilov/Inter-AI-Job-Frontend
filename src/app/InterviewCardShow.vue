<template>
  <div class="min-h-screen bg-[#f2f2f2]">
    <Header />

    <div class="px-4 sm:px-6 lg:px-8 pt-[110px] md:pt-[120px] pb-6">
      <div class="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow overflow-hidden space-y-6">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-2xl font-medium mb-1">{{ interview.title }}</h3>
          <p class="text-gray-700 font-semibold">{{ interview.company }}</p>
          <div class="mt-2 flex items-center text-gray-600 space-x-2">
            <!-- <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-7H3v7a2 2 0 002 2z"/>
            </svg> -->
            <span>{{ interview.date }}</span>
          </div>
        </div>
        <span class="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">{{ translations.assigned }}</span>
      </div>

      <div>
        <h2 class="text-xl font-medium mb-2">Возможные вопросы от AI:</h2>
        <ul class="list-decimal list-inside space-y-2 text-gray-700">
          <li v-for="(q, i) in interview.questions" :key="i">{{ q }}</li>
        </ul>
      </div>

      <div class="pt-2">
        <button class="w-full bg-blue-600 py-3 rounded-lg text-white font-medium">
          {{ translations.prepare_for_the_interview }}
        </button>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import { useI18n } from '@/i18n-lite'

const { translations } = useI18n()
const route = useRoute()
const interviewId = route.params.id

// Static mock data for now; will be replaced by backend later
const interview = ref({
  id: interviewId,
  title: 'Frontend разработчик',
  company: 'TechStart',
  date: '15 декабря 2024 в 14:00',
  questions: [
    'Расскажите о своем опыте работы с React',
    'Как вы оптимизируете производительность веб-приложений?',
    'Опыт работы с TypeScript?',
    'Как вы тестируете свой код?',
        'Расскажите о своем опыте работы с React',
    'Как вы оптимизируете производительность веб-приложений?',
    'Опыт работы с TypeScript?',
    'Как вы тестируете свой код?',
        'Расскажите о своем опыте работы с React',
    'Как вы оптимизируете производительность веб-приложений?',
    'Опыт работы с TypeScript?',
    'Как вы тестируете свой код?',
        'Расскажите о своем опыте работы с React',
    'Как вы оптимизируете производительность веб-приложений?',
    'Опыт работы с TypeScript?',
    'Как вы тестируете свой код?',
        'Расскажите о своем опыте работы с React',
    'Как вы оптимизируете производительность веб-приложений?',
    'Опыт работы с TypeScript?',
    'Как вы тестируете свой код?'
  ]
})
</script>

<style scoped>
</style>
