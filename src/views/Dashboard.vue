<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
      <h2 class="text-2xl font-bold mb-2 text-gray-800">Selamat Datang di Dashboard</h2>
      <p class="text-gray-600">Hallo <span class="font-bold text-gray-700">{{ username }}</span> Anda berhasil login!</p>
      <p class="text-gray-600">Level: <span class="font-bold text-gray-700">{{ userLevel }}</span></p>
      <div class="space-y-2 mt-4">
        <router-link to="/dashboard" class="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Dashboard
        </router-link>
        <router-link to="/galeri" class="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Galeri
        </router-link>
        <router-link to="/usertable" class="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Pengguna
        </router-link>
        <button @click="logout" class="block w-full text-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
          LogOut
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/AuthStore';
import axios from 'axios';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Definisikan API_BASE_URL
const API_BASE_URL = 'http://localhost/smkti/FE-BE-galeri/restapi'; // Ganti dengan URL API yang sesuai

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    // Computed properties untuk mendapatkan username dan level pengguna
    const username = computed(() => authStore.currentUser?.nama || '');
    const userLevel = computed(() => authStore.currentUser?.level || '');

    // Fungsi untuk mendapatkan data pengguna
    const getCurrentUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/'); // Redirect ke halaman login jika token tidak ada
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/current`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Jika respons tidak berhasil, tangani status 401
        if (response.status === 401) {
          localStorage.clear();
          alert("Session Anda telah berakhir. Silakan login kembali.");
          router.push('/'); // Redirect ke halaman login
          return;
        }

        // Menyimpan data pengguna ke Pinia
        authStore.currentUser = response.data.data; // Ambil data pengguna dari response
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Fungsi untuk logout
    const logout = () => {
      localStorage.clear(); // Menghapus semua data di localStorage
      authStore.currentUser = null; // Mengatur state pengguna ke null
      router.push('/'); // Redirect ke halaman login
    };

    // Memanggil getCurrentUsers saat komponen dimuat
    onMounted(() => {
      getCurrentUsers();
    });

    return {
      username,
      userLevel,
      logout,
    };
  },
};
</script>
