<template>
  <div class="min-h-screen bg-gray-50">
    <Header></Header>

    <VacancyList></VacancyList>

    <!-- Chat Widget -->
<!--    <div class="fixed bottom-6 right-6">-->
<!--      <button class="bg-black text-white px-4 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center space-x-2">-->
<!--        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">-->
<!--          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>-->
<!--        </svg>-->
<!--        <span class="font-medium">Чаты</span>-->
<!--      </button>-->
<!--    </div>-->
    <div>
      <ModalComponent
          :show="showModal"
          @refresh="startLoading"
      />

      <LoadingModal :show="showLoading" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import VacancyList from "@/components/VacancyList.vue";
import Header from "@/components/Header.vue";
import ModalComponent from "@/components/modal/UpdateModal.vue";
import LoadingModal from "@/components/modal/LodaingModal.vue";


const showModal = ref(false);
const showLoading = ref(false);
let intervalId = null;

const startLoading = () => {
  showModal.value = false;
  showLoading.value = true;

  setTimeout(() => {
    window.location.reload();
  }, 2000);
};

onMounted(() => {
  intervalId = setInterval(() => {
    showModal.value = true;
  }, 150000);
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});

</script>