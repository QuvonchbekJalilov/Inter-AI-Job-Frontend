<template>
  <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
    <!-- Радар навыков -->
    <div class="bg-white rounded-3xl shadow-md px-6 py-6 space-y-4 border border-slate-100">
      <h3 class="text-lg font-medium flex items-center gap-2">
        🎯 Радар навыков
      </h3>
      <p class="text-sm text-slate-500">
        Визуальная оценка ключевых компетенций
      </p>

      <!-- Radar chart -->
      <div class="flex items-center justify-center py-4">
        <svg viewBox="0 0 200 200" class="w-60">
          <!-- Main thick radar -->
          <polygon
              points="100,20 170,70 145,160 55,160 30,70"
              class="fill-sky-400/40 stroke-sky-500"
              stroke-width="1.5"
          />
          <!-- Inner dashed polygon -->
          <polygon
              points="100,40 155,80 135,145 65,145 45,80"
              class="fill-sky-500/10 stroke-sky-300"
              stroke-dasharray="4 4"
              stroke-width="1"
          />
        </svg>
      </div>

      <div class="bg-blue-50 rounded-2xl px-4 py-3 text-sm text-slate-700">
        💡 <span class="font-medium">Совет:</span>
        Фокус на <span class="font-medium text-sky-700">Testing</span> и
        <span class="font-medium text-sky-700">Architecture</span> для достижения Senior уровня
      </div>
    </div>


    <!-- Детальная оценка -->
    <div class="bg-white rounded-3xl shadow-md px-6 py-6 space-y-4 border border-slate-100">
      <h3 class="text-lg font-medium flex items-center gap-2">
        💻 Детальная оценка навыков
      </h3>
      <p class="text-sm text-slate-500">
        Баллы по 10-балльной шкале
      </p>

      <div class="space-y-3">
        <SkillBar label="Vue.js / Nuxt.js" note="Экспертиза" :score="8.5" />
        <SkillBar label="State Mgmt (Vuex/Pinia)" note="Экспертиза" :score="8" />
        <SkillBar label="TypeScript" note="Продвинутый" :score="7.5" />
        <SkillBar label="GraphQL / REST API" note="Продвинутый" :score="7.5" />
        <SkillBar label="Performance Optimization" note="Продвинутый" :score="7" />
        <SkillBar label="Node.js / Backend" note="Базовый+" :score="6.5" />
        <SkillBar label="Testing (Jest/Cypress)" note="Изучается" :score="5" />
      </div>

      <div class="flex flex-wrap gap-3 pt-3">
        <div class="flex-1 min-w-[130px] bg-emerald-50 rounded-2xl px-4 py-3">
          <p class="text-xs text-emerald-700">Средний балл</p>
          <p class="font-medium text-lg text-emerald-900">7.1 / 10</p>
        </div>
        <div class="flex-1 min-w-[130px] bg-sky-50 rounded-2xl px-4 py-3">
          <p class="text-xs text-sky-700">Прогресс к Senior</p>
          <p class="font-medium text-lg text-sky-900">75%</p>
        </div>
      </div>
    </div>

    <!-- Strengths / Growth zones (full width under them) -->
    <div class="lg:col-span-2">
      <StrengthsGrowth />
    </div>
  </section>
</template>

<script setup>
import StrengthsGrowth from './StrengthsGrowth.vue'
import { computed } from 'vue'
import SkillBar from "@/components/career/SkillBar.vue";

const maxScore = 10

const calcWidth = (score) => `${(score / maxScore) * 100}%`
</script>

<style scoped></style>
