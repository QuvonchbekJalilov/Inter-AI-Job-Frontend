<template>
  <div
      v-if="show"
      class="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
  >
    <div
        class="bg-white rounded-2xl shadow-lg w-[300px] max-w-[90%] text-center p-6"
    >
      <p class="text-lg font-medium text-gray-800 mb-5">
        {{ message }}
      </p>

      <button
          @click="$emit('refresh')"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl py-2.5 transition"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  message: { type: String, default: "Sahifani yangilang" },
  buttonText: { type: String, default: "Yangilash" },
});

defineEmits(["refresh"]);
</script>
