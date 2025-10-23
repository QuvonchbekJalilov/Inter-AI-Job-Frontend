<template>
  <div class="min-h-screen bg-[#f2f2f2]">
    <Header />
    <VacancyShow :show="loadingSkeleton" />
    <div
        v-if="vacancy"
        class="max-w-5xl pt-[110px] mx-auto p-6 bg-white rounded-2xl shadow space-y-6"
    >
      <div>
        <div class="flex items-start justify-between mb-2">
          <h3 class="mb-2 mt-5 text-xl leading-tight font-medium">{{ vacancy.name }}</h3>
          <!-- Telegram icon -->
          <img
              src="/HeadHunter_logo.png"
              alt="Telegram"
              class="w-6 h-6 mt-5 object-contain ml-2 shrink-0"
          />
        </div>
        <p class="text-gray-700 font-medium">{{ vacancy.employer?.name }}</p>
        <p class="text-gray-500">{{ vacancy.area?.name }}</p>
      </div>

      <div v-if="vacancy.salary" class="p-4 bg-gray-50 rounded-lg">
        <p class="text-lg font-medium text-green-700">
          {{ formatSalary(vacancy.salary) }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 border rounded-lg">
          <p class="text-sm text-gray-500">{{ translations.Schedule }}</p>
          <p class="font-medium">{{ vacancy.schedule?.name }}</p>
        </div>
        <div class="p-4 border rounded-lg">
          <p class="text-sm text-gray-500">{{ translations.Type_of_employment }}</p>
          <p class="font-medium">{{ vacancy.employment?.name }}</p>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-medium mb-2">{{ translations.Job_Description }}</h2>
        <div class="text-gray-600 prose max-w-none" v-html="vacancy.description"></div>
      </div>

      <div class="bg-gray-50 rounded-lg text-center">
        <p class="text-sm text-gray-500">{{ translations.Published }}</p>
        <p class="font-medium">{{ formatDate(vacancy.published_at) }}</p>
      </div>

      <div>
        <button
            v-if="vacancy"
            :disabled="status"
            @click="openCoverLetterModal(vacancy)"
            class="block w-full py-3 rounded-lg text-white font-medium text-center"
            :class="status
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700'"
        >
          {{ translations.reply }}
        </button>
      </div>
    </div>
  </div>
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
  <Transition name="fade">
    <div
        v-if="showCoverModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div
          class="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl relative overflow-hidden"
      >
        <h2 class="text-xl font-semibold mb-4">Cover Letter</h2>

        <div v-if="coverLatterLoading" class="space-y-3 animate-pulse">
          <div class="h-5 bg-gray-200 rounded w-1/3"></div>
          <div class="h-24 bg-gray-200 rounded"></div>
          <div class="h-24 bg-gray-200 rounded"></div>
          <div class="h-5 bg-gray-200 rounded w-1/2"></div>
        </div>

        <div v-else>
          <textarea
              v-model="coverLetter"
              rows="8"
              class="w-full border rounded-xl p-3 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Bu yerda sizning cover letterningiz bo‘ladi..."
          ></textarea>

          <div class="flex justify-end gap-3 mt-4">
            <button
                class="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                @click="showCoverModal = false"
            >
              Bekor qilish
            </button>

            <button
                class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                @click="handleCoverLetterSubmit"
            >
              <svg
                  v-if="coverLatterLoadingSubmit"
                  class="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
              >
                <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                ></circle>
                <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>Tasdiqlash va Yuborish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <LoadingModal :show="showLoading" />
</template>

<script setup>
import {ref, onMounted, getCurrentInstance, computed} from "vue"
import { useRoute } from "vue-router"
import Header from "@/components/Header.vue"
import { useI18n } from "@/i18n-lite"
import LoadingModal from "@/components/modal/LodaingModal.vue";
import VacancyShow from "@/components/loading/VacancyShow.vue";
import {toast} from "vue3-toastify";
const { proxy } = getCurrentInstance()

const { translations } = useI18n()
const route = useRoute()
const vacancyId = route.params.id
const vacancy = ref(null)
const status = ref(null)
const showLoading = ref(false);
const loadingSkeleton = ref(true);
const showHhModal = ref(false);
const showCoverModal = ref(false);
const coverLatterLoading = ref(false);
const coverLatterLoadingSubmit = ref(false);
const coverLetter = ref("");
const selectedVacancy = ref(null);
const user = ref(null)
const hhAccountActive = computed(() => !!user.value?.hh_account_status)

const applyToVacancy = async (vacancyId) => {
  try {
    if (!hhAccountActive.value) {
      showHhModal.value = true
      return
    }

    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    const res = await fetch(
        proxy.$locale + `/v1/hh/vacancies/${vacancyId}/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({}) // bo'sh body
        }
    )

    if (!res.ok) throw new Error(`HTTP error! ${res.status}`)

    const data = await res.json()
    //console.log("✅ Apply javobi:", data)

    if (data.success) {
      status.value = true
      vacancy.value.status = true
      toast.success("Muvaffaqiyatli yuborildi ✅")
    }

  } catch (e) {
    console.error("❌ Apply error:", e.message)
    toast.error(
        "Xatolik: " + (e?.response?.data?.message || e.message)
    )
  }
}

const openCoverLetterModal = async (vacancyItem) => {
  if (!vacancyItem) return

  selectedVacancy.value = vacancyItem
  showCoverModal.value = true
  coverLatterLoading.value = true

  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (!token) {
      coverLetter.value = ""
      return
    }

    const res = await fetch(
        `${proxy.$locale}/v1/cover-letter`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
    )

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()
    coverLetter.value = data.cover_letter || ""
  } catch (e) {
    console.error("❌ Cover letter get error:", e.message)
    toast.error("Cover letterni yuklab bo‘lmadi")
  } finally {
    coverLatterLoading.value = false
  }
}

const handleCoverLetterSubmit = async () => {
  if (!selectedVacancy.value) return

  try {
    coverLatterLoadingSubmit.value = true
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (!token) {
      clearAuthStorage()
      return
    }

    const res = await fetch(
        `${proxy.$locale}/v1/cover-letter`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ cover_letter: coverLetter.value })
        }
    )

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    toast.success("Cover letter yangilandi ✅")

    showCoverModal.value = false
    await applyToVacancy(selectedVacancy.value.id)
  } catch (e) {
    console.error("❌ Cover letter update error:", e.message)
    toast.error("Cover letterni saqlashda xatolik yuz berdi")
  } finally {
    coverLatterLoadingSubmit.value = false
  }
}

const fetchVacancy = async () => {
  try {
    showLoading.value = true
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    const res = await fetch(
        proxy.$locale + `/v1/hh/vacancies/${vacancyId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
    )

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()
    vacancy.value = data.data.raw
    status.value = data.data.status
   // console.log("✅ Vacancy:", data.data)
  } catch (e) {
    showLoading.value = false
    console.error("❌ API error:", e.message)
  } finally {
    showLoading.value = false
    loadingSkeleton.value = false
  }
}

const fetchUser = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (!token) return

    const res = await fetch(
        proxy.$locale + "/auth/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
    )

    if (res.status === 401) {
      clearAuthStorage()
      return
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()
    user.value = data.data
  } catch (e) {
    console.error("❌ User fetch error:", e.message)
  }
}

const clearAuthStorage = () => {
  localStorage.removeItem("user")
  localStorage.removeItem("expires_at")
  localStorage.removeItem("token")
  sessionStorage.removeItem("token")
  sessionStorage.removeItem("user")
  sessionStorage.removeItem("expires_at")
  window.location.href = "/register"
}

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

    const res = await fetch(
        proxy.$locale + "/v1/hh-accounts/authorize",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
    )

    if (res.status === 401) {
      clearAuthStorage()
      return
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()
    if (data?.url) {
      window.open(data.url, "_blank")
    }
  } catch (e) {
    console.error("❌ HH Auth error:", e.message)
  }
}

onMounted(async () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token")

  if (!token) {
    console.warn("⚠️ Token topilmadi, foydalanuvchi login qilmagan.")
    return
  }

  await fetchUser()
  await fetchVacancy()
})


const formatSalary = (salary) => {
  if (!salary) return "-"
  let text = ""
  if (salary.from) text += `от ${salary.from}`
  if (salary.to) text += (salary.from ? " до " : "до ") + salary.to
  if (salary.currency) text += ` ${salary.currency}`
  if (salary.gross === false) text += " (на руки)"
  else if (salary.gross === true) text += " (до вычета налогов)"
  return text
}

const formatDate = (dateStr) => {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
</script>
