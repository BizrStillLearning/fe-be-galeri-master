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
            v-model="authStore.formLogin.email"
            placeholder="Masukkan Email"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:placeholder-blue-500"
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block mb-2 text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="authStore.formLogin.password"
            placeholder="Masukkan Password"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:placeholder-blue-500"
          />
        </div>
        <button
          type="submit"
          class="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-700 transition duration-200"
        >
          Login
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
import { useAuthStore } from "../stores/AuthStore"; 
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore();
    const userData = authStore.currentUser;
    const router = useRouter();
    const errorMessage = ref('');
    const countdown = ref(0);
    let countdownInterval = null; // Menyimpan interval countdown

    const handleSubmit = async () => {
  // Validasi input
  if (!authStore.formLogin.email || !authStore.formLogin.password) {
    alert("Email dan Password harus diisi");
    return;
  }

  try {
    const response = await authStore.prosesLoginPost();
    if (response.success) {
      errorMessage.value = ''; 
      startCountdown();
    } else {
      errorMessage.value = response.message; // Mengambil pesan dari response
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = 'Terjadi kesalahan saat login.';
  }
};



    const startCountdown = () => {
      countdown.value = 5; // Set countdown ke 5 detik
      console.log("Countdown started with value:", countdown.value); // Debug log
      clearInterval(countdownInterval); // Bersihkan interval sebelumnya jika ada
      countdownInterval = setInterval(() => {
        countdown.value -= 1;
        console.log("Countdown:", countdown.value); // Debug log
        if (countdown.value <= 0) {
          clearInterval(countdownInterval); // Hentikan interval
          console.log("Redirecting to Dashboard..."); // Debug log
          router.push({ name: 'Dashboard' });
        }
      }, 1000);
    };

    const handleForgotPassword = () => {
      alert('Hubungi Admin Untuk Mereset Password');
    };

    return {
      authStore,
      handleSubmit,
      errorMessage,
      countdown,
      handleForgotPassword,
      userData,
    };
  },
};
</script>
