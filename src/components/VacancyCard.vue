<template>
  <div class="max-w-7xl mx-auto px-4">
    <Vacancies :show="loadingSkeleton" :count="6" :cols="3" />
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-if="jobs.length > 0" v-for="job in jobs" :key="`${job.source}-${job.id}-${job.external_id ?? ''}`" class="flex w-full max-w-lg flex-col mb-3">
        <router-link
            v-if="job.source === 'telegram'"
            :to="{ name: 'vacancyTelegramDetail', params: { id: job.id } }"
            class="flex w-full max-w-lg flex-col"
        >
          <div class="flex items-center">
            <div class="relative rounded-tl-2xl rounded-tr-2xl bg-white pt-4 px-4 text-gray-500 text-sm outer">
              {{ job.experience ?? translations.experience }}
            </div>
          </div>
          <div class="flex flex-col bg-white px-4 rounded-tr-2xl">
            <div class="flex items-start justify-between mb-2">
              <h2 class="mb-2 mt-5 text-xl leading-tight font-medium">{{ job.title }}</h2>
              <!-- Telegram icon -->
              <img
                  src="/icons/telegram.svg"
                  alt="Telegram"
                  class="w-6 h-6 mt-5 object-contain ml-2 shrink-0"
              />
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
                {{ job.company }}
              </span>
              <small class="bg-green-100 px-2 text-green-700 text-center text-sm font-medium py-1 rounded-full">
                {{ job.score ?? '95' }}% {{ translations.accordance }}
              </small>
            </div>
          </div>
        </router-link>
        <router-link
            v-else
            :to="{ name: 'vacancyDetail', params: { id: job.external_id } }"
            class="flex w-full max-w-lg flex-col"
        >
          <div class="flex items-center">
            <div class="relative rounded-tl-2xl rounded-tr-2xl bg-white pt-4 px-4 text-gray-500 text-sm outer">
              {{ job.experience }}
            </div>
          </div>
          <div class="flex flex-col bg-white p-4 px-4 rounded-tr-2xl">
            <div class="flex items-start justify-between mb-2">
              <h2 class="text-xl leading-tight font-medium w-4/5 truncate">
                {{ job.title }}
              </h2>

              <img
                  src="/HeadHunter_logo.png"
                  alt="HeadHunter"
                  class="w-6 h-6 object-contain ml-2 shrink-0"
              />
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
                {{ job.company }}
              </span>
              <small class="bg-green-100 px-2 text-green-700 text-center text-sm font-medium py-1 rounded-full">
                {{ job.score ?? '95' }}% {{ translations.accordance }}
              </small>
            </div>
            <p class="text-sm leading-snug text-gray-500">
              {{ formatDate(job.published_at) }}
            </p>
          </div>
        </router-link>
        <div class="w-full overflow-hidden rounded-b-2xl">

          <!-- HeadHunter tugmasi -->
          <button
              v-if="job.source !== 'telegram'"
              class="w-full py-3 font-medium text-white rounded-b-2xl flex items-center justify-center gap-2 transition-colors"
              :class="job.status
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700'"
              :disabled="job.status || !job.external_id"
              @click="applyToVacancy(job)"
          >
            <span>{{ job.status ? translations.applied : translations.reply }}</span>
          </button>

          <!-- Telegram tugmasi -->
          <router-link
              v-if="job.source === 'telegram'"
              :to="{ name: 'vacancyTelegramDetail', params: { id: job.id } }"
              class="w-full py-3 font-medium text-white rounded-b-2xl bg-blue-600 hover:bg-blue-700 text-center flex items-center justify-center gap-2 transition-colors"
          >
            <span>{{ translations.source }}</span>
          </router-link>

        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center py-20 text-center text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium mb-2">Sizga mos keladigan Vacansiya topilmadi iltios qaytadan login yoki registratsiya qilib ko'ring</h3>
      </div>
    </div>
  </div>
  <div>
    <ModalComponent
        :show="showModal"
        @refresh="startLoading"
    />

    <div
        v-if="showHhModal"
        class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg space-y-4">
        <h2 class="text-lg font-medium text-gray-800">
          {{ translations.auto_apply?.hh_modal_title }}
        </h2>
        <p class="text-sm text-gray-600">
          {{ translations.auto_apply?.hh_modal_description }}
        </p>
        <div class="flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
              class="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              @click="closeHhModal"
          >
            {{ translations.auto_apply?.hh_modal_cancel }}
          </button>
          <button
              class="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              @click="handleHeadHunterAuth"
          >
            {{ translations.auto_apply?.hh_modal_action }}
          </button>
        </div>
      </div>
    </div>

    <LoadingModal :show="showLoading" />
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, onBeforeUnmount, computed } from "vue";
import { useI18n } from '@/i18n-lite'
import LoadingModal from "@/components/modal/LodaingModal.vue";
import ModalComponent from "@/components/modal/UpdateModal.vue";
import axios from "axios";
import { toast } from "vue3-toastify"
import { useRouter } from 'vue-router'
import Vacancies from "@/components/loading/Vacancies.vue";
const router = useRouter()

const { translations } = useI18n()

const showModal = ref(false);
const showLoading = ref(false);
const loadingSkeleton = ref(true);
const showHhModal = ref(false);
let intervalId = null;

const { proxy } = getCurrentInstance()
const jobs = ref([])
const CACHE_KEY = "vacancies_cache"
const CACHE_TIME = 60 * 60 * 1000
const clearAuthStorage = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  localStorage.removeItem("expires_at")
  localStorage.removeItem("vacancies_cache")
  sessionStorage.removeItem("token")
  sessionStorage.removeItem("user")
  sessionStorage.removeItem("expires_at")
  sessionStorage.removeItem("vacancies_cache")
  router.push({ name: "register" })
}
const applyToVacancy = async (job) => {
  try {
    if (job.source === 'telegram') {
      return
    }

    if (!hhAccountActive.value) {
      showHhModal.value = true;
      return
    }

    const token =
        localStorage.getItem("token") || sessionStorage.getItem("token")

    const { data } = await axios.post(
        `${proxy.$locale}/v1/hh/vacancies/${job.external_id}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
    )

    console.log("✅ Apply javobi:", data)

    if (data.success && data.data) {
      jobs.value = jobs.value.map((j) =>
          j.external_id === job.external_id ? { ...j, status: true } : j
      )

      setCache(jobs.value)

      toast.success("Muvaffaqiyatli yuborildi ✅")
    }
  } catch (error) {
    console.error("❌ Apply error:", error.response?.data || error.message)
    toast.error(
        "Xatolik: siz Vacansiyaga topshirish uchun Profile qismiga o'tib Head Hunter dan login qiling"
    )
  }
}
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

const user = ref(null)
const error = ref("")
const hhAccountActive = computed(() => !!user.value?.hh_account_status)

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

    const { data } = await axios.post(
        proxy.$locale + "/v1/vacancy-matches/run",
        {

        }, {headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          }}
    )
    console.log('data', data)

    if (data.status === "success" && data.data) {
      const mappedJobs = data.data.map(item => {
        const v = item.vacancy
        const isTelegram = v.source === 'telegram'

        return {
          id: v.id,
          source: v.source,             // 👈 muhim
          external_id: isTelegram ? null : v.external_id,
          telegram: isTelegram ? {      // 👈 telegramga xos maydonlar
            source_id: v.source_id,
            source_message_id: v.source_message_id,
            target_message_id: v.target_message_id,
            message_id: v.message_id,
          } : null,

          title: v.title,
          company: v.company,
          experience: v.experience ?? null,
          salary: v.salary ?? null,
          published_at: v.published_at ?? null,

          score: item.score_percent,
          status: item.status
        }
      })

      jobs.value = mappedJobs
      setCache(mappedJobs)
    }
  } catch (error) {
    console.error("❌ Xatolik:", error.response?.data || error.message)

    if (error.response?.status === 401) {
      clearAuthStorage()
    }
  } finally {
    showLoading.value = false
    loadingSkeleton.value = false
  }
}
onMounted(async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      router.push({ name: "register" });
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const { data: meData } = await axios.get(proxy.$locale + "/auth/me", { headers });
    user.value = meData.data;
    console.log("meData", meData);
  } catch (e) {
    error.value = "Foydalanuvchi ma’lumotlarini olishda xatolik.";
    if (e.response?.status === 401) clearAuthStorage();
  }
});

const startLoading = async () => {
  showModal.value = false
  showLoading.value = true

  await fetchJobs(true)

  setTimeout(() => {
    showLoading.value = false
  }, 18000)
}

const formatDate = (date) => {
  if (!date) return ''

  const d = new Date(date)

  const datePart = d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })

  const timePart = d.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  })

  return `${datePart} (${timePart})`
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

const closeHhModal = () => {
  showHhModal.value = false
}

const handleHeadHunterAuth = async () => {
  showHhModal.value = false
  await goToHeadHunter()
}

const goToHeadHunter = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (!token) {
      clearAuthStorage()
      return
    }

    const { data } = await axios.get(
        proxy.$locale + "/v1/hh-accounts/authorize",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
    )

    if (data?.url) {
      window.open(data.url, "_blank")
    }
  } catch (error) {
    console.error("❌ HH Auth error:", error.response?.data || error.message)
    if (error.response?.status === 401) {
      clearAuthStorage()
    }
  }
}
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
