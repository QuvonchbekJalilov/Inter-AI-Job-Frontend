<template>
    <div class="p-6">
        <div v-if="loading" class="text-center text-gray-500">
            Loading vacancy details...
        </div>

        <div v-else-if="error" class="text-red-500">
            {{ error }}
        </div>

        <div v-else-if="vacancy" class="space-y-4">
            <h1 class="text-2xl font-semibold">{{ vacancy.title }}</h1>
            <p class="text-gray-700 whitespace-pre-line">{{ vacancy.description }}</p>

            <div class="text-sm text-gray-600">
                <p><strong>Company:</strong> {{ vacancy.company }}</p>
                <p><strong>Contact:</strong> {{ vacancy.contact }}</p>
                <p><strong>Language:</strong> {{ vacancy.language }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
const { proxy } = getCurrentInstance()

const route = useRoute()
const vacancy = ref(null)
const loading = ref(true)
const error = ref(null)
const id = route.params.id



const fetchVacancy = async () => {
  try {
    showLoading.value = true
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    const res = await fetch(
        proxy.$locale + `/v1/telegram/vacancies/${id}`,
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
    
    console.log("✅ Vacancy:", data)
  } catch (e) {
    console.error("❌ API error:", e.message)
  } finally {
    loading.value = false
  }
}


onMounted(fetchVacancy)
</script>