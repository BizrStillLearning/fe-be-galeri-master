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
            required
            placeholder="Masukkan Email"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:placeholder-blue-500"
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block mb-2 text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Masukkan Password"
            required
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:placeholder-blue-500"
          />
        </div>
        <button
          type="submit"
          class="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>
        <div id="error-message" class="text-red-500 mt-4">
          {{ errorMessage }}
        </div>
        <div v-if="countdown > 0" class="text-green-600 mt-4">
          Login Berhasil! Anda akan diarahkan dalam {{ countdown }}...
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
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      countdown: 0,
    };
  },
  methods: {
    handleSubmit() {
      if (!this.isValidEmail(this.email)) {
        this.errorMessage = 'Email tidak valid!';
        return;
      }

      if (this.password !== 'password123') {
        this.errorMessage = 'Terjadi Kesalahan: Password salah!';
      } else {
        this.errorMessage = '';
        this.startCountdown();
      }
    },
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    handleForgotPassword() {
      alert('Hubungi Admin Untuk Mereset Password');
    },
    startCountdown() {
      this.countdown = 5;
      const countdownInterval = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown <= 0) {
          clearInterval(countdownInterval);
          this.$router.push({ name: 'Dashboard' });
        }
      }, 1000);
    },
  },
};
</script>
