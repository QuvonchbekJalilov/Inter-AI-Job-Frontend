<template>
  <Header></Header>
  <div class="min-h-screen bg-[#f2f2f2]">
    <div class="max-w-2xl pt-[100px] mx-auto p-4">
      <h2 class="text-xl font-medium mb-4">Foydalanuvchini tahrirlash</h2>

<!--      <div v-if="message" class="mb-3 text-sm" :class="message.includes('✅') ? 'text-green-600' : 'text-red-600'">-->
<!--        {{ message }}-->
<!--      </div>-->

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

        <!-- ❌ Fayl yuklash input olib tashlandi -->

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

        <button type="submit" :disabled="loading" class="bg-blue-600 w-full text-white px-4 py-2 rounded">
          {{ loading ? 'Saqlanmoqda...' : 'Yangilash' }}
        </button>
      </form>
    </div>
  </div>
  <LoadingModal :show="showLoading" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import Header from "@/components/Header.vue";
import LoadingModal from "@/components/modal/LodaingModal.vue";
import {toast} from "vue3-toastify";

const route = useRoute()
const router = useRouter()
const userId = route.params.id
const showLoading = ref(false);

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
})

const loading = ref(false)
const message = ref(null)
const token = localStorage.getItem("token") || sessionStorage.getItem("token")

onMounted(async () => {
  try {
    loading.value = true
    showLoading.value = true
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
    form.value.resume_text = data.resumes?.[0]?.description || ''

    form.value.salary_from = data.preferences?.[0]?.desired_salary_from || ''
    form.value.salary_to = data.preferences?.[0]?.desired_salary_to || ''
    form.value.experience = data.preferences?.[0]?.experience_level || ''
    form.value.location = data.locations?.[0]?.text || ''
    form.value.employment_type = data.job_types?.[0]?.job_type || ''
  } catch (err) {
    console.error(err)
    message.value = 'Foydalanuvchi ma’lumotlarini olishda xatolik'
  } finally {
    loading.value = false
    showLoading.value = false
  }
})

const updateUser = async () => {
  try {
    loading.value = true
    message.value = null

    const res = await axios.put(`http://127.0.0.1:8000/api/auth/users/${userId}`, form.value, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-type': 'application/json'
      }
    })

    message.value = 'Muvaffaqiyatli yangilandi ✅'
    toast.success(message.value)

    setTimeout(() => {
      router.push({ name: "profile" })
    }, 5000)

  } catch (err) {
    console.error(err)
    message.value = err.response?.data?.message || 'Xatolik yuz berdi'
    toast.error(message.value)
  } finally {
    loading.value = false
  }
}

</script>
