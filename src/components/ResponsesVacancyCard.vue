<template>
  <div class="max-w-7xl mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <router-link
          v-for="(job, index) in jobs"
          :to="{ name: 'vacancyDetail', params: { id: job.external_id } }"
          :key="index"
          class="flex w-full max-w-lg flex-col mb-3"
      >
        <div class="flex items-center">
          <div
              class="relative rounded-tl-2xl rounded-tr-2xl bg-white pt-4 px-4 text-gray-500 text-sm outer"
          >
            {{ job.experience }}
          </div>
        </div>
        <div class="flex flex-col bg-white p-4 px-4 rounded-tr-2xl">
          <h2 class="mb-2 text-xl leading-tight font-medium">
            {{ job.title }}
          </h2>
          <div class="mb-2 flex items-center justify-between gap-2">
            <span class="text-gray-700 text-sm basis-2/5 truncate">
              {{ job.company }}
            </span>

            <div class="flex items-center justify-end basis-3/5">
              <svg
                  class="h-5 w-5 text-blue-600 mr-1"
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
              <small
                  class="bg-green-100 px-2 text-green-700 text-center text-sm font-medium py-1 rounded-full"
              >
                {{ job.score ?? '95' }}% совпадение
              </small>
            </div>
          </div>
          <p class="text-sm leading-snug text-gray-500">
            {{ job.location }}
          </p>
        </div>
        <div class="w-full overflow-hidden rounded-b-2xl">
          <button
              class="w-full py-3 font-medium text-white rounded-b-2xl"
              :class="job.status ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'"
              :disabled="job.status"
          >
            {{ translations.reply }}
          </button>
        </div>
      </router-link>
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
import { onMounted, ref, getCurrentInstance, onBeforeUnmount } from "vue";
import { useI18n } from '@/i18n-lite'
import LoadingModal from "@/components/modal/LodaingModal.vue";
import ModalComponent from "@/components/modal/UpdateModal.vue";
import axios from "axios";

const { translations } = useI18n()

const showModal = ref(false);
const showLoading = ref(false);
let intervalId = null;

const { proxy } = getCurrentInstance()
const jobs = ref([])

// 🔑 Boshqa page uchun alohida cache kaliti
const CACHE_KEY = "responses_vacancies_cache"
const CACHE_TIME = 5 * 60 * 1000

const getCache = () => {
  const cache = localStorage.getItem(CACHE_KEY)
  if (!cache) return null

  const parsed = JSON.parse(cache)
  const isExpired = Date.now() - parsed.timestamp > CACHE_TIME
  return isExpired ? null : parsed.data
}

const setCache = (data) => {
  localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() })
  )
}

const fetchJobs = async (forceUpdate = false) => {
  showLoading.value = true

  try {
    if (!forceUpdate) {
      const cachedData = getCache()
      if (cachedData) {
        jobs.value = cachedData
        showLoading.value = false
        return
      }
    }

    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    const { data } = await axios.get(
        proxy.$locale + "/v1/applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
    )
    console.log('data', data)

    if (data.status === "success" && data.data) {
      const mappedJobs = data.data.map(item => ({
        id: item.vacancy.id,
        external_id: item.vacancy.external_id,
        title: item.vacancy.title,
        company: item.vacancy.company,
        location: item.vacancy.published_at,
        experience: item.vacancy.experience,
        score: item.score_percent,
        status: item.status
      }))

      const filteredJobs = mappedJobs.filter(job => job.status === true)

      jobs.value = filteredJobs
      console.log(jobs.value)
      setCache(filteredJobs)
    }
  } catch (error) {
    console.error("❌ Xatolik:", error.response?.data || error.message)
  } finally {
    showLoading.value = false
  }
}

const startLoading = async () => {
  showModal.value = false
  showLoading.value = true

  await fetchJobs(true)

  setTimeout(() => {
    showLoading.value = false
  }, 1500)
}
onMounted(() => {
  fetchJobs()

  intervalId = setInterval(() => {
    showModal.value = true
  }, CACHE_TIME)
})

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
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
  bottom: 0px;
  right: -8px;
  display: block;
  z-index: 1;
  transform: rotate(270deg);
}
</style>
