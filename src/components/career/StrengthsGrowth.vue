<template>
  <section class="grid lg:grid-cols-2 gap-6 sm:gap-8">

    <!-- Сильные стороны -->
    <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-md space-y-6">

      <!-- Header -->
      <div class="flex items-center gap-3">
        <div class="bg-green-500 p-2 rounded-lg">
          <Star class="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 class="text-lg sm:text-2xl text-gray-900">💪 Сильные стороны</h2>
          <p class="text-sm text-gray-600">Ваши конкурентные преимущества</p>
        </div>
      </div>

      <!-- Items -->
      <div class="space-y-4">
        <StrengthItem
            v-for="(s, i) in strengths"
            :key="i"
            :title="s.title"
            :description="s.description"
            :impact="s.impact"
        />
      </div>

      <!-- Summary box -->
      <div class="mt-4 sm:mt-6 p-4 sm:p-5 bg-green-600 rounded-xl text-white shadow-lg">
        <div class="flex items-center gap-2 mb-1">
          <TrendingUp class="w-5 h-5" />
          <span class="text-sm opacity-90">Общая оценка</span>
        </div>
        <h3 class="text-xl sm:text-2xl font-medium">Сильный Middle+ профиль</h3>
        <p class="text-sm opacity-90">Готовность к ответственным задачам</p>
      </div>
    </div>

    <!-- Зоны роста -->
    <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 shadow-md space-y-6">

      <!-- Header -->
      <div class="flex items-center gap-3">
        <div class="bg-orange-500 p-2 rounded-lg">
          <AlertCircle class="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 class="text-lg sm:text-2xl text-gray-900">🎯 Зоны роста</h2>
          <p class="text-sm text-gray-600">Фокус для достижения Senior уровня</p>
        </div>
      </div>

      <!-- Items -->
      <div class="space-y-4">
        <GrowthItem
            v-for="(g, i) in weaknesses"
            :key="i"
            :title="g.title"
            :description="g.description"
            :priority="g.priority"
            :time="g.time"
        />
      </div>

      <!-- Summary -->
      <div class="mt-4 sm:mt-6 p-4 sm:p-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow-lg">
        <div class="flex items-center gap-2 mb-1">
          <Target class="w-5 h-5" />
          <span class="text-sm opacity-90">План действий</span>
        </div>
        <h3 class="text-xl sm:text-2xl font-medium">12 месяцев до Senior</h3>
        <p class="text-sm opacity-90">Фокус на архитектуре, тестах и DevOps</p>
      </div>

    </div>

  </section>
</template>

<script setup>
import { Star, AlertCircle, TrendingUp, Target, CheckCircle2 } from "lucide-vue-next";
import StrengthItem from "./StrengthCard.vue";
import GrowthItem from "./GrowthCard.vue";

const strengths = [
  { title: "Опыт управления командой", description: "Руководство фронтенд-командой в Zakiy IT Company", impact: "high" },
  { title: "30+ проектов в продакшн", description: "Богатый опыт работы с реальными B2B-приложениями", impact: "high" },
  { title: "Компонентная архитектура Vue", description: "Глубокое понимание Vue.js экосистемы и best practices", impact: "high" },
  { title: "Full-stack понимание", description: "Vue + Node.js + Prisma + PostgreSQL опыт", impact: "medium" },
  { title: "Multilingual", description: "Узбекский (родной), English B2, Русский A2", impact: "medium" },
];

const weaknesses = [
  { title: "Архитектура и Design Patterns", description: "Нужно углубить знания SOLID, DRY и паттернов", priority: "high", time: "1–3 мес" },
  { title: "Тестирование", description: "Unit-тесты (Jest) и E2E (Cypress) требуют практики", priority: "high", time: "1–3 мес" },
  { title: "CI/CD и DevOps", description: "Docker, GitHub Actions, deployment процессы", priority: "medium", time: "4–6 мес" },
];
</script>
