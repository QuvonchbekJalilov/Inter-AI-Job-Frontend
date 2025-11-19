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

  if (token) localStorage.setItem("token", token);
  if (locale) localStorage.setItem("locale", locale);
  if (chatId) localStorage.setItem("chat_id", chatId);

  const currentUrl = window.location.href;

  const isCareerPage = currentUrl.includes("/career");

  if (TOKEN) {
    await axios.get(proxy.$locale + "/auth/check-token", {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (isCareerPage) {
      console.log("📌 Career sahifasiga qaytarildi");
      window.location.href = "https://vacancies.inter-ai.uz/#/career";
      return;
    } else {
      window.location.href = "/";
      return;
    }
  } else if (token) {
    await axios.get(proxy.$locale + "/auth/check-token", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (isCareerPage) {
      console.log("📌 Career sahifasiga qaytarildi");
      window.location.href = "https://vacancies.inter-ai.uz/#/career";
      return;
    } else {
      window.location.href = "/";
      return;
    }
  } else if (chatId) {
    const res = await axios.post(proxy.$locale + "/auth/chat-id-login", { chat_id: chatId });
    const RES_TOKEN = res.data?.data?.token;

    if (RES_TOKEN) {
      localStorage.setItem("token", RES_TOKEN);
      if (isCareerPage) {
        console.log("📌 Career sahifasiga qaytarildi");
        window.location.href = "https://vacancies.inter-ai.uz/#/career";
        return;
      } else {
        window.location.href = "/";
        return;
      }
    }
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("expires_at");
    router.push({ name: "register" });
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