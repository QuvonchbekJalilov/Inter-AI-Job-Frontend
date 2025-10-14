<template>
  <div class="min-h-screen bg-gray-50" style="height: 100vh; overflow-y: auto;">
    <Header></Header>

    <VacancyList></VacancyList>

    <!-- Chat Widget -->
<!--    <div class="fixed bottom-6 right-6">-->
<!--      <button class="bg-black text-white px-4 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center space-x-2">-->
<!--        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">-->
<!--          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>-->
<!--        </svg>-->
<!--        <span class="font-medium">Чаты</span>-->
<!--      </button>-->
<!--    </div>-->
  </div>
</template>

<script setup>
import VacancyList from "@/components/VacancyList.vue";
import Header from "@/components/Header.vue";
import {computed, getCurrentInstance, onMounted} from "vue";
import axios from "axios";
const { proxy } = getCurrentInstance()
const chatId = computed(() => {});
onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const chatId = params.get("chat_id");
  const locale = params.get("locale") || "uz";

  if (chatId) {
    localStorage.setItem("chat_id", chatId);
    formData.chat_id = chatId;
    console.log("Chat ID saqlandi:", chatId);
  } else {
    const savedChatId = localStorage.getItem("chat_id");
    if (savedChatId) {
      formData.chat_id = savedChatId;
      console.log("Chat ID localStorage’dan olindi:", savedChatId);
    }
  }

  if (locale) {
    localStorage.setItem("locale", locale);
  }
});
onMounted(() => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token")
  const track = axios.get(proxy.$locale + "/v1/visits/track", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
  console.log(track)
});

</script>