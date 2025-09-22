<template>
  <div class="max-w-7xl mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <router-link
          :to="{ name: 'vacancyDetail', params: { id: index + 1 } }"
          v-for="(job, index) in jobs"
          :key="index"
          class="flex w-full max-w-lg flex-col mb-3"
      >
        <div class="flex items-center">
          <div
              class="relative rounded-tl-2xl rounded-tr-2xl bg-white pt-4 px-6 text-gray-500 text-sm outer"
          >
            {{ job.experience }}
          </div>
        </div>
        <div class="flex flex-col bg-white p-4 px-6 rounded-tr-2xl">
          <h2 class="mb-2 text-xl leading-tight font-medium">
            {{ job.title }}
          </h2>
          <div class="mb-2 flex items-center">
            <span class="text-gray-700">{{ job.company }}</span>
            <svg
                class="ml-2 h-5 w-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
            >
              <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
              />
            </svg>
            <small class="bg-green-100 mx-2 px-2 text-green-700 text-center text-sm font-medium py-1 rounded-full">
              95% совпадение
            </small>
          </div>
          <p class="text-sm leading-snug text-gray-500">
            {{ job.location }}
          </p>
        </div>
        <div class="w-full overflow-hidden rounded-b-2xl">
          <button class="w-full bg-blue-600 py-3 font-medium text-white">
            {{translations.reply}}
          </button>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '@/i18n-lite'
const { translations, locale, t } = useI18n()
const jobs = [
  {
    experience: "1–3 года",
    title: "Маркетолог. Со знанием русского языка",
    company: "OOO ROODELL",
    location: "12-yanvar, 2025-yil",
  },
  {
    experience: "1–3 года",
    title: "Junior Frontend Разработчик (Vue)",
    company: "MICROS24",
    location: "12-dekabr, 2025-yil",
  },
  {
    experience: "3–5 лет",
    title: "WEB Разработчик",
    company: "ROODELL",
    location: "12-Sentyabr, 2025-yil",
  },
]
</script>

<style scoped>
.outer:after {
  position: absolute;
  content: "";
  width: 8px;
  height: 8px;
  background-image: radial-gradient(
      circle at 100% 100%,
      transparent 8px,
      white calc(4px + 1px)
  );
  bottom: 0px;
  right: -8px;
  display: block;
  z-index: 1;
  transform: rotate(270deg);
}
</style>
