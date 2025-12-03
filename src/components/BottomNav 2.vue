<template>
  <nav class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-40">
    <div class="max-w-7xl mx-auto px-8 py-2">
      <div class="flex items-center justify-between">
        <!-- Home -->
        <button
          type="button"
          @click="goHome"
          class="flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
        >
          <svg
            class="w-7 h-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 10.75L12 4l9 6.75V19a2 2 0 01-2 2h-4.5a.5.5 0 01-.5-.5V15a2 2 0 00-2-2h-1a2 2 0 00-2 2v5.5a.5.5 0 01-.5.5H5a2 2 0 01-2-2v-8.25z"
            />
          </svg>
        </button>

        <!-- Resume (empty page) -->
        <RouterLink
          :to="{ name: 'resume' }"
          class="flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
        >
          <svg
            class="w-7 h-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5h6M9 9h6M9 13h3M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
            />
          </svg>
        </RouterLink>

        <!-- Profile -->
        <RouterLink
          :to="{ name: 'profile' }"
          class="flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
        >
          <svg
            class="w-7 h-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 12a4 4 0 100-8 4 4 0 000 8z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 20a6 6 0 0112 0"
            />
          </svg>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router";

const router = useRouter()

const goHome = () => {
  window.dispatchEvent(new CustomEvent('interai-home-click'))
  router.push({ name: 'home' })
}
</script>
