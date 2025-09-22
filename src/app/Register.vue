<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="w-full max-w-md bg-white text-black rounded-lg shadow-lg p-6">
      <div class="text-center mb-6">
        <img src="https://www.inter-ai.uz/Logo1.svg" alt="Inter-AI" class="h-8 mx-auto mb-4">
      </div>

      <div class="mb-8">
        <div class="flex justify-between items-center mb-2">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${(currentStep / 4) * 100}%` }"
            ></div>
          </div>
        </div>
        <p class="text-center text-sm text-gray-500">{{ translations.Step }} {{ currentStep }} {{translations.from}} 4</p>
      </div>

      <div v-if="currentStep === 1" class="space-y-6">
        <h2 class="text-xl font-medium text-center text-gray-800 mb-6">{{ translations.tell_us_about_yourself }}</h2>

        <div class="flex items-center text-blue-600 mb-4">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
          </svg>
          <span class="font-medium">{{translations.personal_data}}</span>
        </div>

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
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ translations.email }}</label>
          <input
              v-model="formData.email"
              type="email"
              class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="ismoil_007u@gmail.com"
          >
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
                  aria-label="Parolni ko'rsatish"
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

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ translations.phone }}</label>
            <input
                v-model="formData.phone"
                type="tel"
                class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="+998919579717"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{translations.age}}</label>
            <input
                v-model="formData.birthDate"
                type="date"
                class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="2004"
            >
          </div>
        </div>

        <button
            @click="nextStep"
            :disabled="!isStepValid"
            :class="[
    'w-full py-3 rounded-md font-medium transition-colors',
    isStepValid
      ? 'bg-blue-500 text-white hover:bg-blue-600'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
  ]"
        >
          {{ translations.next }}
        </button>
      </div>

      <div v-if="currentStep === 2" class="space-y-6">
        <h2 class="text-xl font-medium text-center text-gray-800 mb-6">{{translations.Upload_your_resume}}</h2>

        <div class="flex items-center text-blue-600 mb-4">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
          <span class="font-medium">{{ translations.resume }}</span>
        </div>

        <div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{translations.Enter_your_resume_text}}</label>
            <input
                v-model="formData.resumeText"
                class="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Php Laravel Vue.js Full stack developer"
            >
          </div>

          <div class="text-center text-gray-500">{{translations.or}}</div>


          <label class="block text-sm font-medium text-gray-700 mb-2">{{translations.Upload_your_resume_file}}</label>
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
              <svg
                  class="w-12 h-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p class="text-gray-500 mb-4">
                {{translations.dadafhocts}}
              </p>
              <span
                  class="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
      {{translations.select_file}}
    </span>
            </label>
          </div>
        </div>

        <div class="flex gap-3">
          <button
              @click="prevStep"
              class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            {{translations.back}}
          </button>
          <button
              @click="nextStep"
              :disabled="!isStepValid"
              :class="[
    'w-full py-3 rounded-md font-medium transition-colors',
    isStepValid
      ? 'bg-blue-500 text-white hover:bg-blue-600'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
  ]"
          >
            {{translations.next}}
          </button>

        </div>
      </div>

      <div v-if="currentStep === 3" class="space-y-6">
        <h2 class="text-xl font-medium text-center text-gray-800 mb-6">{{translations.Select_a_field}}</h2>

        <div class="flex items-center text-blue-600 mb-4">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"/>
          </svg>
          <span class="font-medium">{{translations.Field_of_activity}}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{translations.Desired_field_of_work}}</label>
          <select
              v-model="formData.workField"
              class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
          >
            <option value="">{{translations.Select_a_field}}</option>
            <option value="it">{{translations.IT_and_development}}</option>
            <option value="design">{{translations.Design}}</option>
            <option value="marketing">{{translations.Marketing}}</option>
            <option value="sales">{{translations.Sales}}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Опыт работы</label>
          <select
              v-model="formData.experience"
              class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
          >
            <option value="">{{translations.Choose_an_experience}}</option>
            <option value="0-1">{{translations.No_experience}}</option>
            <option value="1-3">{{translations.years1}}</option>
            <option value="3-5">{{translations.years2}}</option>
            <option value="5+">{{translations.years3}}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{translations.Location}}</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
            </svg>
            <input
                v-model="formData.location"
                type="text"
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Toshkent"
            >
          </div>
        </div>

        <div class="flex gap-3">
          <button
              @click="prevStep"
              class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            {{translations.back}}
          </button>
          <button
              @click="nextStep"
              :disabled="!isStepValid"
              :class="[
    'w-full py-3 rounded-md font-medium transition-colors',
    isStepValid
      ? 'bg-blue-500 text-white hover:bg-blue-600'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
  ]"
          >
            {{ translations.next }}
          </button>

        </div>
      </div>

      <div v-if="currentStep === 4" class="space-y-6">
        <h2 class="text-xl font-medium text-center text-gray-800 mb-6">{{translations.Set_your_preferences}}</h2>

        <div class="flex items-center text-blue-600 mb-4">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
          </svg>
          <span class="font-medium">{{translations.Work_preferences}}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{translations.Type_of_employment}}</label>
          <select
              v-model="formData.employmentType"
              class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
          >
            <option value="">{{translations.Select_type}}</option>
            <option value="full-time">{{translations.Full_employment}}</option>
            <option value="part-time">{{translations.Part_employment}}</option>
            <option value="remote">{{translations.Remote_work}}</option>
            <option value="freelance">{{translations.Freelance}}</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{translations.salary}}</label>
            <input
                v-model="formData.salaryFrom"
                type="number"
                class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="1000"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{translations.salary2}}</label>
            <div class="relative">
              <input
                  v-model="formData.salaryTo"
                  type="number"
                  class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white pr-8"
                  placeholder="2000"
              >
              <button class="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gray-400 text-white rounded-full text-xs hover:bg-gray-500">
                ×
              </button>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button
              @click="prevStep"
              class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            {{translations.back}}
          </button>
          <button
              @click="completeRegistration"
              :disabled="!isStepValid"
              :class="[
    'flex-1 py-3 rounded-md font-medium transition-colors',
    isStepValid
      ? 'bg-blue-500 text-white hover:bg-blue-600'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
  ]"
          >
            {{translations.finish}}
          </button>
        </div>
      </div>

      <p class="mt-6 text-center text-sm text-gray-500">
        {{translations.Do_you_have_an_account}}
        <RouterLink to="/login" class="text-blue-600 hover:underline">{{ translations.login }}</RouterLink>
      </p>

      <div v-if="currentStep === 5" class="text-center space-y-6">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h2 class="text-xl font-medium text-gray-800">{{translations.Registration_is_complete}}</h2>
        <p class="text-gray-600">{{translations.wtf}}</p>
        <button
            @click="resetForm"
            class="bg-blue-500 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-600 transition-colors"
        >
          {{translations.Start_over}}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '@/i18n-lite'
const { translations } = useI18n()
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from "axios"

const router = useRouter()

const currentStep = ref(1)

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirm_password: '',
  phone: '',
  birthDate: '',
  resumeText: '',
  workField: '',
  experience: '',
  location: '',
  employmentType: '',
  salaryFrom: '',
  salaryTo: ''
})

const touched = reactive({
  firstName: false,
  lastName: false,
  email: false,
  password: false,
  confirm_password: false,
})
const showPassword = ref(false)
const loading = ref(false)
const error = ref("")

const valid = reactive({
  get email() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  },
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

const isValid = computed(() => valid.email && valid.password && valid.confirm && valid.names)

const isStepValid = computed(() => {
  if (currentStep.value === 1) {
    return formData.firstName && formData.lastName && formData.email && formData.phone && formData.birthDate
  }
  if (currentStep.value === 2) {
    return formData.resumeText.trim().length > 0
  }
  if (currentStep.value === 3) {
    return formData.workField && formData.experience && formData.location
  }
  if (currentStep.value === 4) {
    return formData.employmentType && formData.salaryFrom && formData.salaryTo
  }
  return false
})

const nextStep = () => {
  if (isStepValid.value && currentStep.value < 4) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const completeRegistration = async () => {
  touched.firstName = true
  touched.lastName = true
  touched.email = true
  touched.password = true
  touched.confirm_password = true
  error.value = ""

  if (!isValid.value || !isStepValid.value) return
  loading.value = true

  try {
    const { data } = await axios.post("http://127.0.0.1:8000/api/auth/register", {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      birthDate: formData.birthDate,
      resume_text: formData.resumeText,
      work_field: formData.workField,
      experience: formData.experience,
      location: formData.location,
      employment_type: formData.employmentType,
      salary_from: formData.salaryFrom,
      salary_to: formData.salaryTo,
    })

    console.log("✅ Registration success:", data)

    if (data.status === "success") {
      const storage = localStorage
      storage.setItem("token", data.data.token)
      storage.setItem("user", JSON.stringify(data.data.user))
      storage.setItem("expires_at", data.data.expires_at)
      router.push({ name: "home" })
    } else {
      error.value = data.message || "Ro‘yxatdan o‘tishda xatolik yuz berdi."
    }
  } catch (e) {
    error.value = e.response?.data?.message || "Server bilan bog‘lanishda xatolik."
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  currentStep.value = 1
  Object.keys(formData).forEach(k => formData[k] = '')
}
</script>
