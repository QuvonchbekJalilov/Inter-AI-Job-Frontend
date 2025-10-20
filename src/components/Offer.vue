<script setup>
const props = defineProps({
  locale: { type: String, default: 'uz' },
  modelValue: { type: Boolean, default: false } // v-model uchun
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="mt-4 space-y-2 text-sm text-gray-700">
    <!-- Til bo‘yicha matn -->
    <p v-if="locale === 'uz'">
      Davom etishdan oldin, iltimos, shaxsiy ma’lumotlaringizni qayta ishlash shartlariga roziligingizni tasdiqlang.
      <a href="https://vacancies.inter-ai.uz/oferta_uz.docx"
         target="_blank"
         rel="noopener noreferrer"
         class="text-blue-600 hover:underline font-medium">
        Ommaviy ofertani
      </a> o‘qib chiqing.
    </p>

    <p v-else-if="locale === 'ru'">
      Перед продолжением, пожалуйста, подтвердите согласие с условиями обработки ваших персональных данных.
      Ознакомьтесь с
      <a href="https://vacancies.inter-ai.uz/oferta_ru.docx"
         target="_blank"
         rel="noopener noreferrer"
         class="text-blue-600 hover:underline font-medium">
        Публичной офертой
      </a>.
    </p>

    <p v-else>
      Before continuing, please confirm your consent to the processing of your personal data.
      Read the
      <a href="https://vacancies.inter-ai.uz/oferta_en.docx"
         target="_blank"
         rel="noopener noreferrer"
         class="text-blue-600 hover:underline font-medium">
        Public Offer
      </a>.
    </p>

    <!-- Checkbox -->
    <div class="flex items-start gap-2 mt-3">
      <input
          id="offerAgreement"
          type="checkbox"
          :checked="modelValue"
          @change="emit('update:modelValue', $event.target.checked)"
          class="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
      />
      <label for="offerAgreement" class="cursor-pointer select-none">
        <template v-if="locale === 'uz'">
          Shaxsiy ma’lumotlarimni qayta ishlashga roziman
        </template>
        <template v-else-if="locale === 'ru'">
          Даю согласие на обработку моих персональных данных
        </template>
        <template v-else>
          I agree to the processing of my personal data
        </template>
      </label>
    </div>
  </div>
</template>
