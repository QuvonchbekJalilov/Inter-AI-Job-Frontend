<template>
  <div class="fixed top-[84px] left-0 w-full bg-white border-b border-gray-200 z-20 rounded-2xl">
    <div class="max-w-7xl mx-auto px-4 py-2 border-radius">
      <div class="max-w-3xl mx-auto">
        <!-- Stats -->
        <div class="bg-white rounded-2xl py-4 flex justify-around shadow-top divide-x">
          <div class="flex-1 text-center px-2">
            <div class="text-blue-600 text-2xl font-bold">24</div>
            <div class="text-sm text-gray-500">{{translations.responses}}</div>
          </div>
          <div class="flex-1 text-center px-2">
            <div class="text-green-600 text-2xl font-bold">8</div>
            <div class="text-sm text-gray-500">{{translations.vacancies}}</div>
          </div>
          <div class="flex-1 text-center px-2">
            <div class="text-indigo-600 text-2xl font-bold">2</div>
            <div class="text-sm text-gray-500">{{translations.interview}}</div>
          </div>
        </div>

      </div>

      <!-- Tabs -->
      <div class="grid grid-cols-3 mt-3 w-full max-w-md mx-auto gap-2">
        <button
            v-for="tab in tabs"
            :key="tab.key"
            class="w-full text-center px-2 py-2 text-sm transition-colors rounded-xl"
            :class="tab.active
      ? 'bg-blue-600 text-white'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            @click="$emit('change-tab', tab.key)"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '@/i18n-lite'
const { translations, locale, t } = useI18n()
defineProps({
  tabs: Array,
  activeTab: String
})
</script>

<style scoped>
.shadow-top {
  /* Tepadan yengilroq soyani beramiz */
  box-shadow:
      0 -2px 3px -1px rgba(0, 0, 0, 0.08),
      0 -2px 4px -2px rgba(0, 0, 0, 0.05),

        /* Pastdan kuchliroq soyani beramiz */
      0 4px 6px -1px rgba(0, 0, 0, 0.15),
      0 2px 4px -2px rgba(0, 0, 0, 0.1);
}
</style>
