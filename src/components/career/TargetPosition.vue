<template>
  <section class="grid lg:grid-cols-3 gap-6 sm:gap-8">

    <!-- LEFT: Target Position Card -->
    <div class="lg:col-span-2 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-3xl p-5 sm:p-8 shadow-lg">

      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <div class="bg-white/20 p-3 rounded-lg">
          <Target class="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        </div>
        <div>
          <h2 class="text-lg sm:text-2xl font-medium">🎯 Целевая позиция</h2>
          <p class="text-blue-100 text-xs sm:text-sm">Ваша цель через 9–12 месяцев</p>
        </div>
      </div>

      <!-- GRID INFO BOXES -->
      <div class="grid grid-cols-2 gap-4 mb-6">

        <!-- Box 1 -->
        <div class="info-box">
          <Briefcase class="icon" />
          <p class="label">Должность</p>
          <p class="value">Senior Frontend</p>
          <p class="subvalue">или Tech Lead</p>
        </div>

        <!-- Box 2 -->
        <div class="info-box">
          <DollarSign class="icon" />
          <p class="label">Зарплата</p>
          <p class="value">$2.5–3k</p>
          <p class="subvalue">Remote</p>
        </div>

        <!-- Box 3 -->
        <div class="info-box">
          <MapPin class="icon" />
          <p class="label">Формат</p>
          <p class="value">Remote</p>
          <p class="subvalue">International</p>
        </div>

        <!-- Box 4 -->
        <div class="info-box">
          <Users class="icon" />
          <p class="label">Команда</p>
          <p class="value">5–10 чел</p>
          <p class="subvalue">Управление</p>
        </div>

      </div>

      <!-- TECH STACK BLOCK -->
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-5 border border-white/20">
        <div class="flex items-center gap-2 mb-3">
          <Code class="w-5 h-5 text-white" />
          <h3 class="text-sm sm:text-base font-medium">Технический стек</h3>
        </div>

        <div class="flex flex-wrap gap-2">
          <span
              v-for="(tech, i) in techStack"
              :key="i"
              class="px-2 py-1 bg-white/20 text-white rounded-full text-xs"
          >
            {{ tech }}
          </span>
        </div>
      </div>
    </div>

    <!-- RIGHT: Readiness Progress -->
    <div class="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm">

      <div class="mb-6">
        <h3 class="text-gray-900 text-lg sm:text-xl font-medium mb-1">📊 Готовность</h3>
        <p class="text-gray-600 text-xs sm:text-sm">Gap analysis</p>
      </div>

      <!-- Requirements List -->
      <div class="space-y-5">
        <div v-for="req in requirements" :key="req.skill">

          <!-- Label -->
          <div class="flex items-center justify-between mb-1">
            <span class="text-gray-700 text-xs sm:text-sm">{{ req.skill }}</span>
            <span class="text-gray-500 text-xs sm:text-sm">{{ req.current }}%</span>
          </div>

          <!-- DOUBLE-LAYERED PROGRESS BAR -->
          <div class="relative h-2 rounded-full bg-gray-200 overflow-hidden">

            <!-- Target (background) -->
            <div
                class="absolute h-full bg-gray-300 rounded-full"
                :style="{ width: req.target + '%' }"
            ></div>

            <!-- Current (foreground) -->
            <div
                class="absolute h-full bg-blue-500 rounded-full"
                :style="{ width: req.current + '%' }"
            ></div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between mt-1">
            <span class="text-xs text-gray-500">Цель: {{ req.target }}%</span>

            <span
                v-if="req.gap > 0"
                :class="[
                'text-xs font-medium',
                req.gap > 30
                  ? 'text-red-600'
                  : req.gap > 15
                  ? 'text-orange-600'
                  : 'text-green-600'
              ]"
            >
              Gap: {{ req.gap }}%
            </span>
          </div>
        </div>
      </div>

      <!-- SUMMARY BOX -->
      <div class="mt-6 pt-5 border-t border-gray-200">
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">

          <div class="flex items-center gap-2 mb-2">
            <TrendingUp class="w-5 h-5 text-green-600" />
            <span class="text-gray-700 text-sm">Общая готовность</span>
          </div>

          <div class="flex items-end gap-2">
            <p class="text-3xl text-gray-900">75%</p>
            <span class="text-green-600 text-xs mb-1">↗ Растет</span>
          </div>

          <p class="text-xs text-gray-600 mt-2">
            Фокус на Testing и DevOps повысит до 90%+ за 6 мес
          </p>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Target, DollarSign, MapPin, Briefcase, Users, Code, TrendingUp } from "lucide-vue-next";

const techStack = [
  "Vue 3", "Nuxt 3", "TypeScript", "Pinia", "GraphQL",
  "Testing", "Docker", "CI/CD", "AWS", "System Design",
  "Microservices", "Performance"
];

const requirements = [
  { skill: "Vue/Nuxt Architecture", current: 85, target: 95, gap: 10 },
  { skill: "TypeScript Advanced", current: 75, target: 90, gap: 15 },
  { skill: "Testing & QA", current: 50, target: 85, gap: 35 },
  { skill: "CI/CD & DevOps", current: 40, target: 80, gap: 40 },
  { skill: "System Design", current: 60, target: 85, gap: 25 },
  { skill: "Team Leadership", current: 80, target: 90, gap: 10 }
];
</script>

<style scoped>
.info-box {
  @apply bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 text-white;
}
.info-box .icon {
  @apply w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3;
}
.info-box .label {
  @apply text-blue-100 text-xs mb-0.5;
}
.info-box .value {
  @apply text-white text-base sm:text-xl mb-1 font-medium;
}
.info-box .subvalue {
  @apply text-blue-100 text-xs;
}
</style>
