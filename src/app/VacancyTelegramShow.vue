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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const vacancy = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
    try {
        const id = params.get('id')
        console.log('Fetching vacancy with ID:', id)
        const { data } = await axios.get(`/v1/telegram/vacancies/${id}`)
        if (data.success) {
            vacancy.value = data.data
        } else {
            error.value = data.message || 'Vacancy not found'
        }
    } catch (err) {
        error.value = err.response?.data?.message || 'Failed to load vacancy'
    } finally {
        loading.value = false
    }
})
</script>