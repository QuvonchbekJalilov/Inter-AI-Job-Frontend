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

        <!-- Category Select Only -->
        <div class="category-selection-wrapper">
          <div class="form-group">
            <label class="form-label">
              Kategoriyani tanlang
            </label>
            <el-select
                v-model="formData.selectedCategory"
                placeholder="-- Kategoriyani tanlang --"
                size="large"
                class="w-full category-select"
                clearable
            >
              <el-option
                  v-for="category in categories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
              >
                <span class="option-text">{{ category.name }}</span>
              </el-option>
            </el-select>
          </div>
        </div>

        <!-- Offer Section -->
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
import { Check } from '@element-plus/icons-vue'
import { toast } from "vue3-toastify"
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import Offer from "@/components/Offer.vue";

const { proxy } = getCurrentInstance()
const { translations } = useI18n()
const router = useRouter()
const showLoading = ref(false)

const formData = reactive({
  firstName: '',
  phone: '',
  selectedCategory: '',
  // selectedSubcategories: [],
})

const acceptedOffer = ref(false)
const btnLoading = ref(false)

//  9 ta kategoriya va ularning bolalari
const categories = ref([
  {
    id: 1,
    name: 'IT and Software Development',
    subcategories: [
      // Backend — PHP
      { id: 101, name: 'PHP' },
      { id: 102, name: 'Laravel' },
      { id: 103, name: 'Symfony' },
      { id: 104, name: 'Yii2' },
    ]
  },
  {
    id: 2,
    name: 'Marketing and Advertising',
    subcategories: [
      // Digital Marketing
      { id: 201, name: 'Digital Marketing Specialist' },
      { id: 202, name: 'SMM (Social Media Manager)' },
      { id: 203, name: 'Targeting Specialist' },
      { id: 204, name: 'Performance Marketing Specialist' },
      { id: 205, name: 'SEO Specialist' },
      { id: 206, name: 'SEM / PPC Specialist (Google Ads, Yandex Ads)' },
      { id: 207, name: 'ASO Specialist (App Store Optimization)' },
    ]
  },
  {
    id: 3,
    name: 'Administration and Office Support',
    subcategories: [
      // Administrative Roles
      { id: 301, name: 'Administrator' },
      { id: 302, name: 'Office Manager' },
      { id: 303, name: 'Administrative Assistant' },
      { id: 304, name: 'Executive Assistant' },
      { id: 305, name: 'Personal Assistant (PA)' },
    ]
  },

  {
    id: 4,
    name: 'Sales and Customer Relations',
    subcategories: [
      // Sales roles
      { id: 401, name: 'Sales Manager' },
      { id: 402, name: 'Sales Representative' },
      { id: 403, name: 'Key Account Manager' },
      { id: 404, name: 'Business Development Manager' },
    ]
  },
  {
    id: 5,
    name: 'Logistics and Supply Chain',
    subcategories: [
      // Dispatching / Trucking
      { id: 501, name: 'Dispatch Specialist' },
      { id: 502, name: 'ELD Specialist' },
      { id: 503, name: 'Safety Specialist' },
    ]
  },

  {
    id: 6,
    name: 'Customer Support and Call Center',
    subcategories: [
      // Call Center
      { id: 601, name: 'Call Operator' },
      { id: 602, name: 'Inbound Call Specialist' },
      { id: 603, name: 'Outbound Call Specialist' },
    ]
  },
  {
    id: 7,
    name: 'Human Resources and Recruitment (HR)',
    subcategories: [
      // Recruitment
      { id: 701, name: 'HR Recruiter' },
      { id: 702, name: 'Talent Acquisition Specialist' },
      { id: 703, name: 'Sourcing Specialist' },
    ]
  },

  {
    id: 8,
    name: 'Product and Project Management',
    subcategories: [
      // Project Management
      { id: 801, name: 'Project Manager' },
      { id: 802, name: 'Program Manager' },
      { id: 803, name: 'Project Coordinator' },
      { id: 804, name: 'PMO Specialist' },
    ]
  },
  {
    id: 9,
    name: 'Finance and Accounting',
    subcategories: [
      // Accounting
      { id: 901, name: 'Accountant (Buxgalter)' },
      { id: 902, name: 'Chief Accountant' },
      { id: 903, name: 'Bookkeeper' },
      { id: 904, name: 'Payroll Specialist' },
    ]
  }
])

// const getSubcategories = () => {
//   const category = categories.value.find(cat => cat.id === parseInt(formData.selectedCategory))
//   return category?.subcategories || []
// }
//
// const getSelectedCategoryName = () => {
//   const category = categories.value.find(cat => cat.id === parseInt(formData.selectedCategory))
//   return category?.name || ''
// }
//
// const handleCategoryChange = () => {
//   // Kategoriya o'zgarganda subcategorylarni tozalash
//   formData.selectedSubcategories = []
// }

const loading = ref(false)
const error = ref("")
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
      formData.selectedCategory !== '' &&  // Faqat kategoriya tekshiriladi
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
      // router.push({ name: 'home' })
      // window.location.href = "/";
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

  if (!categoryId) {
    console.error("Category tanlanmadi ❌")
    return
  }

  const category = categories.value.find(cat => cat.id === parseInt(categoryId))
  const categoryName = category?.name

  const payload = {
    category: categoryName,
    title: categoryName  // Yoki boshqa default qiymat
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
      console.log("Resume successfully uploaded ✅")
    } else {
      await deleteUserIfNoResume(token)
    }
  } catch (error) {
    console.error("Resume upload failed ❌", error)
    await deleteUserIfNoResume(token)
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
.category-selection-wrapper {
  max-width: 100%;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.w-full {
  width: 100%;
}

/* Category Select Custom Styles */
:deep(.category-select) {
  --el-select-border-color-hover: #3b82f6;
  --el-select-input-focus-border-color: #3b82f6;
}

:deep(.category-select .el-input__wrapper) {
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: all 0.3s ease;
}

:deep(.category-select .el-input__wrapper:hover) {
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

:deep(.category-select .el-input__wrapper.is-focus) {
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

/* Subcategory Select Custom Styles */
:deep(.subcategory-select) {
  --el-select-border-color-hover: #10b981;
  --el-select-input-focus-border-color: #10b981;
}

:deep(.subcategory-select .el-input__wrapper) {
  background: linear-gradient(to right, #f0fdf4, #fefce8);
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: all 0.3s ease;
}

:deep(.subcategory-select .el-input__wrapper:hover) {
  background: linear-gradient(to right, #dcfce7, #fef9c3);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

:deep(.subcategory-select .el-input__wrapper.is-focus) {
  background: #ffffff;
  box-shadow: 0 0 0 3px rgb(16 185 129 / 0.1);
}

/* Option Text Styles */
.option-text {
  font-size: 14px;
  color: #1f2937;
}

/* Selected Tags Styling */
:deep(.el-tag) {
  border-radius: 6px;
  font-weight: 500;
}

/* Selected Count Badge */
.selected-count {
  margin-top: 12px;
  display: flex;
  align-items: center;
}

.selected-count .mr-1 {
  margin-right: 4px;
}

/* Dropdown Panel Custom Styles */
:deep(.el-select-dropdown__item) {
  padding: 12px 20px;
  transition: all 0.2s ease;
}

:deep(.el-select-dropdown__item:hover) {
  background-color: #f3f4f6;
}

:deep(.el-select-dropdown__item.is-selected) {
  background-color: #dbeafe;
  color: #1e40af;
  font-weight: 500;
}

/* Scrollbar Styling */
:deep(.el-select-dropdown__wrap) {
  max-height: 300px;
}

:deep(.el-select-dropdown__wrap::-webkit-scrollbar) {
  width: 6px;
}

:deep(.el-select-dropdown__wrap::-webkit-scrollbar-thumb) {
  background-color: #d1d5db;
  border-radius: 3px;
}

:deep(.el-select-dropdown__wrap::-webkit-scrollbar-thumb:hover) {
  background-color: #9ca3af;
}
</style>
