<template>
  <nav class="fixed bottom-0 left-0 w-full z-40">
    <div
      class="bg-gradient-to-r from-blue-600 to-blue-500 shadow-[0_-4px_16px_rgba(15,23,42,0.3)] px-8 py-2 flex items-center justify-between"
    >
      <!-- Home -->
      <button
        type="button"
        @click="goHome"
        class="flex-1 flex items-center justify-center"
      >
        <div
          :class="[
            'flex items-center justify-center rounded-full transition-all duration-200',
            isHomeActive
              ? 'bg-white/25 text-white px-6 py-2'
              : 'text-white/80 px-0 py-0'
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
      </button>

      <!-- Resume -->
      <RouterLink
        :to="{ name: 'resume' }"
        class="flex-1 flex items-center justify-center"
      >
        <div
          :class="[
            'flex items-center justify-center rounded-full transition-all duration-200',
            isResumeActive
              ? 'bg-white/25 text-white px-6 py-2'
              : 'text-white/80 px-0 py-0'
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
      </RouterLink>

      <!-- Profile -->
      <RouterLink
        :to="{ name: 'profile' }"
        class="flex-1 flex items-center justify-center"
      >
        <div
          :class="[
            'flex items-center justify-center rounded-full transition-all duration-200',
            isProfileActive
              ? 'bg-white/25 text-white px-6 py-2'
              : 'text-white/80 px-0 py-0'
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
      </RouterLink>
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
