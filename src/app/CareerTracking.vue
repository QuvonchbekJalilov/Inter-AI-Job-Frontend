<template>
  <div class="min-h-screen bg-white text-slate-900 font-inter">

    <!-- Top profile header with stats -->
    <ProfileHeader />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">

      <!-- Summary stats block (middle part: level, salary, soft skills, stack, etc.) -->
      <SummaryStats />

      <!-- Skills: radar + detailed scores + strengths/growth -->
      <SkillsSection />

      <!-- Career timeline -->
      <CareerTimeline />

      <!-- 12 month roadmap -->
      <Roadmap />

      <!-- Target position & gap analysis -->
      <TargetPosition />

      <div class="w-full flex justify-start mt-8">
        <div
            class="w-full bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm"
        >
          <!-- Title -->
          <div class="mb-10">
            <h1 class="
      text-xl          /* 📱 mobile */
      sm:text-3xl       /* small tablets */
      md:text-4xl       /* tablets */
      lg:text-5xl       /* desktops */
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

<!--            <li class="flex items-start gap-2-->
<!--      text-base sm:text-lg md:text-xl text-slate-700">-->
<!--              <span class="text-green-500 mt-0.5">✓</span>-->
<!--              Xalqaro vakansiyalarga topshirish-->
<!--            </li>-->

            <li class="flex items-start gap-2
      text-base sm:text-lg md:text-xl text-slate-700">
              <span class="text-green-500 mt-0.5">✓</span>
              Xalqaro darajadagi mutaxassis darajasiga chiqish
            </li>
          </ul>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <span
                v-for="tag in tags"
                :key="tag"
                class="px-3 py-1 text-xs rounded-full bg-white border border-blue-200 text-blue-700"
            >
              {{ tag }}
            </span>
          </div>
        </div>

      </div>

      <div class="flex justify-center items-center mt-8 mb-4 sm:mb-8">
        <a href="https://forms.gle/BMnz8BiZzned4TyQA" target="_blank"
            class="w-[50%] relative px-6 py-3 rounded-xl font-medium text-center text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg hover:shadow-blue-400/40 transition-all duration-300 overflow-hidden"
        >
          <span class="relative z-10 text-2xl tracking-wide">Yozilish</span>
        </a>
      </div>

    </div>
  </div>
</template>

<script setup>
import ProfileHeader from '@/components/career/ProfileHeader.vue'
import SummaryStats from '@/components/career/SummaryStats.vue'
import SkillsSection from '@/components/career/SkillsSection.vue'
import StrengthsGrowth from '@/components/career/StrengthsGrowth.vue'
import CareerTimeline from '@/components/career/CareerTimeline.vue'
import Roadmap from '@/components/career/Roadmap.vue'
import TargetPosition from '@/components/career/TargetPosition.vue'
import AppFooter from '@/components/career/AppFooter.vue'
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
