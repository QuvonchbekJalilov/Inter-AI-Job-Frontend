<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="w-full max-w-md bg-white text-black rounded-lg shadow-lg p-6">

      <div class="text-center mb-6">
        <img src="https://www.inter-ai.uz/Logo1.svg" alt="Inter-AI" class="h-8 mx-auto mb-4">
        <h2 class="text-xl font-medium text-gray-800">{{ translations.tell_us_about_yourself }}</h2>
      </div>

      <div class="space-y-6">
        <!-- Name and Surname -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ translations.name }} {{ translations.surname }}
          </label>
          <input
              v-model="formData.firstName"
              type="text"
              class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="Ismoil Usmonov"
          >
        </div>

        <!-- Phone -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
            {{ translations.phone }}
          </label>
          <input
              ref="phoneInput"
              id="phone"
              type="tel"
              v-model="formData.phone"
              class="w-full px-3 py-2 bg-gray-100 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="33 505 20 05"
          />
        </div>


        <!--  Replaced file upload with category dropdown and multiple select -->
        <!-- Category Selection -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            Kategoriyani tanlang
          </label>
          <select
              id="category"
              v-model="formData.selectedCategory"
              class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer appearance-none"
          >
            <option value="">-- Kategoriyani tanlang --</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Subcategory Multi-Select with Checkboxes -->
        <div v-if="formData.selectedCategory && getSubcategories().length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            {{ getSelectedCategoryName() }} uchun bo'limlarni tanlang
          </label>

          <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div
                v-for="subcategory in getSubcategories()"
                :key="subcategory.id"
                class="flex items-center"
            >
              <input
                  :id="`subcategory-${subcategory.id}`"
                  type="checkbox"
                  :value="subcategory.id"
                  v-model="formData.selectedSubcategories"
                  class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <label
                  :for="`subcategory-${subcategory.id}`"
                  class="ml-3 text-sm text-gray-700 cursor-pointer"
              >
                {{ subcategory.name }}
              </label>
            </div>
          </div>

          <p v-if="formData.selectedSubcategories.length > 0" class="text-xs text-blue-600 mt-2">
            Tanlangan: {{ formData.selectedSubcategories.length }}
          </p>
        </div>

        <div v-else-if="formData.selectedCategory" class="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          Bu kategoriya bo'limlar mavjud emas
        </div>

        <!-- Offer Section (Placeholder) -->
        <Offer v-model="acceptedOffer" :locale="locale" />


        <!-- Submit Button -->
        <button
            @click="completeRegistration"
            :disabled="!isStepValid() || btnLoading || !acceptedOffer"
            :class="[
              'w-full py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2',
              (!isStepValid() || btnLoading || !acceptedOffer)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            ]"
        >
          <span
              v-if="btnLoading"
              class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></span>
          <span>{{ btnLoading ? translations.finish : translations.finish }}</span>
        </button>
      </div>
      <div class="flex items-stretch w-full max-w-md mx-auto gap-2 pt-6">
        <button
            v-for="tab in tabs"
            :key="tab.code"
            @click="changeTab(tab.code)"
            class="tab-btn min-w-0 basis-0 px-3 sm:px-4 rounded-xl transform transition-colors whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-center gap-1"
            :class="isActive(tab.code) ? activeClass : inactiveClass"
            :style="{ flexGrow: isActive(tab.code) ? 2 : 1 }"
        >
        <span
            class="tab-label inline-block leading-tight px-0.5 sm:px-1"
            :class="isActive(tab.code) ? activeTextClass : inactiveTextClass"
        >
          {{ tab.name }}
        </span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useI18n } from '@/i18n-lite.js'
import {ref, reactive, computed, getCurrentInstance, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import axios from "axios"
import LoadingModal from "@/components/modal/LodaingModal.vue";
import { toast } from "vue3-toastify"
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import Offer from "@/components/Offer.vue";

const { proxy } = getCurrentInstance()
const { translations } = useI18n()
const router = useRouter()
const showLoading = ref(false)
const resumeInput = ref(null)

const formData = reactive({
  firstName: '',
  phone: '',
  selectedCategory: '',
  selectedSubcategories: [],
})

const acceptedOffer = ref(false)
const btnLoading = ref(false)

//  9 ta kategoriya va ularning bolalari
const categories = ref([
  {
    id: 1,
    name: 'IT and Software Development',
    subcategories: [
      { id: 101, name: 'Php, Laravel, Yii2' },
      { id: 102, name: 'Python, Django, Flask' },
      { id: 103, name: '.NET, C#, ASP.NET' },
      { id: 104, name: 'Java, Spring Boot' },
      { id: 105, name: 'GoLang' },
      { id: 106, name: 'React, Vue, Angular, JavaScript, TypeScript' },
      { id: 107, name: 'Mobile Development (Flutter, React Native, Kotlin, Swift)' },
      { id: 108, name: 'QA & Testing (Manual, Automation)' },
      { id: 109, name: 'Cyber Security (SOC, Pentesting)' },
      { id: 110, name: 'DevOps (Docker, Kubernetes, Linux, CI/CD)' },
      { id: 111, name: 'Data Science' },
      { id: 112, name: 'Machine Learning / AI Engineer' },
      { id: 113, name: 'Game Development (Unity, Unreal)' },
      { id: 114, name: 'Blockchain Developer' },
      { id: 115, name: 'UI/UX Dizayn' },
      { id: 116, name: 'Graphic Design' },
      { id: 117, name: 'Cloud Specialist (AWS, Azure, GCP)' },
      { id: 118, name: 'Database Administrator (DBA)' },
      { id: 119, name: 'System Architect' },
      { id: 120, name: 'Embedded / IoT Developer' }
    ]
  },

  {
    id: 2,
    name: 'Marketing and Advertising',
    subcategories: [
      { id: 201, name: 'Raqamli Marketing' },
      { id: 202, name: 'SMM' },
      { id: 203, name: 'Targetolog' },
      { id: 204, name: 'SEO Specialist' },
      { id: 205, name: 'Content Creator' },
      { id: 206, name: 'Copywriter' },
      { id: 207, name: 'Brand Manager' },
      { id: 208, name: 'Performance Marketing' },
      { id: 209, name: 'PR Manager' },
      { id: 210, name: 'Influencer Marketing Manager' }
    ]
  },

  {
    id: 3,
    name: 'Administration and Office Support',
    subcategories: [
      { id: 301, name: 'Administrator' },
      { id: 302, name: 'Office Manager' },
      { id: 303, name: 'Receptionist' },
      { id: 304, name: 'System Administrator / IT Admin' },
      { id: 305, name: 'Executive Assistant' },
      { id: 306, name: 'Documentation Specialist' },
      { id: 307, name: 'Technical Support Assistant' }
    ]
  },

  {
    id: 4,
    name: 'Sales and Customer Relations',
    subcategories: [
      { id: 401, name: 'Sotuv Menejeri' },
      { id: 402, name: 'Sales Manager' },
      { id: 403, name: 'Key Account Manager' },
      { id: 404, name: 'Client Manager' },
      { id: 405, name: 'Commercial Manager' },
      { id: 406, name: 'Constructor' },
      { id: 407, name: 'Customer Success Manager' },
      { id: 408, name: 'TeleSales Manager' }
    ]
  },

  {
    id: 5,
    name: 'Logistics and Supply Chain',
    subcategories: [
      { id: 501, name: 'Dispatch Specialist' },
      { id: 502, name: 'Driver Recruiter' },
      { id: 503, name: 'Fleet Specialist' },
      { id: 504, name: 'Logistics Coordinator' },
      { id: 505, name: 'Supply Chain Manager' },
      { id: 506, name: 'Warehouse Manager' },
      { id: 507, name: 'Customs Specialist' },
      { id: 508, name: 'Update Specialist' },
      { id: 509, name: 'ELD Specialist' },
      { id: 510, name: 'Freight Broker' },
      { id: 511, name: 'Route Planner' },
      { id: 512, name: 'Химик R&D' }
    ]
  },

  {
    id: 6,
    name: 'Customer Support and Call Center',
    subcategories: [
      { id: 601, name: 'Call operator' },
      { id: 602, name: 'Кассир-сотувчи' },
      { id: 603, name: 'Менеджер по работе с клиентами' },
      { id: 604, name: 'Support Specialist' },
      { id: 605, name: 'Helpdesk Agent' },
      { id: 606, name: 'Call Center Supervisor' }
    ]
  },

  {
    id: 7,
    name: 'Human Resources and Recruitment (HR)',
    subcategories: [
      { id: 701, name: 'HR рекрутер' },
      { id: 702, name: 'HR Menejeri' },
      { id: 703, name: 'Директор по персоналу (HRD)' },
      { id: 704, name: 'Talent Acquisition Specialist' },
      { id: 705, name: 'Training & Development Specialist' },
      { id: 706, name: 'HR Generalist' },
      { id: 707, name: 'Compensation & Benefits Specialist' }
    ]
  },

  {
    id: 8,
    name: 'Product and Project Management',
    subcategories: [
      { id: 801, name: 'Project Manager' },
      { id: 802, name: 'Product Manager' },
      { id: 803, name: 'Product Owner' },
      { id: 804, name: 'Scrum Master' },
      { id: 805, name: 'Business Analyst' },
      { id: 806, name: 'Business Development Manager' },
      { id: 807, name: 'Commercial Director' }
    ]
  },

  {
    id: 9,
    name: 'Finance and Accounting',
    subcategories: [
      { id: 901, name: 'Financespecialist' },
      { id: 902, name: 'Buxgalter' },
      { id: 903, name: 'Финансовый директор (CFO)' },
      { id: 904, name: 'Auditor' },
      { id: 905, name: 'Financial Analyst' },
      { id: 906, name: 'Tax Consultant' },
      { id: 907, name: 'Payroll Specialist' },
      { id: 908, name: 'Bookkeeper' }
    ]
  }
])

const getSubcategories = () => {
  const category = categories.value.find(cat => cat.id === parseInt(formData.selectedCategory))
  return category?.subcategories || []
}
const getSelectedCategoryName = () => {
  const category = categories.value.find(cat => cat.id === parseInt(formData.selectedCategory))
  return category?.name || ''
}

const loading = ref(false)
const error = ref("")
const selectedFile = ref(null)
const fileError = ref(false)

const isSuccess = (resp) => {
  if (!resp) return false
  const s = resp.status
  return s === true || s === 'success' || s === 'ok'
}

const touched = reactive({
  firstName: false,
})

const valid = reactive({
  get names() {
    return formData.firstName.trim().length > 0
  },
})

const isValid = computed(() => valid.names)

const isStepValid = () => {
  return (
      formData.firstName &&
      formData.phone &&
      formData.selectedCategory !== '' &&
      formData.selectedSubcategories.length > 0,
      !fileError.value
  )
}

const submitRegistration = async () => {
  touched.firstName = true
  error.value = ''
  showLoading.value = true

  if (!isValid.value || !isStepValid()) {
    return
  }

  loading.value = true
  const chatId = localStorage.getItem("chat_id");
  const locale = localStorage.getItem("locale");
  try {
    const { data } = await axios.post(proxy.$locale + '/auth/register', {
      first_name: formData.firstName,
      phone: formData.phone,
      chat_id: chatId,
      language: locale,
    })
    if (!isSuccess(data)) {
      toast.error(
          locale.value === 'uz'
              ? "❗ Ushbu telefon raqami bilan allaqachon ro‘yxatdan o‘tilgan."
              : locale.value === 'ru'
                  ? "❗ Этот номер телефона уже зарегистрирован."
                  : "❗ This phone number is already registered."
      )
      showLoading.value = false
      loading.value = false
      return
    }

    if (isSuccess(data)) {
      const storage = localStorage
      storage.setItem('token', data.data.token)
      storage.setItem('user', JSON.stringify(data.data.user))
      storage.setItem('expires_at', data.data.expires_at)
      storage.setItem('chat_id', chatId)

      try {
        await uploadResume(data.data.token)
      } catch (e) {
        console.warn('Resume upload failed:', e)
      }

      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      const res = await axios.post(
          proxy.$locale + "/v1/vacancy-matches/run",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          }
      )
      if (res.data.status =! 200 || res.data.data.status == false) {
        await deleteUserIfNoResume(token)
      }

      router.push({ name: 'home' })
      window.location.href = "/";
    } else {
      await deleteUserIfNoResume(token)
      error.value = data.message || "Ro‘yxatdan o‘tishda xatolik yuz berdi."
    }
  } catch (e) {
    if (e.response?.status === 422) {
      toast.error(
          locale.value === 'uz'
              ? "❗ Ushbu telefon raqami bilan allaqachon ro‘yxatdan o‘tilgan."
              : locale.value === 'ru'
                  ? "❗ Этот номер телефона уже зарегистрирован."
                  : "❗ This phone number is already registered."
      )
      router.push({ name: 'home' })
      window.location.href = "/";
    } else {
      toast.error(
          locale.value === 'uz'
              ? "❌ Server bilan bog‘lanishda xatolik yuz berdi."
              : locale.value === 'ru'
                  ? "❌ Произошла ошибка при подключении к серверу."
                  : "❌ An error occurred while connecting to the server."
      )
      await deleteUserIfNoResume(token)
      error.value = e.response?.data?.message || 'Server bilan bog‘lanishda xatolik.'
    }
  } finally {
    showLoading.value = false
    loading.value = false
  }
}
const uploadResume = async (token) => {
  const categoryId = formData.selectedCategory
  const selectedSubs = formData.selectedSubcategories

  if (!categoryId || selectedSubs.length === 0) {
    console.error("Category yoki subcategory tanlanmadi ❌")
    return
  }

  const category = categories.value.find(cat => cat.id === parseInt(categoryId))
  const categoryName = category?.name

  const title = category.subcategories
      .filter(sub => selectedSubs.includes(sub.id))
      .map(sub => sub.name)
      .join(", ")

  const payload = {
    category: categoryName,
    title: title
  }

  try {
    const response = await axios.post(
        proxy.$locale + "/v1/resumes",
        payload,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
    )

    if (response.status >= 200 && response.status < 300) {
      console.log("Resume successfully uploaded (category name + title string) ✅")
    } else {
      await deleteUserIfNoResume(token)
    }
  } catch (error) {
    console.error("Resume upload failed ❌", error)
    await deleteUserIfNoResume(token)
  }
}
const deleteUserIfNoResume = async (token) => {
  try {
    const response = await axios.delete(
        proxy.$locale + "/auth/user/self-if-no-resume",
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
    )

    console.log("User deleted:", response.data.message)
  } catch (error) {
    console.error("Failed to delete user:", error)
  }
}


const completeRegistration = async () => {
  touched.firstName = true
  error.value = ''

  if (!isValid.value || !isStepValid()) return

  btnLoading.value = true
  try {
    await submitRegistration()
  } catch (err) {
    console.error("❌ Error:", err)
  } finally {
    btnLoading.value = false
  }
}

const { locale } = useI18n()

const tabs = [
  { code: 'uz', name: 'Uzbek' },
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
]
const changeTab = (code) => {
  locale.value = code
}

const isActive = (code) => locale.value === code

const activeClass = 'bg-blue-600 text-white scale-100 py-2.5'
const inactiveClass = 'bg-gray-100 text-gray-700 hover:bg-gray-200 scale-95 py-2'
const activeTextClass = 'text-[13.5px] sm:text-[14px] scale-100'
const inactiveTextClass = 'text-[11.5px] sm:text-[12px] scale-90'

const phoneInput = ref(null);

onMounted(async () => {
  showLoading.value = true

  const urlParams = new URLSearchParams(window.location.search)
  const chatIdFromUrl = urlParams.get("chat_id")
  const localeFromUrl = urlParams.get("locale") || "uz"

  if (chatIdFromUrl) localStorage.setItem("chat_id", chatIdFromUrl)
  if (localeFromUrl) localStorage.setItem("locale", localeFromUrl)

  const chatId = localStorage.getItem("chat_id")
  const token = localStorage.getItem("token")

  try {
    if (token) {
      console.log("🔍 check-token so‘rov yuborilmoqda...");
      await axios.get(proxy.$locale + "/auth/check-token", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ check-token javob oldi!");
      window.location.href = "/";
      return;
    }

    if (chatId) {
      console.log("💬 Chat ID orqali login:", chatId);
      const res = await axios.post(proxy.$locale + "/auth/chat-id-login", { chat_id: chatId });
      const TOKEN = res.data?.data?.token;

      if (TOKEN) {
        console.log("✅ Chat ID orqali token olindi");
        localStorage.setItem("token", TOKEN);
        window.location.href = "/";
        return;
      }
    }
  } catch (error) {
    console.error("❌ Token yoki chat login xatosi:", error)
    localStorage.removeItem("token")
  } finally {
    showLoading.value = false
  }

  if (phoneInput.value) {
    const iti = intlTelInput(phoneInput.value, {
      initialCountry: "uz",
      onlyCountries: ["uz"],
      preferredCountries: ["uz"],
      allowDropdown: false,
      separateDialCode: true,
      nationalMode: false,
    });

    phoneInput.value.addEventListener("input", () => {
      const digits = phoneInput.value.value.replace(/\D/g, '').slice(0, 9)
      let grouped = ''
      if (digits.length <= 2) grouped = digits
      else if (digits.length <= 5) grouped = `${digits.slice(0,2)} ${digits.slice(2)}`
      else if (digits.length <= 7) grouped = `${digits.slice(0,2)} ${digits.slice(2,5)} ${digits.slice(5)}`
      else grouped = `${digits.slice(0,2)} ${digits.slice(2,5)} ${digits.slice(5,7)} ${digits.slice(7)}`
      formData.phone = grouped
      phoneInput.value.value = grouped
    });
  }
})
</script>


<style scoped>
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 28px;
}

input[type="checkbox"] {
  cursor: pointer;
}
</style>
