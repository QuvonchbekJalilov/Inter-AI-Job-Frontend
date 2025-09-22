<script setup>
import { provideI18n } from './i18n-lite'
import { onMounted } from "vue";
import { useRouter } from "vue-router";

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
      router.push({ name: "login" });
    }
  }
});

</script>

<template>
  <router-view />
</template>

<style scoped>

</style>
