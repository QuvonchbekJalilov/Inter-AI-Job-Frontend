<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="w-full max-w-md bg-white text-black rounded-lg shadow-lg p-6">
      <!-- Header with logo -->
      <div class="text-center mb-6">
        <img src="https://www.inter-ai.uz/Logo1.svg" alt="Inter-AI" class="h-8 mx-auto mb-4">
      </div>

      <!-- Progress bar -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-2">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${(currentStep / 4) * 100}%` }"
            ></div>
          </div>
        </div>
        <p class="text-center text-sm text-gray-500">Шаг {{ currentStep }} из 4</p>
      </div>

      <!-- Step 1: Personal Information -->
      <div v-if="currentStep === 1" class="space-y-6">
        <h2 class="text-xl font-medium text-center text-gray-800 mb-6">Расскажите о себе</h2>

        <div class="flex items-center text-blue-600 mb-4">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
          </svg>
          <span class="font-medium">Личные данные</span>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
            <input
                v-model="formData.firstName"
                type="text"
                class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="Ismoil"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
            <input
                v-model="formData.lastName"
                type="text"
                class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="Usmonov"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
              v-model="formData.email"
              type="email"
              class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="ismoil_007u@gmail.com"
          >
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
            <input
                v-model="formData.phone"
                type="tel"
                class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="+998919579717"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Возраст</label>
            <input
                v-model="formData.age"
                type="number"
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
          Далее
        </button>
      </div>

      <!-- Step 2: Resume Upload -->
      <div v-if="currentStep === 2" class="space-y-6">
        <h2 class="text-xl font-medium text-center text-gray-800 mb-6">Загрузите резюме</h2>

        <div class="flex items-center text-blue-600 mb-4">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
          <span class="font-medium">Резюме</span>
        </div>

        <div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Введите текст резюме</label>
            <input
                v-model="formData.resumeText"
                class="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Php Laravel Vue.js Full stack developer"
            >
          </div>

          <div class="text-center text-gray-500">или</div>


          <label class="block text-sm font-medium text-gray-700 mb-2">Загрузить файл резюме</label>
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
                Перетащите файл сюда или нажмите для выбора
              </p>
              <span
                  class="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
      Выбрать файл
    </span>
            </label>
          </div>
        </div>


        <div class="flex gap-3">
          <button
              @click="prevStep"
              class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            Назад
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
            Далее
          </button>

        </div>
      </div>

      <!-- Step 3: Field Selection -->
      <div v-if="currentStep === 3" class="space-y-6">
        <h2 class="text-xl font-medium text-center text-gray-800 mb-6">Выберите сферу</h2>

        <div class="flex items-center text-blue-600 mb-4">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"/>
          </svg>
          <span class="font-medium">Сфера деятельности</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Желаемая сфера работы</label>
          <select
              v-model="formData.workField"
              class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
          >
            <option value="">Выберите сферу</option>
            <option value="it">IT и разработка</option>
            <option value="design">Дизайн</option>
            <option value="marketing">Маркетинг</option>
            <option value="sales">Продажи</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Опыт работы</label>
          <select
              v-model="formData.experience"
              class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
          >
            <option value="">Выберите опыт</option>
            <option value="0-1">Без опыта</option>
            <option value="1-3">1-3 года</option>
            <option value="3-5">3-5 лет</option>
            <option value="5+">Более 5 лет</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Локация</label>
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
            Назад
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
            Далее
          </button>

        </div>
      </div>

      <!-- Step 4: Preferences -->
      <div v-if="currentStep === 4" class="space-y-6">
        <h2 class="text-xl font-medium text-center text-gray-800 mb-6">Настройте предпочтения</h2>

        <div class="flex items-center text-blue-600 mb-4">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
          </svg>
          <span class="font-medium">Предпочтения по работе</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Тип занятости</label>
          <select
              v-model="formData.employmentType"
              class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
          >
            <option value="">Выберите тип</option>
            <option value="full-time">Полная занятость</option>
            <option value="part-time">Частичная занятость</option>
            <option value="remote">Удаленная работа</option>
            <option value="freelance">Фриланс</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Зарплата от (₽)</label>
            <input
                v-model="formData.salaryFrom"
                type="number"
                class="w-full px-3 py-2 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="1000"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Зарплата до (₽)</label>
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
            Назад
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
            Завершить
          </button>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="currentStep === 5" class="text-center space-y-6">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h2 class="text-xl font-medium text-gray-800">Регистрация завершена!</h2>
        <p class="text-gray-600">Добро пожаловать в Inter-AI. Ваш профиль успешно создан.</p>
        <button
            @click="resetForm"
            class="bg-blue-500 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-600 transition-colors"
        >
          Начать заново
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const currentStep = ref(1)

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  age: '',
  resumeText: '',
  workField: '',
  experience: '',
  location: '',
  employmentType: '',
  salaryFrom: '',
  salaryTo: ''
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    console.log('Tanlangan fayl:', file.name)
  }
}


/* ✅ Step bo‘yicha to‘ldirilganini tekshirish */
const isStepValid = computed(() => {
  if (currentStep.value === 1) {
    return formData.firstName && formData.lastName && formData.email && formData.phone && formData.age
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

const completeRegistration = () => {
  if (!isStepValid.value) return
  console.log('Registration completed:', formData)
  router.push('/profile')
}

const resetForm = () => {
  currentStep.value = 1
  Object.keys(formData).forEach(k => formData[k] = '')
}
</script>
