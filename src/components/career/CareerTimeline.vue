<template>
  <section class="p-6 sm:p-8 bg-white rounded-3xl shadow-md border border-slate-200">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <h2 class="text-gray-900 text-xl sm:text-2xl flex items-center gap-2">
        🚀 Карьерный путь
      </h2>
      <p class="text-gray-600 text-xs sm:text-sm">
        История вашего профессионального развития
      </p>
    </div>

    <!-- Timeline container -->
    <div class="relative">
      <!-- Vertical Line -->
      <div class="absolute left-6 sm:left-10 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-200 rounded-full"></div>

      <div class="space-y-10 sm:space-y-12">
        <div
            v-for="(item, index) in timeline"
            :key="index"
            class="relative pl-14 sm:pl-24"
        >
          <!-- Dot -->
          <div class="absolute left-0 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
            <div
                :class="[
                  'rounded-full flex items-center justify-center shadow-lg',
                  item.current
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-300'
                    : 'bg-gradient-to-br from-blue-400 to-blue-500'
                ]"
                class="w-10 h-10 sm:w-12 sm:h-12"
            >
              <Briefcase class="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <!-- Card -->
          <div
              :class="[
                'rounded-xl p-4 sm:p-6 transition-all hover:shadow-xl',
                item.current
                  ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300'
                  : 'bg-gray-50 border border-gray-200'
              ]"
          >
            <!-- Header -->
            <div class="flex flex-col gap-2 mb-3 sm:mb-4">
              <div>
                <div class="flex items-center flex-wrap gap-2 mb-1">
                  <h3 class="text-gray-900 text-sm sm:text-base font-medium">
                    {{ item.title }}
                  </h3>

                  <span
                      v-if="item.current"
                      class="px-2 py-1 text-xs rounded-md bg-blue-600 text-white"
                  >
                    Текущая
                  </span>
                </div>

                <p class="text-blue-600 text-xs sm:text-sm">
                  {{ item.company }}
                </p>

                <div class="flex items-center flex-wrap gap-3 text-gray-500 text-xs sm:text-sm">
                  <div class="flex items-center gap-1">
                    <Calendar class="w-4 h-4" />
                    <span>{{ item.date }}</span>
                  </div>

                  <span class="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-xs">
                    {{ item.duration }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <p class="text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4">
              {{ item.description }}
            </p>

            <!-- Achievements -->
            <div class="mb-3 sm:mb-4">
              <p class="text-gray-600 text-xs sm:text-sm mb-2">
                Ключевые достижения:
              </p>
              <ul class="space-y-1.5">
                <li
                    v-for="(a, i) in item.achievements"
                    :key="i"
                    class="flex items-start gap-2 text-gray-700 text-xs sm:text-sm"
                >
                  <span class="text-green-500 mt-0.5">✓</span>
                  <span>{{ a }}</span>
                </li>
              </ul>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2">
              <span
                  v-for="(tag, t) in item.tags"
                  :key="t"
                  class="px-2 py-1 rounded-full bg-white border border-gray-300 text-xs"
              >
                {{ tag }}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div
        class="mt-8 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
    >
      <div class="flex items-start gap-3 sm:gap-4">
        <div class="bg-green-600 p-2 sm:p-3 rounded-lg">
          <Briefcase class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>

        <div class="flex-1">
          <h3 class="text-gray-900 mb-3 text-sm sm:text-base font-medium">
            Итого карьерного пути
          </h3>

          <div class="grid grid-cols-3 text-center gap-2 sm:gap-4">
            <div class="text-start">
              <p class="text-xs text-gray-600">Общий опыт</p>
              <p class="font-medium text-sm sm:text-base text-gray-900">
                4г 8мес
              </p>
            </div>
            <div class="text-start">
              <p class="text-xs text-gray-600">Компаний</p>
              <p class="font-medium text-sm sm:text-base text-gray-900">
                5+
              </p>
            </div>
            <div class="text-start">
              <p class="text-xs text-gray-600">Рост</p>
              <p class="font-medium text-sm sm:text-base text-green-700">
                Mid+ → Senior
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Briefcase, Calendar } from "lucide-vue-next";

const timeline = [
  {
    date: "2022 - Настоящее время",
    duration: "2+ года",
    title: "Vue.js Frontend Developer",
    company: "Asialuxe",
    location: "Ташкент",
    description:
        "Разработка крупных B2B-приложений, компонентная архитектура, оптимизация UI. Работа с Vue 3, Nuxt.js, TypeScript.",
    achievements: [
      "Разработка и поддержка 15+ крупных проектов",
      "Оптимизация производительности SPA-приложений",
      "Внедрение TypeScript в legacy проекты",
    ],
    tags: ["Vue.js", "Nuxt.js", "TypeScript", "Tailwind", "GraphQL"],
    current: true,
  },
  {
    date: "2020 - 2022",
    duration: "2 года",
    title: "Full-stack Developer",
    company: "Zakiy IT Company",
    location: "Ташкент",
    description:
        "Vue.js + Node.js разработка, управление фронтенд-командой, разработка CRM и корпоративных панелей.",
    achievements: [
      "Руководство командой из 3–5 разработчиков",
      "Разработка архитектуры фронтенд-приложений",
      "Настройка backend на Node.js + PostgreSQL",
    ],
    tags: ["Vue.js", "Node.js", "Prisma", "PostgreSQL", "Team Lead"],
    current: false,
  },
  {
    date: "2019 - 2020",
    duration: "1 год",
    title: "Frontend Developer",
    company: "Serius Team, BA Tech Academy, UIC Group",
    location: "Ташкент",
    description:
        "Фронтенд-разработка на Vue.js, изучение современного стека, работа с REST API.",
    achievements: [
      "Освоение Vue.js экосистемы",
      "Разработка responsive интерфейсов",
      "Интеграция с REST API",
    ],
    tags: ["Vue.js", "JavaScript", "HTML/CSS", "REST API"],
    current: false,
  },
];
</script>

