<template>
  <nav class="fixed bottom-0 left-0 w-full z-40">
    <div class="max-w-7xl mx-auto px-6 pb-4">
      <div
        class="bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-3xl shadow-[0_-4px_16px_rgba(15,23,42,0.3)] px-6 py-3 flex items-end justify-between"
      >
        <!-- Home -->
        <button
          type="button"
          @click="goHome"
          class="flex-1 flex flex-col items-center justify-center"
        >
          <div
            :class="[
              'flex items-center justify-center rounded-2xl transition-all duration-200',
              isHomeActive
                ? 'bg-white text-blue-600 w-12 h-12 -translate-y-2 shadow-md'
                : 'bg-white/15 text-white/80 w-10 h-10'
            ]"
          >
            <svg
              class="w-6 h-6"
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
          </div>
          <span
            class="mt-1 text-xs"
            :class="isHomeActive ? 'text-white font-medium' : 'text-blue-100'"
          >
            Bosh
          </span>
        </button>

        <!-- Resume -->
        <RouterLink
          :to="{ name: 'resume' }"
          class="flex-1 flex flex-col items-center justify-center"
        >
          <div
            :class="[
              'flex items-center justify-center rounded-2xl transition-all duration-200',
              isResumeActive
                ? 'bg-white text-blue-600 w-12 h-12 -translate-y-2 shadow-md'
                : 'bg-white/15 text-white/80 w-10 h-10'
            ]"
          >
            <svg
              class="w-6 h-6"
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
          </div>
          <span
            class="mt-1 text-xs"
            :class="isResumeActive ? 'text-white font-medium' : 'text-blue-100'"
          >
            Resume
          </span>
        </RouterLink>

        <!-- Profile -->
        <RouterLink
          :to="{ name: 'profile' }"
          class="flex-1 flex flex-col items-center justify-center"
        >
          <div
            :class="[
              'flex items-center justify-center rounded-2xl transition-all duration-200',
              isProfileActive
                ? 'bg-white text-blue-600 w-12 h-12 -translate-y-2 shadow-md'
                : 'bg-white/15 text-white/80 w-10 h-10'
            ]"
          >
            <svg
              class="w-6 h-6"
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
          </div>
          <span
            class="mt-1 text-xs"
            :class="isProfileActive ? 'text-white font-medium' : 'text-blue-100'"
          >
            Profil
          </span>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const isHomeActive = computed(() => route.name === "home");
const isResumeActive = computed(() => route.name === "resume");
const isProfileActive = computed(() => route.name === "profile");

const goHome = () => {
  window.dispatchEvent(new CustomEvent("interai-home-click"));
  router.push({ name: "home" });
};
</script>
