<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="w-full max-w-md bg-white text-black rounded-lg shadow-lg p-6">

      <div class="text-center mb-6">
        <img src="https://www.inter-ai.uz/Logo1.svg" alt="Inter-AI" class="h-8 mx-auto mb-4">
      </div>

      <!-- Progress bar -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${(currentStep / 2) * 100}%` }"
            ></div>
          </div>
        </div>
        <p class="text-center text-sm text-gray-500">{{ translations.Step }} {{ currentStep }} {{translations.from}} 2</p>
      </div>

      <!-- Step 1 -->
      <div v-if="currentStep === 1" class="space-y-6">
        <h2 class="text-xl font-medium text-center text-gray-800 mb-6">{{ translations.tell_us_about_yourself }}</h2>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{translations.name}}</label>
            <input
                v-model="formData.firstName"
                type="text"
                class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="Ismoil"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{translations.surname}}</label>
            <input
                v-model="formData.lastName"
                type="text"
                class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="Usmonov"
            >
          </div>
        </div>
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
            Telefon raqam
          </label>
          <input
              ref="phoneInput"
              id="phone"
              type="tel"
              v-model="formData.phone"
              class="w-full px-3 py-2 bg-gray-100 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="901234567"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ translations.password }}</label>
            <div class="relative">
              <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model.trim="formData.password"
                  autocomplete="new-password"
                  required
                  minlength="6"
                  class="w-full px-3 py-2 pr-10 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  placeholder="••••••••"
                  @blur="touched.password = true"
              />
              <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                        d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 5 12 5s8.577 2.51 9.964 6.678c.07.214.07.45 0 .644C20.577 16.49 16.64 19 12 19S3.423 16.49 2.036 12.322z"/>
                  <circle cx="12" cy="12" r="3" stroke-width="1.8"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                        d="M3 3l18 18M10.584 10.59A3 3 0 0113.41 13.41M9.88 5.1A8.966 8.966 0 0112 5c4.64 0 8.577 2.51 9.964 6.678.07.214.07.45 0 .644-.46 1.404-1.24 2.642-2.26 3.66M6.62 6.62C4.88 7.54 3.45 9.03 2.036 12.322a1.012 1.012 0 000 .644C3.423 16.49 7.36 19 12 19c1.33 0 2.6-.2 3.78-.58"/>
                </svg>
              </button>
            </div>
            <p v-if="touched.password && !valid.password" class="mt-1 text-xs text-red-600">
              Parol kamida 6 ta belgidan iborat bo‘lsin
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{translations.confirm_password}}</label>
            <input
                id="confirm_password"
                :type="showPassword ? 'text' : 'password'"
                v-model.trim="formData.confirm_password"
                autocomplete="new-password"
                required
                minlength="6"
                class="w-full px-3 py-2 pr-10 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="••••••••"
                @blur="touched.confirm_password = true"
            />
            <p v-if="touched.confirm_password && !valid.confirm" class="mt-1 text-xs text-red-600">
              Parollar mos kelmadi
            </p>
          </div>
        </div>

        <button
            @click="nextStep"
            :disabled="!isStepValid()"
            :class="[
          'w-full py-3 rounded-md font-medium transition-colors',
          isStepValid()
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
        ]"
        >
          {{ translations.next }}
        </button>
      </div>

      <!-- Step 2 -->
      <div v-if="currentStep === 2" class="space-y-6">
        <h2 class="text-xl font-medium text-center text-gray-800 mb-6">
          {{ translations.Upload_your_resume }}
        </h2>

        <!-- Resume Text -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{
              translations.Enter_your_resume_text
            }}</label>
          <input
              v-model="formData.resumeText"
              class="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Php Laravel Vue.js Full stack developer"
          />
        </div>

        <div class="text-center text-gray-500">{{ translations.or }}</div>

        <label class="block text-sm font-medium text-gray-700 mb-2">{{
            translations.Upload_your_resume_file
          }}</label>
        <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
        >
          <input
              id="resumeUpload"
              type="file"
              class="hidden"
              @change="handleFileUpload"
          />
          <label for="resumeUpload" class="block cursor-pointer">
            <span
                class="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              {{ translations.select_file }}
            </span>
          </label>
        </div>

        <!-- Agar fayl mavjud bo‘lsa preview -->
        <div v-if="formData.resumeFileUrl" class="mt-4 text-center">
          <p class="text-sm text-gray-600 mb-2">
            {{ translations.selected_file }}:
          </p>
          <a
              :href="formData.resumeFileUrl"
              target="_blank"
              class="text-blue-500 underline"
          >📄 {{ formData.resumeFile?.name || 'Old resume file' }}</a
          >
        </div>

        <div class="flex gap-3">
          <button
              @click="prevStep"
              class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            {{ translations.back }}
          </button>
          <button
              @click="completeRegistration"
              :disabled="!isStepValid() || btnLoading"
              :class="[
          'flex-1 py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2',
          (!isStepValid() || btnLoading)
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        ]"
          >
        <span
            v-if="btnLoading"
            class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
        ></span>
            <span>{{
                btnLoading ? translations.loading : translations.finish
              }}</span>
          </button>
        </div>
      </div>

      <p class="mt-6 text-center text-sm text-gray-500">
        {{translations.Do_you_have_an_account}}
        <RouterLink to="/login" class="text-blue-600 hover:underline">{{ translations.login }}</RouterLink>
      </p>

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
  <LoadingModal :show="showLoading" />
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

const { proxy } = getCurrentInstance()
const { translations } = useI18n()
const router = useRouter()
const showLoading = ref(false)

const currentStep = ref(1)

const formData = reactive({
  firstName: '',
  lastName: '',
  password: '',
  confirm_password: '',
  phone: '',
  resumeText: '',
})

const selectedFile = ref(null)
const showPassword = ref(false)
const loading = ref(false)
const btnLoading = ref(false)
const error = ref("")

const isSuccess = (resp) => {
  if (!resp) return false
  const s = resp.status
  return s === true || s === 'success' || s === 'ok'
}

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0]
}
const uploadResume = async (token) => {
  if (!selectedFile.value) return

  const resumeForm = new FormData()
  resumeForm.append("title", formData.resumeText)
  resumeForm.append("file", selectedFile.value)

  await axios.post(proxy.$locale + "/v1/resumes", resumeForm, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })
}

const touched = reactive({
  firstName: false,
  lastName: false,
  password: false,
  confirm_password: false,
})

const valid = reactive({
  get password() {
    return formData.password.length >= 6
  },
  get confirm() {
    return formData.confirm_password.length >= 6 && formData.confirm_password === formData.password
  },
  get names() {
    return formData.firstName.trim().length > 0 && formData.lastName.trim().length > 0
  },
})

const isValid = computed(() => valid.password && valid.confirm && valid.names)

const isStepValid = () => {
  if (currentStep.value === 1) {
    return (
        formData.firstName &&
        formData.lastName &&
        formData.phone &&
        formData.password &&
        formData.confirm_password &&
        formData.password === formData.confirm_password
        // && formData.birth_date
    )
  }
  if (currentStep.value === 2) {
    return formData.resumeText?.trim().length > 0
  }
  return false
}

const nextStep = async () => {
  error.value = null
  if (!isStepValid()) return

  if (currentStep.value === 1) {
    currentStep.value++
  }
}


const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const submitRegistration = async () => {
  touched.firstName = true
  touched.lastName = true
  touched.password = true
  touched.confirm_password = true
  error.value = ''
  showLoading.value = true

  if (!isValid.value || !isStepValid()) {
    return
  }

  loading.value = true
  const chatId = localStorage.getItem("chat_id");
  try {
    const { data } = await axios.post(proxy.$locale + '/auth/register', {
      first_name: formData.firstName,
      last_name: formData.lastName,
      password: formData.password,
      phone: formData.phone,
      resume_text: formData.resumeText,
      chat_id: chatId,
    })

    console.log('✅ Registration success:', data)

    if (isSuccess(data)) {
      const storage = localStorage
      storage.setItem('token', data.data.token)
      storage.setItem('user', JSON.stringify(data.data.user))
      storage.setItem('expires_at', data.data.expires_at)

      try {
        await uploadResume(data.data.token)
      } catch (e) {
        console.warn('Resume upload failed:', e)
      }

      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      await axios.post(
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

      router.push({ name: 'home' })
    } else {
      error.value = data.message || "Ro‘yxatdan o‘tishda xatolik yuz berdi."
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Server bilan bog‘lanishda xatolik.'
  } finally {
    showLoading.value = false
    loading.value = false
  }
}

const completeRegistration = async () => {
  touched.firstName = true
  touched.lastName = true
  touched.password = true
  touched.confirm_password = true
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

onMounted(() => {
  if (phoneInput.value) {
    intlTelInput(phoneInput.value, {
      initialCountry: "uz",
      onlyCountries: ["uz"],      // faqat O‘zbekiston
      preferredCountries: ["uz"], // ixtiyoriy, lekin foydali
      allowDropdown: false,       // dropdownni o‘chiradi
      separateDialCode: true,
      nationalMode: false,
    });
  }
});
</script>

