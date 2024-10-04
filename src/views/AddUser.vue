<template>
  <div class="container mx-auto p-4 w-full">
    <div class="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 class="text-2xl font-bold mb-2 text-gray-800">Selamat Datang di Dashboard</h2>
      <p class="text-gray-600">Hallo <span class="font-bold text-gray-700">{{ username }}</span> Anda berhasil login!</p>
      <p class="text-gray-600">Level: <span class="font-bold text-gray-700">{{ userLevel }}</span></p>
      <div class="flex space-x-2 mt-4">
        <router-link to="/dashboard" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Dashboard
        </router-link>
        <router-link to="/galeri" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Galeri
        </router-link>
        <router-link to="/usertable" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Pengguna
        </router-link>
        <button @click="logout" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
          LogOut
        </button>
      </div>
    </div>
    <main class="bg-slate-100 p-6 pt-2 rounded-lg shadow-md w-full max-w-md mx-auto mt-8">
      <div class="header-title text-center my-4">
        <h2 class="text-2xl font-bold">Tambah Pengguna</h2>
      </div>
      <form @submit.prevent="submitUser" class="space-y-4">
        <div class="form-group">
          <label for="nama" class="block text-left">
            Nama
            <input 
              required 
              type="text" 
              v-model="form.nama" 
              id="nama" 
              class="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </label>
        </div>
        <div class="form-group">
          <label for="no_telpon" class="block text-left">
            No Telepon
            <input 
              required 
              type="text" 
              v-model="form.no_telpon" 
              id="no_telpon" 
              class="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </label>
        </div>
        <div class="form-group">
          <label for="email" class="block text-left">
            Email
            <input 
              required 
              type="email" 
              v-model="form.email" 
              id="email" 
              class="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </label>
        </div>
        <div class="form-group">
          <label for="password" class="block text-left">
            Password
            <input 
              required 
              type="password" 
              v-model="form.password" 
              id="password" 
              class="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </label>
        </div>
        <div class="form-group">
          <label for="level" class="block text-left">
            Level
            <select 
              v-model="form.level" 
              id="level" 
              class="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="super admin">super admin</option>
              <option value="admin">admin</option>
            </select>
          </label>
        </div>
        <button 
          type="submit"  
          class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Simpan
        </button>
        <div v-if="message" :class="messageClass" class="mt-4 text-center">
          {{ message }}
        </div>
      </form>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/AuthStore';
import { computed } from 'vue'; 
import { useRouter } from 'vue-router'; 

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter(); 

    
    const username = computed(() => authStore.currentUser?.nama);
    const userLevel = computed(() => authStore.currentUser?.level);

    const logout = () => {
      localStorage.clear(); // Menghapus semua data di localStorage
      authStore.currentUser = null; // Mengatur state pengguna ke null
      router.push('/'); // Redirect ke halaman login
      console.log("Logout");
    };

    const form = {
      nama: "",
      no_telpon: "",
      email: "",
      password: "",
      level: "admin",
    };
    
    return {
      username,
      userLevel, 
      logout,
      form,
      message: "",
      messageClass: "",
    };
  },
  methods: {
    async submitUser() {
      this.message = "";
      this.messageClass = "";
      // Logic untuk menyimpan pengguna baru
    },
  }
};
</script>
