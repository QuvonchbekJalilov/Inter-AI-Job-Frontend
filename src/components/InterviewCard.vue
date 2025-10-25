<template>
  <div class="max-w-7xl mx-auto px-4">

    <Vacancies v-if="loading"  :show="loading" :count="10" :cols="3" />

    <div v-else-if="interviews.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
          v-for="item in interviews"
          :key="item.id"
          class="flex w-full max-w-lg flex-col mb-3"
      >
        <router-link
            :to="{ name: 'interviewDetail', params: { id: item.id } }"
            class="flex w-full max-w-lg flex-col"
        >
          <div class="flex items-center">
            <div class="relative rounded-tl-2xl rounded-tr-2xl bg-white pt-4 px-4 text-gray-500 text-sm outer">
              {{ formatDate(item.created_at) }}
            </div>
          </div>
          <div class="flex flex-col bg-white px-4 rounded-tr-2xl">
            <div class="flex items-start justify-between mb-2">
              <h3 class="mb-2 mt-5 text-xl leading-tight font-medium w-4/5 truncate">
                {{ item.vacancy?.title }}
              </h3>
              <!-- <small class="bg-blue-100 px-3 text-blue-600 text-center text-xs font-medium py-1 rounded-full">
                {{ translations.assigned }}
              </small> -->
            </div>
            <div class="mb-2 flex items-center justify-between gap-2">
              <span class="flex items-center text-gray-700 text-sm basis-2/5 truncate">
                <svg class="h-4 w-4 text-blue-600 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                  />
                </svg>
                {{ item.vacancy?.company ?? translations.unknown_company }}
              </span>
            </div>
            <div class="mb-4 rounded-xl border border-blue-100 bg-blue-50 py-3 px-4 text-center">
              <p class="text-base  uppercase tracking-wide text-blue-600">
                {{ translations.interview_invited }}
              </p>
            </div>
          </div>
        </router-link>
        <div class="w-full overflow-hidden rounded-b-2xl">
          <button
              class="w-full py-3 font-medium text-white rounded-b-2xl bg-blue-600 hover:bg-blue-700 text-center flex items-center justify-center gap-2 transition-colors"
              @click="goToDetail(item.id)"
          >
            {{ translations.details_button }}
          </button>
        </div>
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
  <div>
    <ModalComponent
        :show="showModal"
        @refresh="startLoading"
    />
    <LoadingModal :show="showLoading" />
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useI18n } from "@/i18n-lite";
import Vacancies from "@/components/loading/Vacancies.vue";
import ModalComponent from "@/components/modal/UpdateModal.vue";
import LoadingModal from "@/components/modal/LodaingModal.vue";

const { proxy } = getCurrentInstance();
const router = useRouter();
const { translations } = useI18n();

const interviews = ref([]);
const loading = ref(false);
const showLoading = ref(false);
const error = ref(null);

const fetchInterviews = async () => {
  loading.value = true;
  showLoading.value = true;
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const { data } = await axios.get(`${proxy.$locale}/v1/interviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    
    if (data.success) {
      interviews.value = data.data.map(item => {
        const vacancy = item.vacancy || {};
        const primary = vacancy.company;

       // console.log("🔍 Processing vacancy:", vacancy);
        const fallback =
            vacancy?.employer?.name ??
            vacancy?.employer_name ??
            vacancy?.company_name ??
            vacancy?.companyName ??
            vacancy?.organization?.name ??
            vacancy?.organisation?.name;

        const companyName =
            (primary && primary.trim() && primary.trim() !== "-" && primary.trim() !== "—")
                ? primary.trim()
                : (fallback && fallback.trim()) ? fallback.trim() : "—";
        console.log("✅ Interviews:", interviews.value);

        return {
          ...item,
          vacancy: {
            ...vacancy,
            company: companyName,
          },
        };
      });
     
    } else {
      error.value = "No interviews found";
    }
  } catch (e) {
    error.value = e.response?.data?.message || e.message;
    console.error("❌ API error:", e);
  } finally {
    showLoading.value = false;
    loading.value = false;
  }
};

const goToDetail = (id) => {
  router.push({ name: "interviewDetail", params: { id } });
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
