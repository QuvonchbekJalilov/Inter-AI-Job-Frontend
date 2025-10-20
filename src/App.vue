<script setup>
import { provideI18n } from './i18n-lite'
import {computed, onMounted} from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

provideI18n()


onMounted(() => {
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
    }
  }
});
const chatId = computed(() => {});

onMounted(async () => {
  const queryString = window.location.search || window.location.hash.split('?')[1] || '';
  const params = new URLSearchParams(queryString);
  const chatId = params.get("chat_id");
  const token = params.get("token");
  const locale = params.get("locale") || "uz";
  //console.log("chatId, Language:", chatId, locale, token);

  if (chatId) {
    localStorage.setItem("chat_id", chatId);
    localStorage.setItem("token", token);

    //console.log("Chat ID saqlandi:", chatId, token);
    // const { data } = await axios.post('/api/chat-id-login', {
    //   chat_id: chatId
    // })
    // console.log("Data:", data);
  } else {
    const savedChatId = localStorage.getItem("chat_id");
    if (savedChatId) {
      //console.log("Chat ID localStorage’dan olindi:", savedChatId);
    }
  }

  if (locale) {
    localStorage.setItem("locale", locale);
    //console.log("Chat ID saqlandi:", locale);
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
