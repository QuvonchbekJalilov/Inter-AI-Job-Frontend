<template>
  <div class="min-h-screen bg-[#f2f2f2]">
    <Header />

    <div class="pt-[110px] md:pt-[120px]">
      <div class="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow space-y-6">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-2xl font-medium mb-1">{{ interview.title }}</h3>
            
            <div class="mt-2 flex items-center text-gray-600 space-x-2">
              <span>{{ interview.date }}</span>
            </div>
          </div>
          <!-- <span class="px-3 py-1 text-sm font-normal rounded-full bg-blue-100 text-blue-700">
            {{ translations.assigned }}
          </span> -->
        </div>

        <div>
          <h2 class="text-xl font-medium mb-2">
            {{ translations.possible_ai_questions }}
          </h2>
          <ul class="list-decimal list-inside space-y-2 text-gray-700">
            <li v-for="(q, i) in interview.questions" :key="i">{{ q }}</li>
          </ul>

          <div class="mt-6 flex justify-center">
            <a
              href="https://tashkent.hh.uz/applicant/negotiations"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 8.39 4.39 1 1 0 0 0-1.56 1.22A8 8 0 1 1 12 4a7.93 7.93 0 0 1 5.16 1.88l-2.17.18a1 1 0 1 0 .16 2l4-.34a1 1 0 0 0 .91-.91l.34-4a1 1 0 1 0-2-.17L18.19 5A9.93 9.93 0 0 0 12 2Zm4.52 7.11a1 1 0 0 0-1.41 0L11 13.17l-2.11-2.11a1 1 0 1 0-1.41 1.41l2.82 2.83a1 1 0 0 0 1.41 0l4.81-4.81a1 1 0 0 0 0-1.41Z"/>
            </svg>
            {{ translations.go_to_hh_negotiations }}
            </a>
          </div>
        </div>

        <div class="pt-2">
          <!-- <button class="w-full bg-blue-600 py-3 rounded-lg text-white font-medium">
            {{ translations.prepare_for_the_interview }}
          </button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import { useI18n } from '@/i18n-lite'

const { proxy } = getCurrentInstance()
const { translations } = useI18n()
const route = useRoute()
const interviewId = route.params.id

const interview = ref({
  id: interviewId,
  title: '',
  company: '',
  date: '',
  questions: []
})

const fetchInterview = async () => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')

    const res = await fetch(`${proxy.$locale}/v1/interviews/${interviewId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) throw new Error(`HTTP error! ${res.status}`)

    const data = await res.json()
   // console.log('✅ Interview:', data)

    if (data.success && data.data) {
      const item = data.data
      interview.value = {
        id: item.id,
        title: item.vacancy?.title || 'Без названия',
        company: item.vacancy?.company || '—',
        date: new Date(item.created_at).toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        questions: item.questions || []
      }
    }
  } catch (e) {
    console.error('❌ API error:', e.message)
  }
}

onMounted(fetchInterview)
</script>

<style scoped>
</style>
