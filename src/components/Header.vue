<template>
  <header class="fixed top-0 left-0 w-full z-20 bg-white text-black px-4 py-3 shadow-md">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-8">
        <div class="text-white px-2 mt-5 rounded font-bold text-lg">
          <a href="/">
            <img src="https://www.inter-ai.uz/Logo1.svg" alt="Inter-AI" class="h-8 mx-auto mb-4">
          </a>
        </div>
        <nav class="hidden md:flex items-center space-x-6">
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600"></label>
            <select v-model="locale" class="border rounded px-2 py-1 text-sm">
              <option value="uz">UZ</option>
              <option value="ru">RU</option>
              <option value="en">EN</option>
            </select>
          </div>
        </nav>
      </div>
      <div class="flex items-center space-x-4">
        <!-- User Link -->
        <a href="/profile" class="flex items-center space-x-2 hover:text-gray-500">
          <!-- User Icon -->
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5.121 17.804A9.966 9.966 0 0112 15c2.21 0 4.236.72 5.879 1.926M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span>{{ translations.profile }}</span>
        </a>
      </div>
    </div>
  </header>

</template>

<script setup>
import { useI18n } from '@/i18n-lite'
const { translations, locale, t } = useI18n()
</script>


<style scoped>

</style>
