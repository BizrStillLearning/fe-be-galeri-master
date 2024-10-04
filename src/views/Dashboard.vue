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
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Mengimpor useRouter

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter(); // Menginisialisasi router
    
    // Menggunakan computed untuk memastikan data selalu diperbarui
    const username = computed(() => authStore.currentUser?.nama);
    const userLevel = computed(() => authStore.currentUser?.level);

    const getCurrentUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect ke halaman login jika token tidak ada
        router.push('/'); // Menggunakan router untuk redirect
        return; // Menghentikan eksekusi lebih lanjut
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/current`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            localStorage.clear();
            alert(errorData.message);
            router.push('/'); // Redirect ke halaman login
            return;
          }
        }

        const data = await response.json();
        if (data.data) {
          authStore.currentUser = data.data; // Menyimpan data pengguna ke Pinia
          localStorage.setItem('currentUsers', JSON.stringify(data.data));
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const logout = () => {
      localStorage.clear(); // Menghapus semua data di localStorage
      authStore.currentUser = null; // Mengatur state pengguna ke null
      router.push('/'); // Redirect ke halaman login
      console.log("Logout");
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
