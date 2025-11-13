<template>
  <section class="p-5 sm:p-8 bg-white rounded-3xl shadow-md border border-slate-200">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <h2 class="text-gray-900 mb-1 sm:mb-2 text-lg sm:text-2xl">
        🗺️ Дорожная карта на 12 месяцев
      </h2>
      <p class="text-gray-600 text-xs sm:text-sm">
        Пошаговый план достижения Senior/Lead позиции
      </p>
    </div>

    <!-- Phases Grid -->
    <div class="grid md:grid-cols-2 gap-4 sm:gap-6">
      <div
          v-for="(phase, index) in roadmap"
          :key="index"
          :class="[
          'rounded-xl p-4 sm:p-6 transition-all hover:shadow-lg bg-gradient-to-br border-2',
          phase.bgColor,
          phase.status === 'next'
            ? 'border-blue-300 shadow-blue-200'
            : 'border-gray-200'
        ]"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <span
              :class="[
              'px-2 py-1 rounded-md text-white text-xs sm:text-sm bg-gradient-to-r',
              phase.color
            ]"
          >
            {{ phase.period }}
          </span>

          <div v-if="phase.status === 'next'" class="flex items-center gap-1.5 sm:gap-2 text-blue-600 text-xs sm:text-sm">
            <Clock class="w-4 h-4" />
            <span class="hidden sm:inline">Следующий этап</span>
            <span class="sm:hidden">Сейчас</span>
          </div>

          <Circle v-else class="w-4 h-4 text-gray-400" />
        </div>

        <!-- Title -->
        <h3 class="text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base font-medium">
          {{ phase.title }}
        </h3>

        <!-- Goals -->
        <div class="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
          <div
              v-for="(goal, g) in phase.goals"
              :key="g"
              class="flex items-start gap-1.5 sm:gap-2"
          >
            <CheckCircle2 class="w-4 h-4 text-gray-400 mt-0.5" />
            <p class="text-gray-700 text-xs sm:text-sm">{{ goal }}</p>
          </div>
        </div>

        <!-- Outcome -->
        <div class="pt-3 sm:pt-4 border-t border-gray-300">
          <p class="text-xs sm:text-sm text-gray-600 mb-0.5">📈 Результат:</p>
          <p class="text-gray-900 text-xs sm:text-sm">{{ phase.outcome }}</p>
        </div>
      </div>
    </div>

    <!-- Growth Forecast -->
    <div class="mt-6 sm:mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-4 sm:p-6">
      <div class="flex items-center gap-2 sm:gap-3 mb-3">
        <div class="bg-white/20 p-2 rounded-lg flex-shrink-0">
          <ArrowRight class="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h3 class="text-sm sm:text-base font-medium">Прогноз карьерного роста</h3>
      </div>

      <div class="grid grid-cols-3 gap-3 sm:gap-6">
        <div>
          <p class="text-indigo-100 text-xs mb-1">Текущая позиция</p>
          <p class="text-white text-base sm:text-xl font-medium">Middle+</p>
        </div>
        <div>
          <p class="text-indigo-100 text-xs mb-1">Через 12 мес</p>
          <p class="text-white text-base sm:text-xl font-medium">Senior/Lead</p>
        </div>
        <div>
          <p class="text-indigo-100 text-xs mb-1">Вероятность</p>
          <p class="text-white text-base sm:text-xl font-medium">85%</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Clock, ArrowRight, Circle, CheckCircle2 } from "lucide-vue-next";

const roadmap = [
  {
    period: "Месяцы 1-3",
    title: "Архитектура и качество",
    status: "next",
    goals: [
      "Vue 3 Composition API patterns (Scoped slots, Composables)",
      "Применить SOLID и DRY принципы во фронтенде",
      "Начать писать unit-тесты (Jest) и e2e (Cypress)",
      "Изучить архитектуру Nuxt 3 SSR + API routes"
    ],
    outcome: "Системное мышление и чистый архитектурный подход",
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100"
  },
  {
    period: "Месяцы 4-6",
    title: "Техническое лидерство",
    status: "pending",
    goals: [
      "Настроить CI/CD pipeline (GitHub Actions)",
      "Создать frontend architecture guide для команды",
      "Провести внутренние воркшопы по Code quality и Vue performance",
      "Начать pet-проект с open-source архитектурой"
    ],
    outcome: "Лидерский статус в команде и осознанная архитектура",
    color: "from-green-500 to-green-600",
    bgColor: "from-green-50 to-green-100"
  },
  {
    period: "Месяцы 7-9",
    title: "Fullstack гибкость и DevOps",
    status: "pending",
    goals: [
      "Изучить Docker, Nginx, basic AWS (S3, EC2)",
      "Реализовать pet-проект: Vue + Node.js + Prisma + PostgreSQL",
      "Добавить GraphQL caching и SSR оптимизацию",
      "Практика deployment и monitoring"
    ],
    outcome: "Готовность к ролям Lead Frontend и Fullstack Architect",
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100"
  },
  {
    period: "Месяцы 10-12",
    title: "Senior / Lead позиционирование",
    status: "pending",
    goals: [
      "Создать портфолио на GitHub/LinkedIn (3 топовых проекта)",
      "Написать статьи: Vue3 Enterprise Architecture, Optimizing Nuxt Apps",
      "Подготовиться к AI-интервью уровня Senior",
      "Повышение английского до C1"
    ],
    outcome: "Готовность к руководящей позиции и международным проектам",
    color: "from-orange-500 to-orange-600",
    bgColor: "from-orange-50 to-orange-100"
  }
];
</script>
