<script setup>
import { provideI18n } from './i18n-lite'
import {computed, onMounted, getCurrentInstance, ref} from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import LoadingModal from "@/components/modal/LodaingModal.vue";
provideI18n()
const router = useRouter()

onMounted(async () => {
  const queryString = window.location.search || window.location.hash.split('?')[1] || '';
  const params = new URLSearchParams(queryString);
  const chatId = params.get("chat_id");
  const token = params.get("token");
  const locale = params.get("locale") || "uz";
  const TOKEN = localStorage.getItem("token")

  if (TOKEN) {
    router.push({ path: "/" });
    window.location.href = "/"
  } else {
    alert('ok')
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("expires_at");
    router.push({ name: "register" });
    window.location.href = "/register"
  }

  if (chatId) {
    localStorage.setItem("chat_id", chatId);
    localStorage.setItem("token", token);
  } else {
    const savedChatId = localStorage.getItem("chat_id");
    if (savedChatId) {}
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
</template>

<style>
.iti input[type="tel"]:focus {
  border: 2px solid orange !important;
  outline: none !important;
  box-shadow: none !important;
}

</style>