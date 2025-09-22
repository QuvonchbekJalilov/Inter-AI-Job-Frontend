<template>
  <Header></Header>
  <div class="min-h-screen bg-[#f2f2f2]">
    <div class="max-w-2xl pt-[100px] mx-auto p-4">
      <h2 class="text-xl font-bold mb-4">Foydalanuvchini tahrirlash</h2>

      <div v-if="message" class="mb-3 text-sm" :class="message.includes('✅') ? 'text-green-600' : 'text-red-600'">
        {{ message }}
      </div>

      <form @submit.prevent="updateUser" class="space-y-4">
        <div>
          <label class="block mb-1">Ism</label>
          <input v-model="form.first_name" type="text" class="border rounded w-full p-2" />
        </div>

        <div>
          <label class="block mb-1">Familiya</label>
          <input v-model="form.last_name" type="text" class="border rounded w-full p-2" />
        </div>

        <div>
          <label class="block mb-1">Email</label>
          <input v-model="form.email" disabled type="email" class="border rounded w-full p-2" />
        </div>

        <div>
          <label class="block mb-1">Telefon</label>
          <input v-model="form.phone" disabled type="text" class="border rounded w-full p-2" />
        </div>

        <div>
          <label class="block mb-1">Parol (agar o‘zgartirmoqchi bo‘lsang)</label>
          <input v-model="form.password" type="password" class="border rounded w-full p-2" />
        </div>

        <div>
          <label class="block mb-1">Tug‘ilgan sana</label>
          <input v-model="form.birth_date" type="date" class="border rounded w-full p-2" />
        </div>

        <div>
          <label class="block mb-1">Resume matni</label>
          <textarea v-model="form.resume_text" rows="3" class="border rounded w-full p-2"></textarea>
        </div>

        <div>
          <label class="block mb-1">Resume fayl</label>
          <input type="file" @change="handleFileChange" />
        </div>

        <div>
          <label class="block mb-1">Tajriba</label>
          <input v-model="form.experience" type="text" class="border rounded w-full p-2" />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block mb-1">Maosh (dan)</label>
            <input v-model="form.salary_from" type="number" class="border rounded w-full p-2" />
          </div>
          <div>
            <label class="block mb-1">Maosh (gacha)</label>
            <input v-model="form.salary_to" type="number" class="border rounded w-full p-2" />
          </div>
        </div>

        <div>
          <label class="block mb-1">Ish turi</label>
          <input v-model="form.employment_type" type="text" class="border rounded w-full p-2" />
        </div>

        <div>
          <label class="block mb-1">Joylashuv</label>
          <input v-model="form.location" type="text" class="border rounded w-full p-2" />
        </div>

        <button type="submit" :disabled="loading" class="bg-blue-600 text-white px-4 py-2 rounded">
          {{ loading ? 'Saqlanmoqda...' : 'Yangilash' }}
        </button>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import Header from "@/components/Header.vue";

const route = useRoute()
const router = useRouter()
const userId = route.params.id
console.log('User ID:', userId)

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  birth_date: '',
  resume_text: '',
  experience: '',
  salary_from: '',
  salary_to: '',
  employment_type: '',
  location: '',
  settings: {
    auto_apply_enabled: false,
    auto_apply_limit: 0,
    notifications_enabled: true,
    language: 'uz'
  }
})

const resumeFile = ref(null)
const loading = ref(false)
const message = ref(null)
const token = localStorage.getItem("token") || sessionStorage.getItem("token")

const handleFileChange = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    resumeFile.value = e.target.files[0]
  }
}

onMounted(async () => {
  try {
    loading.value = true
    if (!token) {
      router.push({ name: "login" })
      return
    }
    const res = await axios.get("http://127.0.0.1:8000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = res.data.data
    console.log('User data:', data)

    form.value.first_name = data.first_name || ''
    form.value.last_name = data.last_name || ''
    form.value.email = data.email || ''
    form.value.phone = data.phone || ''
    form.value.birth_date = data.birth_date || ''
    form.value.settings = data.settings || form.value.settings

    form.value.salary_from = data.preferences?.[0]?.desired_salary_from || ''
    form.value.salary_to = data.preferences?.[0]?.desired_salary_to || ''
    form.value.location = data.locations?.[0]?.text || ''
    form.value.employment_type = data.job_types?.[0]?.name || ''
  } catch (err) {
    console.error(err)
    message.value = 'Foydalanuvchi ma’lumotlarini olishda xatolik'
  } finally {
    loading.value = false
  }
})

const updateUser = async () => {
  try {
    loading.value = true
    message.value = null

    const formData = new FormData()
    Object.keys(form.value).forEach((key) => {
      const value = form.value[key]
      if (typeof value === 'object' && value !== null) {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, value ?? '')
      }
    })

    if (resumeFile.value) {
      formData.append('resume_file', resumeFile.value)
    }

    const res = await axios.put(`http://127.0.0.1:8000/api/auth/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    })

    message.value = 'Muvaffaqiyatli yangilandi ✅'
    console.log('Response:', res.data)
  } catch (err) {
    console.error(err)
    message.value = err.response?.data?.message || 'Xatolik yuz berdi'
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
</style>
