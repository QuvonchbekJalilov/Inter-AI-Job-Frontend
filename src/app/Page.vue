<template>
  <div ref="scrollContainer" class="min-h-screen bg-gray-50" style="height: 100vh; overflow-y: auto;">
    <Header />
    <keep-alive>
      <VacancyList />
    </keep-alive>

    <div class="fixed bottom-6 right-6">
      <a
          href="https://t.me/inter_ai_support_bot"
          target="_blank"
          rel="noopener noreferrer"
          class="backdrop-blur-md bg-black/40 border border-blue-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-black/60 transition-all flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span class="font-medium">{{ translations.chat }}</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";
import axios from "axios";
import Header from "@/components/Header.vue";
import VacancyList from "@/components/VacancyList.vue";
import {useI18n} from "@/i18n-lite.js";
import {useRouter} from "vue-router";

const { translations } = useI18n()
const { proxy } = getCurrentInstance();

const scrollContainer = ref(null);

function saveScroll() {
  if (!scrollContainer.value) return;
  sessionStorage.setItem("vacancy_scroll", String(scrollContainer.value.scrollTop));
}

function restoreScroll() {
  if (!scrollContainer.value) return;
  const saved = sessionStorage.getItem("vacancy_scroll");
  if (saved) {
    setTimeout(() => {
      scrollContainer.value.scrollTop = parseInt(saved);
    }, 0);
  }
}

onMounted(async () => {
  showLoading.value = true

  // 1️⃣ URL paramlarni o‘qi
  const urlParams = new URLSearchParams(window.location.search)
  const chatIdFromUrl = urlParams.get("chat_id")
  const localeFromUrl = urlParams.get("locale") || "uz"

  // 2️⃣ LocalStorage ni to‘ldir
  if (chatIdFromUrl) localStorage.setItem("chat_id", chatIdFromUrl)
  if (localeFromUrl) localStorage.setItem("locale", localeFromUrl)

  const chatId = localStorage.getItem("chat_id")
  const token = localStorage.getItem("token")

  try {
    if (token) {
      await axios.get(proxy.$locale + "/auth/check-token", {
        headers: { Authorization: `Bearer ${token}` },
      })
      window.location.href = "/"
      return
    }

    if (chatId) {
      const res = await axios.post(proxy.$locale + "/auth/chat-id-login", { chat_id: chatId })
      const TOKEN = res.data?.data?.token

      if (TOKEN) {
        localStorage.setItem("token", TOKEN)
        window.location.href = "/"
        return
      }
    }
  } catch (error) {
    console.error("❌ Token yoki chat login xatosi:", error)
    localStorage.removeItem("token")
  } finally {
    showLoading.value = false
  }
})

onMounted(() => {
  restoreScroll();

  if (scrollContainer.value) {
    scrollContainer.value.addEventListener("scroll", saveScroll, { passive: true });
  }

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  axios.get(proxy.$locale + "/v1/visits/track", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).catch(() => {});
});

onBeforeUnmount(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener("scroll", saveScroll);
  }
});
</script>
