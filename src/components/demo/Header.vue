<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-white text-black px-4 py-3 shadow-md">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-8">
        <div class="text-white px-2 mt-5 rounded font-bold text-lg">
          <RouterLink to="/">
            <img src="https://www.inter-ai.uz/Logo1.svg" alt="Inter-AI" class="h-8 mx-auto mb-4" />
          </RouterLink>
        </div>


      </div>

      <div class="flex items-center space-x-4">

        <RouterLink
            to="/profile"
            class="flex items-center space-x-2 hover:text-gray-500"
        >
          <span>{{ translations.profile }}</span>
          <svg class="w-9 h-9" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="500" cy="500" r="396.364" fill="white" stroke="#C6C6C6" stroke-width="7.27273"/>
            <path d="M612.317 162.336C125.918 493.239 560.25 774.264 744.155 527.855C394.377 1306.54 -83.9093 341.001 612.317 162.336Z" fill="#5078FF"/>
            <path d="M630.583 459.366C630.583 514.87 586.313 559.865 531.704 559.865C477.094 559.865 432.825 514.87 432.825 459.366C432.825 403.861 477.094 358.866 531.704 358.866C586.313 358.866 630.583 403.861 630.583 459.366Z" fill="#5078FF"/>
          </svg>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useI18n } from '@/i18n-lite'
const { translations } = useI18n()
</script>
