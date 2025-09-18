<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-white text-black px-4 py-3 shadow-md">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-8">
        <div class="text-white px-2 mt-5 rounded font-bold text-lg">
          <a href="/">
            <img src="https://www.inter-ai.uz/Logo1.svg" alt="Inter-AI" class="h-8 mx-auto mb-4">
          </a>
        </div>
        <nav class="hidden md:flex items-center space-x-6">
          <a href="#" class="hover:text-gray-500">{{ translations.resumeProfile }}</a>
          <a href="#" class="hover:text-gray-500">{{ translations.help }}</a>
        </nav>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Language Dropdown -->
        <div class="relative" ref="langRef">
          <button
            type="button"
            @click="toggleLang"
            :aria-expanded="isLangOpen ? 'true' : 'false'"
            class="flex items-center gap-2 border rounded-full px-2.5 py-1.5 text-sm hover:bg-gray-50"
          >
            <img :src="currentLang.flag" alt="" class="w-5 h-5 rounded-full object-cover" />
            <span class="hidden sm:inline font-medium">{{ currentLang.label }}</span>
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <transition name="fade-scale">
            <div
              v-if="isLangOpen"
              class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-50"
            >
              <button
                v-for="l in langs"
                :key="l.code"
                @click="setLang(l.code)"
                class="flex items-center w-full gap-3 px-3 py-2 text-sm hover:bg-gray-100"
              >
                <img :src="l.flag" alt="" class="w-5 h-5 rounded-full object-cover" />
                <span class="font-medium">{{ l.label }}</span>
              </button>
            </div>
          </transition>
        </div>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from '@/i18n-lite'
import flagUZ from '@/assets/flags/uz.svg'
import flagRU from '@/assets/flags/ru.svg'
import flagGB from '@/assets/flags/gb.svg'
const { translations, locale } = useI18n()

const langs = [
  { code: 'uz', label: 'UZ', flag: flagUZ },
  { code: 'ru', label: 'RU', flag: flagRU },
  { code: 'en', label: 'EN', flag: flagGB },
]

const isLangOpen = ref(false)
const currentLang = computed(() => langs.find(l => l.code === locale.value) || langs[0])
const toggleLang = () => { isLangOpen.value = !isLangOpen.value }
const setLang = (code) => { locale.value = code; isLangOpen.value = false }

const langRef = ref(null)
const onDocClick = (e) => {
  if (!langRef.value) return
  if (!langRef.value.contains(e.target)) isLangOpen.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>


<style scoped>
.fade-scale-enter-active, .fade-scale-leave-active {
  transition: opacity 120ms ease, transform 120ms ease;
  transform-origin: top right;
}
.fade-scale-enter-from, .fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
