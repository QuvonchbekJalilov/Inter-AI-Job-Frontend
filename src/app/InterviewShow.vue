<template>
  <div class="min-h-screen bg-[#f2f2f2]">
    <Header />

    <div class="pt-[110px] md:pt-[120px] pb-6">
      <div class="bg-white px-3 shadow overflow-hidden space-y-6">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-2xl font-medium mb-1">{{ interview.title }}</h3>
            <p class="text-gray-700 font-semibold">{{ interview.company }}</p>
            <div class="mt-2 flex items-center text-gray-600 space-x-2">
              <span>{{ interview.date }}</span>
            </div>
          </div>
          <span class="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
            {{ translations.assigned }}
          </span>
        </div>

        <div>
          <h2 class="text-xl font-medium mb-2">
            {{ translations.possible_ai_questions }}
          </h2>
          <ul class="list-decimal list-inside space-y-2 text-gray-700">
            <li v-for="(q, i) in interview.questions" :key="i">{{ q }}</li>
          </ul>
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
    console.log('✅ Interview:', data)

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
