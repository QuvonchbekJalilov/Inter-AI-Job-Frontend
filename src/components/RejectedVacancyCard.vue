<template>
  <div class="max-w-7xl mx-auto px-4">
    <Vacancies :show="loadingSkeleton" :count="10" :cols="3" />

    <div v-if="rejections.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="item in rejections"
        :key="item.id"
        class="flex w-full max-w-lg flex-col mb-3"
        @click="goToDetail(item.id)"
      >
        <div class="flex items-center">
          <div
            class="relative rounded-tl-2xl rounded-tr-2xl bg-white pt-4 px-4 text-gray-500 text-sm outer"
          >
            {{ formatDate(item.created_at) }}
          </div>
        </div>
        <div class="flex flex-col bg-white px-4 rounded-tr-2xl cursor-pointer">
          <h3 class="mb-2 mt-5 text-xl leading-tight font-medium w-4/5 truncate">
            {{ item.vacancy?.title || item.vacancy?.name }}
          </h3>
          <div class="mb-2 flex items-center justify-between gap-2">
            <span class="flex items-center text-gray-700 text-sm basis-2/5 truncate">
              <svg
                class="h-4 w-4 text-blue-600 mr-2 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ item.vacancy?.company || item.vacancy?.employer?.name || '—' }}
            </span>
          </div>
          <div class="mb-4 rounded-xl border border-red-100 bg-red-50 py-3 px-4 text-center">
            <p class="text-base uppercase tracking-wide text-red-600">
              {{ translations.rejected_message }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="!loading && !loadingSkeleton"
      class="flex flex-col items-center justify-center py-20 text-center text-gray-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

      <h3 class="text-lg font-medium mb-2">
        {{ translations.no_vacancies_title }}
      </h3>

      <p class="text-sm text-gray-500 mb-4">
        {{ translations.no_vacancies_description }}
      </p>
    </div>
  </div>
  <LoadingModal :show="showLoading" />
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useI18n } from "@/i18n-lite";
import Vacancies from "@/components/loading/Vacancies.vue";
import LoadingModal from "@/components/modal/LodaingModal.vue";

const { translations } = useI18n()
const { proxy } = getCurrentInstance();
const router = useRouter();

const rejections = ref([]);
const loading = ref(false);
const loadingSkeleton = ref(false);
const showLoading = ref(false);

const fetchRejections = async () => {
  loading.value = true;
  loadingSkeleton.value = true;
  showLoading.value = true;

  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const { data } = await axios.get(`${proxy.$locale}/v1/rejections`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (data.success && Array.isArray(data.data)) {
      rejections.value = data.data;
    }
  } catch (e) {
    console.error("❌ Rejections API error:", e.response?.data || e.message);
  } finally {
    loading.value = false;
    loadingSkeleton.value = false;
    showLoading.value = false;
  }
};

const goToDetail = (id) => {
  if (!id) return;
  router.push({ name: "rejectionDetail", params: { id } });
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

onMounted(fetchRejections);
</script>

<style scoped>
.outer:after {
  position: absolute;
  content: "";
  width: 8px;
  height: 8px;
  background-image: radial-gradient(
      circle at 100% 100%,
      transparent 8px,
      white calc(4px + 1px)
  );
  bottom: 0;
  right: -8px;
  display: block;
  z-index: 1;
  transform: rotate(270deg);
}
</style>
