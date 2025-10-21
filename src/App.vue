<script setup>
import { provideI18n } from './i18n-lite'
import {computed, onMounted, getCurrentInstance, ref} from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import LoadingModal from "@/components/modal/LodaingModal.vue";

provideI18n()
const router = useRouter()


const { proxy } = getCurrentInstance()
const showLoading = ref(false)


onMounted(async () => {

  showLoading.value = true

  const urlParams = new URLSearchParams(window.location.search)
  const chatIdFromUrl = urlParams.get("chat_id")
  const localeFromUrl = urlParams.get("locale") || "uz"

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
    localStorage.removeItem("token")
  } finally {
    showLoading.value = false
  }
  const storage = localStorage.getItem("token")
      ? localStorage
      : sessionStorage;

  const expiresAt = storage.getItem("expires_at");
  if (expiresAt) {
    const expireTime = new Date(expiresAt).getTime();
    const now = Date.now();

    if (now >= expireTime) {
      storage.removeItem("token");
      storage.removeItem("user");
      storage.removeItem("expires_at");
      router.push({ name: "register" });
      window.location.href = "/register";
    }
  }
});

onMounted(async () => {
  const queryString = window.location.search || window.location.hash.split('?')[1] || '';
  const params = new URLSearchParams(queryString);
  const chatId = params.get("chat_id");
  const token = params.get("token");
  const locale = params.get("locale") || "uz";

  if (chatId) {
    localStorage.setItem("chat_id", chatId);
    localStorage.setItem("token", token);
  } else {
    const savedChatId = localStorage.getItem("chat_id");
    if (savedChatId) {
      //console.log("Chat ID localStorage’dan olindi:", savedChatId);
    }
  }

  if (locale) {
    localStorage.setItem("locale", locale);
  }
});

onMounted(() => {
  document.addEventListener('gesturestart', e => e.preventDefault())
  document.addEventListener('wheel', e => {
    if (e.ctrlKey) e.preventDefault()
  }, { passive: false })
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
      e.preventDefault()
    }
  })
})

</script>

<template>
  <router-view />
  <LoadingModal :show="showLoading" />
</template>

<style>
.iti input[type="tel"]:focus {
  border: 2px solid orange !important;
  outline: none !important;
  box-shadow: none !important;
}

</style>
