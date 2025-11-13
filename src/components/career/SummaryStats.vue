<template>
    <div class="mx-auto space-y-8">

      <!-- Header -->
      <div>
        <h2 class="text-gray-900 text-xl sm:text-2xl mb-1 flex items-center gap-2">
          📊 Общая статистика профиля
        </h2>
        <p class="text-gray-600 text-sm sm:text-base">
          Ключевые показатели вашего карьерного развития
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">

        <div
            v-for="(item, index) in stats"
            :key="index"
            class="rounded-xl border-0 shadow-sm hover:shadow-lg transition-all hover:scale-105 p-4 sm:p-6 flex items-start gap-4"
            :class="item.bgColor"
        >
          <!-- Icon gradient -->
          <div
              class="p-3 rounded-xl text-white flex-shrink-0 bg-gradient-to-br"
              :class="item.color"
          >
            <component :is="item.icon" class="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <!-- Texts -->
          <div class="flex-1 min-w-0">
            <p class="text-gray-500 text-xs sm:text-sm mb-1">{{ item.label }}</p>
            <p class="text-gray-900 font-medium text-sm sm:text-base truncate">{{ item.value }}</p>
            <p class="text-gray-600 text-xs mt-1">{{ item.subtext }}</p>
          </div>
        </div>

      </div>

    </div>
</template>

<script setup>
/* ICONS — lucide-vue-next */
import { TrendingUp, Target, Award, Briefcase, Code, Users, Zap, Trophy } from "lucide-vue-next";

const stats = [
  {
    icon: TrendingUp,
    label: "Текущий уровень",
    value: "Middle+",
    subtext: "Pre-Senior позиция",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Target,
    label: "Целевая зарплата",
    value: "$2,500-3,000",
    subtext: "Через 9-12 месяцев",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Award,
    label: "Soft Skills",
    value: "8.0 / 10",
    subtext: "Лидерство + коммуникация",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Briefcase,
    label: "Компаний",
    value: "5+",
    subtext: "Asialuxe, Zakiy IT и др.",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: Code,
    label: "Основной стек",
    value: "Vue.js",
    subtext: "Nuxt.js, TypeScript, Pinia",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: Users,
    label: "Team Lead опыт",
    value: "Есть",
    subtext: "Управление фронтенд-командой",
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    icon: Zap,
    label: "Образование",
    value: "TUIT",
    subtext: "Software Engineering",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    icon: Trophy,
    label: "Цель",
    value: "Senior/Lead",
    subtext: "Frontend Architect",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50",
  },
];
</script>

<style scoped>
/* TSX card feel */
</style>
