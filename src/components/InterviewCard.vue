<template>
  <div class="max-w-7xl mx-auto px-4">

    <Vacancies v-if="loading"  :show="loading" :count="6" :cols="3" />

    <div v-else-if="interviews.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            {{ translations.possible_ai_questions }}
          </h4>
          <ul class="list-decimal list-inside space-y-1 text-gray-600">
            <li v-for="(q,i) in item.questions_preview" :key="i">{{ q }}</li>
          </ul>
        </div>

        <button
          class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl"
          @click="goToDetail(item.id)"
        >
          {{ translations.prepare_for_the_interview }}
        </button>
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center py-20 text-center text-gray-600">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

      <h3 class="text-lg font-medium mb-2">
        {{ translations.no_vacancies_title }}
      </h3>

      <p class="text-sm text-gray-500 mb-4">
        {{ translations.no_vacancies_description }}
      </p>

      <a
          href="/"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {{ translations.view_vacancies }}
      </a>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useI18n } from "@/i18n-lite";
import Vacancies from "@/components/loading/Vacancies.vue";

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
