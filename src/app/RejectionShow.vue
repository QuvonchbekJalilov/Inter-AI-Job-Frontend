<template>
  <div class="min-h-screen bg-[#f2f2f2]">
    <Header />

    <VacancySkeleton :show="loadingSkeleton" />

    <div
      v-if="vacancy"
      class="max-w-5xl pt-[110px] mx-auto p-6 bg-white rounded-2xl shadow space-y-6"
    >
      <div>
        <div class="flex items-start justify-between mb-2">
          <h3 class="mb-2 mt-5 text-xl leading-tight font-medium">
            {{ vacancyTitle }}
          </h3>
        </div>
        <p class="text-gray-700 font-medium">
          {{ vacancyCompany }}
        </p>
        <p v-if="vacancyArea" class="text-gray-500">
          {{ vacancyArea }}
        </p>
      </div>

      <div v-if="vacancy.salary" class="p-4 bg-gray-50 rounded-lg">
        <p class="text-lg font-medium text-green-700">
          {{ formatSalary(vacancy.salary) }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 border rounded-lg" v-if="vacancy.schedule?.name">
          <p class="text-sm text-gray-500">{{ translations.Schedule }}</p>
          <p class="font-medium">{{ vacancy.schedule?.name }}</p>
        </div>
        <div class="p-4 border rounded-lg" v-if="vacancy.employment?.name">
          <p class="text-sm text-gray-500">{{ translations.Type_of_employment }}</p>
          <p class="font-medium">{{ vacancy.employment?.name }}</p>
        </div>
      </div>

      <div class="mb-4 rounded-xl border border-red-100 bg-red-50 py-3 px-4 text-center">
        <p class="text-base uppercase tracking-wide text-red-600">
          {{ translations.rejected_message }}
        </p>
      </div>

      <div v-if="vacancy.description">
        <h2 class="text-xl font-medium mb-2">{{ translations.Job_Description }}</h2>
        <div class="text-gray-600 prose max-w-none" v-html="vacancy.description"></div>
      </div>

      <div class="bg-gray-50 rounded-lg p-3 grid grid-cols-3 items-start">
        <div class="text-sm text-gray-500">
          <span>{{ translations.manba }}</span>
        </div>

        <div class="flex flex-col text-center">
          <span class="text-gray-500">{{ translations.Published }}</span>
          <span class="text-black whitespace-nowrap">
            {{ formatDate(vacancy.published_at) }}
          </span>
        </div>

        <div></div>
      </div>
    </div>
  </div>
  <LoadingModal :show="showLoading" />
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Header from "@/components/Header.vue";
import VacancySkeleton from "@/components/loading/VacancyShow.vue";
import LoadingModal from "@/components/modal/LodaingModal.vue";
import { useI18n } from "@/i18n-lite";

const { proxy } = getCurrentInstance();
const route = useRoute();
const { translations } = useI18n();

const rejectionId = route.params.id;
const vacancy = ref(null);
const loadingSkeleton = ref(true);
const showLoading = ref(false);

const vacancyTitle = computed(
  () => vacancy.value?.name || vacancy.value?.title || "-"
);
const vacancyCompany = computed(
  () =>
    vacancy.value?.employer?.name ||
    vacancy.value?.company ||
    translations.unknown_company
);
const vacancyArea = computed(() => vacancy.value?.area?.name || "");

const formatSalary = (salary) => {
  if (!salary) return "";
  const from = salary.from ? salary.from.toLocaleString("ru-RU") : null;
  const to = salary.to ? salary.to.toLocaleString("ru-RU") : null;
  const currency = salary.currency || "";

  if (from && to) return `${from} - ${to} ${currency}`;
  if (from) return `${from} ${currency}`;
  if (to) return `${to} ${currency}`;
  return "";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const fetchRejection = async () => {
  loadingSkeleton.value = true;
  showLoading.value = true;
  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const { data } = await axios.get(
      `${proxy.$locale}/v1/rejections/${rejectionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (data.success && data.data?.vacancy) {
      vacancy.value = data.data.vacancy;
    }
  } catch (e) {
    console.error("❌ Rejection detail API error:", e.response?.data || e.message);
  } finally {
    loadingSkeleton.value = false;
    showLoading.value = false;
  }
};

onMounted(fetchRejection);
</script>

<style scoped>
</style>

