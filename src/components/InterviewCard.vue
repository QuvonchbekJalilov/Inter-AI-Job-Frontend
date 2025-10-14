<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <h1 class="text-2xl font-semibold mb-6">{{ translations.interviews }}</h1>

    <div v-if="loading" class="text-gray-500 text-center">
      {{ translations.loading }}
    </div>

    <div v-else-if="error" class="text-red-500 text-center">
      {{ error }}
    </div>

    <div v-else-if="interviews.length" class="space-y-6">
      <!-- loop directly here -->
      <div
        v-for="item in interviews"
        :key="item.id"
        class="bg-white rounded-2xl shadow-md p-6 space-y-4 max-w-3xl mx-auto cursor-pointer"
        @click="goToDetail(item.id)"
        role="button"
      >
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-xl font-medium text-gray-800">{{ item.vacancy?.title }}</h3>
            <p class="text-blue-600 font-medium">{{ item.vacancy?.company ?? '—' }}</p>
          </div>
          <span
            class="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700"
          >
            {{ translations.assigned }}
          </span>
        </div>

        <div class="flex items-center text-gray-600 space-x-2">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-7H3v7a2 2 0 002 2z"/>
          </svg>
          <span>{{ formatDate(item.created_at) }}</span>
        </div>

        <div>
          <h4 class="text-gray-700 font-medium mb-2">
            Возможные вопросы от AI:
          </h4>
          <ul class="list-decimal list-inside space-y-1 text-gray-600">
            <li v-for="(q,i) in item.questions_preview" :key="i">{{ q }}</li>
          </ul>
        </div>

        <button
          class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl"
          @click.stop="onPrepareClick(item.id)"
        >
          {{ translations.prepare_for_the_interview }}
        </button>
      </div>
    </div>

    <div v-else class="text-gray-500 text-center">
      {{ translations.no_interviews_yet }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useI18n } from "@/i18n-lite";

const { proxy } = getCurrentInstance();
const router = useRouter();
const { translations } = useI18n();

const interviews = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchInterviews = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const { data } = await axios.get(`${proxy.$locale}/v1/interviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (data.success) {
      interviews.value = data.data;
      console.log("✅ Interviews:", data.data);
    } else {
      error.value = "No interviews found";
    }
  } catch (e) {
    error.value = e.response?.data?.message || e.message;
    console.error("❌ API error:", e);
  } finally {
    loading.value = false;
  }
};

const goToDetail = (id) => {
  router.push({ name: "interviewDetail", params: { id } });
};

const onPrepareClick = (id) => {
  alert(`Prepare for interview #${id} — coming soon 🚀`);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(fetchInterviews);
</script>
