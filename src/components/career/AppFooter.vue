<template>
  <footer class="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-12 sm:mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      <!-- GRID -->
      <div class="grid md:grid-cols-3 gap-6 sm:gap-8 mb-8">

        <!-- LOGO + DESCRIPTION -->
        <div>
          <img
              src="@/assets/Logo.svg"
              alt="inter-AI"
              class="h-7 sm:h-8 mb-4 brightness-0 invert"
          />

          <p class="text-gray-400 text-xs sm:text-sm mb-4">
            Платформа для карьерного развития IT-специалистов с AI
          </p>

          <div class="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
            <Mail class="h-4 w-4 flex-shrink-0" />
            <span>support@inter-ai.com</span>
          </div>
        </div>

        <!-- AI RECOMMENDATIONS -->
        <div>
          <h3 class="text-white mb-4 text-sm sm:text-base">Рекомендации AI</h3>

          <ul class="space-y-2 text-xs sm:text-sm text-gray-400">
            <li class="flex items-start gap-2">
              <span class="text-blue-400">→</span>
              <span>Фокус на Architecture & Testing</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-400">→</span>
              <span>Design patterns во Vue/Nuxt</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-400">→</span>
              <span>CI/CD и Docker окружение</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-400">→</span>
              <span>Навык code review</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-400">→</span>
              <span>Английский до C1</span>
            </li>
          </ul>
        </div>

        <!-- NEXT STEPS -->
        <div>
          <h3 class="text-white mb-4 text-sm sm:text-base">Следующие шаги</h3>

          <div class="space-y-3">
            <a
                href="#"
                class="flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ExternalLink class="h-4 w-4 flex-shrink-0" />
              <span>Консультация</span>
            </a>

            <a
                href="#"
                class="flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ExternalLink class="h-4 w-4 flex-shrink-0" />
              <span>AI-интервью</span>
            </a>

            <a
                href="#"
                class="flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ExternalLink class="h-4 w-4 flex-shrink-0" />
              <span>Карьерный план</span>
            </a>

            <a
                href="#"
                class="flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ExternalLink class="h-4 w-4 flex-shrink-0" />
              <span>Скачать PDF</span>
            </a>
          </div>
        </div>

      </div>

      <!-- BOTTOM AREA -->
      <div class="pt-6 sm:pt-8 border-t border-gray-700">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          <!-- DATE -->
          <div class="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
            <Calendar class="h-4 w-4 flex-shrink-0" />
            <span>Отчёт: 11 ноября 2025</span>
          </div>

          <!-- STATS -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-5">

            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-gray-400 text-xs sm:text-sm">Потенциал: 9.5/10</span>
            </div>

            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span class="text-gray-400 text-xs sm:text-sm">До Senior: 9–12 мес</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup>
import { Mail, ExternalLink, Calendar } from "lucide-vue-next";
</script>
