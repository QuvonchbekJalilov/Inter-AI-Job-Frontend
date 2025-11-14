<template>
  <div class="min-h-screen bg-white text-slate-900 font-inter">
    <!-- Top profile header with stats -->
    <!-- Agar API ma’lumoti bo‘lsa prop bilan beramiz; bo‘lmasa, eski statik holatda ishlaydi -->
    <ProfileHeader :data="careerData" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      <!-- Loading / Error — dizaynni buzmasdan, kichik non-intrusive holatda -->
      <div v-if="loading" class="text-center text-sm text-slate-500">Yuklanmoqda...</div>
      <div v-else-if="error" class="text-center text-sm text-red-600">{{ error }}</div>

      <!-- Summary stats block -->
      <SummaryStats :data="careerData" />

      <!-- Skills: radar + detailed scores + strengths/growth -->
      <SkillsSection :data="careerData" />

      <!-- Career timeline -->
      <CareerTimeline :data="careerData" />

      <!-- 12 month roadmap -->
      <Roadmap :data="careerData" />

      <!-- Target position & gap analysis -->
      <TargetPosition :data="careerData" />

      <div class="w-full flex justify-start mt-8">
        <div class="w-full bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
          <!-- Title -->
          <div class="mb-10">
            <h1 class="
          text-xl
          sm:text-3xl
          md:text-4xl
          lg:text-5xl
          font-semibold text-slate-800 text-center leading-tight
        ">
              O’z karyerangizni va o’sishingizni nazorat qilmoqchimisiz?
            </h1>
          </div>

          <!-- Key points -->
          <ul class="space-y-1.5 mb-4">
            <li class="flex items-start gap-2
          text-base sm:text-lg md:text-xl text-slate-700">
              <span class="text-green-500 mt-0.5">✓</span>
              Kareraviy diagnostika — hozirgi darajangizning aniq aniqlanadi
            </li>

            <li class="flex items-start gap-2
          text-base sm:text-lg md:text-xl text-slate-700">
              <span class="text-green-500 mt-0.5">✓</span>
              Kuchli va zaif tomonlaringiz mezonlar bo‘yicha tahlil qilinadi
            </li>

            <li class="flex items-start gap-2
          text-base sm:text-lg md:text-xl text-slate-700">
              <span class="text-green-500 mt-0.5">✓</span>
              Senior darajaga yetish uchun kerak bo‘lgan yo‘l rejangiz yaratiladi
            </li>
            <li class="flex items-start gap-2
          text-base sm:text-lg md:text-xl text-slate-700">
              <span class="text-green-500 mt-0.5">✓</span>
              Karyera va o'sish to'liq 24/7 nazorat qilinadi
            </li>

            <li class="flex items-start gap-2
          text-base sm:text-lg md:text-xl text-slate-700">
              <span class="text-green-500 mt-0.5">✓</span>
              Xalqaro vakansiyalarga tayyorgarlik
            </li>

            <li class="flex items-start gap-2
          text-base sm:text-lg md:text-xl text-slate-700">
              <span class="text-green-500 mt-0.5">✓</span>
              Mock Suhbatlar o'tkazish
            </li>

            <li class="flex items-start gap-2
          text-base sm:text-lg md:text-xl text-slate-700">
              <span class="text-green-500 mt-0.5">✓</span>
              Xalqaro darajadagi mutaxassis darajasiga chiqish
            </li>
          </ul>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in tags" :key="tag"
              class="px-3 py-1 text-xs rounded-full bg-white border border-blue-200 text-blue-700">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex justify-center items-center mt-8 mb-4 sm:mb-8">
        <a href="https://forms.gle/BMnz8BiZzned4TyQA" target="_blank"
          class="w-[50%] relative px-6 py-3 rounded-xl font-medium text-center text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg hover:shadow-blue-400/40 transition-all duration-300 overflow-hidden">
          <span class="relative z-10 text-2xl tracking-wide">Qatnashish</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
// ... existing code ...
import { onMounted, ref, computed } from 'vue'
import axios from 'axios'
import ProfileHeader from '@/components/career/ProfileHeader.vue'
import SummaryStats from '@/components/career/SummaryStats.vue'
import SkillsSection from '@/components/career/SkillsSection.vue'
import StrengthsGrowth from '@/components/career/StrengthsGrowth.vue'
import CareerTimeline from '@/components/career/CareerTimeline.vue'
import Roadmap from '@/components/career/Roadmap.vue'
import TargetPosition from '@/components/career/TargetPosition.vue'

// API holati
const loading = ref(false)
const error = ref(null)
const apiData = ref(null)

// Token tashqaridan (masalan, route yoki store) kelishi mumkin.
// Agar tokenni prop sifatida berishni xohlasangiz, shu yerda o'zgartiring.
const token = ref(localStorage.getItem('token') || '')

// Backenddan keladigan shakl: { success, career_tracking_info: { json: "..." } }
const parsedJson = computed(() => {
  try {
    const raw = apiData.value?.career_tracking_info?.json
    if (!raw) return null
    // Backend json maydoni satr ko'rinishida keladi — uni parse qilamiz
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
})

// Child komponentlarga uzatish uchun tayyor model (bor joyini to'ldiramiz, qolgan joyi statik qoladi)
const careerData = computed(() => ({
  general: parsedJson.value?.general_profile || null,
  topMetrics: parsedJson.value?.top_metrics || null,
  diagnostics: parsedJson.value?.career_diagnostics || null,
  profileStatistics: parsedJson.value?.profile_statistics || null,
  skillsRadar: parsedJson.value?.skills_radar || null,
  detailedSkills: parsedJson.value?.detailed_skills || null,
  StrenghtsAndGrowth: parsedJson.value?.strengths_and_growth || null,
  careerPath: parsedJson.value?.career_path || null,
  careerPathSummary: parsedJson.value?.career_path_summary || null,
  roadmap: parsedJson.value?.growth_roadmap_12_months || null,
  targetPosition: parsedJson.value?.target_position || null,
  gapAnalysis: parsedJson.value?.gap_analysis || null,
  // growth: parsedJson.value?.career_diagnostics?.growth_zones || null,
  // summary: parsedJson.value?.final_summary || null,
  // contact: parsedJson.value?.contact || null,
  // potential: parsedJson.value?.career_potential || null,
  // companies: parsedJson.value?.general_profile?.companies || null,
}))
onMounted(async () => {
  const queryString = window.location.search || window.location.hash.split('?')[1] || '';
  const params = new URLSearchParams(queryString);
  const token = params.get("token");
  localStorage.setItem("token", token);
})


onMounted(async () => {
  if (!token.value) return
  loading.value = true
  error.value = null
  try {
    const res = await axios.get('https://api.inter-ai.uz/api/v1/track-career/resume', {
      headers: {
        Authorization: `Bearer ${token.value}`,
        Accept: 'application/json',
      },
    })
    apiData.value = res.data?.success ? res.data : null
    console.log(res.data.career_tracking_info)
  } catch (e) {
    error.value = 'Maʼlumotlarni yuklab boʻlmadi'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@keyframes glow {
  0% {
    border-color: rgba(59, 130, 246, 0.2);
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
  }

  50% {
    border-color: rgba(96, 165, 250, 0.9);
    box-shadow: 0 0 14px rgba(96, 165, 250, 0.7);
  }

  100% {
    border-color: rgba(59, 130, 246, 0.2);
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
  }
}

.animate-glow-border {
  animation: glow 2s infinite ease-in-out;
}
</style>
