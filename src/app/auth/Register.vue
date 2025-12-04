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
        <div class="category-selection-wrapper">
          <!-- Category Select -->
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
                @change="handleCategoryChange"
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

          <!-- Subcategory Multi-Select -->
          <div v-if="formData.selectedCategory && getSubcategories().length > 0" class="form-group">
            <label class="form-label">
              {{ getSelectedCategoryName() }} uchun bo'limlarni tanlang
            </label>
            <el-select
                v-model="formData.selectedSubcategories"
                multiple
                collapse-tags
                collapse-tags-tooltip
                :max-collapse-tags="3"
                placeholder="Bo'limlarni tanlang"
                size="large"
                class="w-full subcategory-select"
                clearable
            >
              <el-option
                  v-for="subcategory in getSubcategories()"
                  :key="subcategory.id"
                  :label="subcategory.name"
                  :value="subcategory.id"
              >
                <span class="option-text">{{ subcategory.name }}</span>
              </el-option>
            </el-select>

            <!-- Selected Count Badge -->
            <div v-if="formData.selectedSubcategories.length > 0" class="selected-count">
              <el-tag type="success" effect="plain" round>
                <el-icon class="mr-1"><Check /></el-icon>
                Tanlangan: {{ formData.selectedSubcategories.length }}
              </el-tag>
            </div>
          </div>
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
      // Backend — PHP
      { id: 101, name: 'PHP' },
      { id: 102, name: 'Laravel' },
      { id: 103, name: 'Symfony' },
      { id: 104, name: 'Yii2' },

      // Backend — Python
      { id: 105, name: 'Python' },
      { id: 106, name: 'Django' },
      { id: 107, name: 'Flask' },
      { id: 108, name: 'FastAPI' },

      // Backend — Java
      { id: 109, name: 'Java' },
      { id: 110, name: 'Spring Boot' },

      // Backend — .NET
      { id: 111, name: '.NET' },
      { id: 112, name: 'C#' },
      { id: 113, name: 'ASP.NET' },

      // Backend — JavaScript
      { id: 114, name: 'Node.js' },
      { id: 115, name: 'Express.js' },
      { id: 116, name: 'NestJS' },

      // Backend — Go
      { id: 117, name: 'GoLang' },

      // Frontend
      { id: 118, name: 'JavaScript' },
      { id: 119, name: 'TypeScript' },
      { id: 120, name: 'React' },
      { id: 121, name: 'Vue.js' },
      { id: 122, name: 'Angular' },
      { id: 123, name: 'Next.js' },
      { id: 124, name: 'Nuxt.js' },

      // Mobile
      { id: 125, name: 'Flutter' },
      { id: 126, name: 'React Native' },
      { id: 127, name: 'Kotlin' },
      { id: 128, name: 'Swift' },

      // QA & Testing
      { id: 129, name: 'QA Manual' },
      { id: 130, name: 'QA Automation' },
      { id: 131, name: 'Selenium' },
      { id: 132, name: 'Cypress' },

      // Cyber Security
      { id: 133, name: 'SOC Analyst' },
      { id: 134, name: 'Pentesting' },
      { id: 135, name: 'Ethical Hacking' },

      // DevOps
      { id: 136, name: 'Docker' },
      { id: 137, name: 'Kubernetes' },
      { id: 138, name: 'Linux Administration' },
      { id: 139, name: 'Nginx, Apache2' },
      { id: 140, name: 'Terraform' },

      // Data
      { id: 141, name: 'Data Science' },
      { id: 142, name: 'Machine Learning' },
      { id: 143, name: 'AI Engineering' },

      // Game Dev
      { id: 144, name: 'Unity' },
      { id: 145, name: 'Unreal Engine' },

      // Blockchain
      { id: 146, name: 'Blockchain Developer' },
      { id: 147, name: 'Solidity' },

      // Design
      { id: 148, name: 'UI/UX Design' },
      { id: 149, name: 'Branding' },
      { id: 150, name: 'Web Design' },
      { id: 151, name: 'Graphic Design' },
      { id: 152, name: 'Logo Design' },
      { id: 153, name: 'Illustration' },

      // Cloud
      { id: 154, name: 'AWS' },
      { id: 155, name: 'Azure' },
      { id: 156, name: 'GCP' },

      // Database
      { id: 157, name: 'Database Administrator (DBA)' },
      { id: 158, name: 'MySQL' },
      { id: 159, name: 'PostgreSQL' },
      { id: 160, name: 'MongoDB' },
      { id: 161, name: 'Redis' },

      // System Engineering
      { id: 162, name: 'System Architect' },
      { id: 163, name: 'System Engineer' },

      // IoT / Embedded
      { id: 164, name: 'Embedded Systems' },
      { id: 165, name: 'IoT Developer' }
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
      { id: 208, name: 'Email Marketing Specialist' },
      { id: 209, name: 'Marketing Analyst' },

      // Content / Creative
      { id: 210, name: 'Content Creator' },
      { id: 211, name: 'Content Manager' },
      { id: 212, name: 'Copywriter' },
      { id: 213, name: 'Creative Director' },
      { id: 214, name: 'Scriptwriter (Reklama / Video)' },

      // Brand & Communication
      { id: 215, name: 'Brand Manager' },
      { id: 216, name: 'PR Manager' },
      { id: 217, name: 'Communication Specialist' },
      { id: 218, name: 'Influencer Marketing Manager' },
      { id: 219, name: 'Community Manager' },

      // Advertising / Media
      { id: 220, name: 'Media Buyer' },
      { id: 221, name: 'Media Planner' },
      { id: 222, name: 'Advertising Manager' },

      // Strategic / Management
      { id: 223, name: 'Marketing Manager' },
      { id: 224, name: 'Marketing Director (CMO)' },
      { id: 225, name: 'Product Marketing Specialist' },

      // Offline / Event
      { id: 226, name: 'Event Manager' },
      { id: 227, name: 'Trade Marketing Specialist' },
      { id: 228, name: 'Merchandiser' }
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

      // Front Desk / Coordination
      { id: 306, name: 'Receptionist' },
      { id: 307, name: 'Front Desk Coordinator' },
      { id: 308, name: 'Customer Service Representative' },

      // IT & System Support
      { id: 309, name: 'System Administrator' },
      { id: 310, name: 'IT Administrator' },
      { id: 311, name: 'Technical Support Specialist' },
      { id: 312, name: 'Help Desk Specialist' },

      // Documentation & Operations
      { id: 313, name: 'Documentation Specialist' },
      { id: 314, name: 'Data Entry Specialist' },
      { id: 315, name: 'Office Coordinator' },
      { id: 316, name: 'Operations Assistant' },

      // HR & Internal Support
      { id: 317, name: 'HR Assistant' },
      { id: 318, name: 'Recruitment Assistant' },
      { id: 319, name: 'Payroll Assistant' }
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
      { id: 405, name: 'Commercial Manager' },
      { id: 406, name: 'Field Sales Specialist' },
      { id: 407, name: 'Retail Sales Specialist' },
      { id: 408, name: 'TeleSales Manager' },
      { id: 409, name: 'TeleSales Operator' },

      // Customer Relations
      { id: 410, name: 'Customer Success Manager' },
      { id: 411, name: 'Client Manager' },
      { id: 412, name: 'Customer Support Specialist' },
      { id: 413, name: 'Call Center Specialist' },

      // Pre-Sales / Technical Sales
      { id: 414, name: 'Pre-Sales Engineer' },
      { id: 415, name: 'Technical Sales Specialist' },

      // Construction / Interior Sales
      { id: 416, name: 'Constructor (Commercial Offers / Calculations)' },
      { id: 417, name: 'Estimator / Sales Estimator' }
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
      { id: 504, name: 'Fleet Manager' },
      { id: 505, name: 'Driver Recruiter' },

      // Planning & Coordination
      { id: 506, name: 'Logistics Coordinator' },
      { id: 507, name: 'Route Planner' },
      { id: 508, name: 'Freight Broker' },
      { id: 509, name: 'Customs Specialist' },
      { id: 510, name: 'Update Specialist' },

      // Warehouse & Supply Chain
      { id: 511, name: 'Warehouse Manager' },
      { id: 512, name: 'Warehouse Worker' },
      { id: 513, name: 'Supply Chain Manager' },
      { id: 514, name: 'Inventory Specialist' },
      { id: 515, name: 'Procurement Specialist' },

      // Delivery / Transport
      { id: 516, name: 'Logistics Manager' },
      { id: 517, name: 'Transport Coordinator' },
      { id: 518, name: 'Import/Export Specialist' }
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
      { id: 604, name: 'Call Center Agent' },
      { id: 605, name: 'Call Center Supervisor' },
      { id: 606, name: 'Call Center Manager' },

      // Customer Support
      { id: 607, name: 'Customer Support Specialist' },
      { id: 608, name: 'Customer Service Representative' },
      { id: 609, name: 'Client Relationship Specialist' },

      // Helpdesk / Technical Support
      { id: 610, name: 'Helpdesk Agent' },
      { id: 611, name: 'Technical Support Specialist' },
      { id: 612, name: 'Support Specialist' },

      // Cashier & Retail Service
      { id: 613, name: 'Cashier / Sales Assistant (Кассир-сотувчи)' }
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

      // HR Management
      { id: 704, name: 'HR Manager' },
      { id: 705, name: 'HR Director (HRD)' },
      { id: 706, name: 'HR Business Partner' },
      { id: 707, name: 'HR Generalist' },

      // Employee Relations / Development
      { id: 708, name: 'Training & Development Specialist' },
      { id: 709, name: 'Employee Relations Specialist' },
      { id: 710, name: 'Onboarding Specialist' },

      // Payroll & C&B
      { id: 711, name: 'Compensation & Benefits Specialist' },
      { id: 712, name: 'Payroll Specialist' },

      // HR Operations
      { id: 713, name: 'HR Coordinator' },
      { id: 714, name: 'HR Assistant' }
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
      { id: 805, name: 'Scrum Master' },
      { id: 806, name: 'Agile Coach' },

      // Product Management
      { id: 807, name: 'Product Manager' },
      { id: 808, name: 'Product Owner' },
      { id: 809, name: 'Product Analyst' },

      // Business roles
      { id: 810, name: 'Business Analyst' },
      { id: 811, name: 'Business Development Manager' },
      { id: 812, name: 'Commercial Director' },

      // Additional related roles
      { id: 813, name: 'Technical Project Manager' },
      { id: 814, name: 'Delivery Manager' }
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

      // Finance
      { id: 905, name: 'Finance Specialist' },
      { id: 906, name: 'Financial Analyst' },
      { id: 907, name: 'Finance Manager' },
      { id: 908, name: 'Financial Controller' },
      { id: 909, name: 'Treasury Specialist' },
      { id: 910, name: 'Risk Manager' },

      // Audit & Tax
      { id: 911, name: 'Auditor' },
      { id: 912, name: 'Internal Auditor' },
      { id: 913, name: 'Tax Consultant' },

      // Senior Executive
      { id: 914, name: 'Chief Financial Officer (CFO) / Финансовый директор' }
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

const handleCategoryChange = () => {
  // Kategoriya o'zgarganda subcategorylarni tozalash
  formData.selectedSubcategories = []
}

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
      formData.selectedCategory !== '' &&
      formData.selectedSubcategories.length > 0 &&  // && bilan o'zgartiring
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
