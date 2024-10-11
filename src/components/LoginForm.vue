<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-md w-80">
      <h2 class="text-2xl font-bold mb-5 text-left">Login</h2>
      <form @submit.prevent="handleSubmit" id="login-form">
        <div class="mb-4">
          <label for="email" class="block mb-2 text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Masukkan Email"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:placeholder-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block mb-2 text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Masukkan Password"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:placeholder-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-700 transition duration-200"
        >
          {{ loading ? "Processing..." : "Login" }}
        </button>
        <div v-if="countdown > 0" class="text-green-600 mt-4">
          Login Berhasil! Anda akan diarahkan dalam {{ countdown }}...
        </div>
        <div v-if="errorMessage" class="text-red-600 mt-4">
          {{ errorMessage }}
        </div>
        <div class="mt-4 text-center">
          <a
            href="#"
            class="text-blue-500 hover:underline"
            @click.prevent="handleForgotPassword"
          >
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/AuthStore'; 

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const countdown = ref(0);
    const errorMessage = ref('');
    const loading = ref(false); 

    const handleSubmit = async () => {
      errorMessage.value = ''; 
      loading.value = true; 
      try {
        // Mengirim request login ke API
        const response = await axios.post('http://localhost/smkti/FE-BE-galeri/restapi/api/auth/login', {
          email: email.value,
          password: password.value,
        });

        // Mengecek jika token ada
        if (response.data.token && response.data.data) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('currentUser', JSON.stringify(response.data.data));

          countdown.value = 5; // Mengatur countdown sebelum redirect
          const interval = setInterval(() => {
            if (countdown.value > 0) {
              countdown.value--;
            } else {
              clearInterval(interval);
              router.push('/dashboard');
            }
          }, 1000);
        } else {
          errorMessage.value = response.data.message || "Login gagal. Silakan coba lagi."; // Menampilkan pesan error
        }
      } catch (error) {
        // Menangani error yang mungkin terjadi
        if (error.response) {
          if (error.response.status === 400) {
            errorMessage.value = error.response.data.message; // Menampilkan pesan error
          } else {
            errorMessage.value = "Terjadi kesalahan. Silakan coba lagi.";
          }
        } else {
          errorMessage.value = "Terjadi kesalahan jaringan.";
        }
      } finally {
        loading.value = false; // Mematikan state loading
      }
    };

    const handleForgotPassword = () => {
      alert('Lupa password? Silakan hubungi admin atau periksa email Anda untuk petunjuk pengaturan ulang.');
    };

    return {
      email,
      password,
      handleSubmit,
      countdown,
      errorMessage,
      handleForgotPassword,
      loading, 
    };
  },
};
</script>
