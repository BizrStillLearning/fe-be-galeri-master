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
  </div>
  <div class="p-6 bg-slate-100 shadow-md rounded-lg mb-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold mb-4">Data Pengguna</h2>
      <div class="space-x-2">
        <router-link to="/adduser" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          Tambah
        </router-link>
        <button @click="refresh" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
          Refresh
        </button>
      </div>
    </div>

    <table class="min-w-full bg-white border border-gray-200">
      <thead class="bg-gray-200">
        <tr>
          <th class="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">No</th>
          <th class="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Nama Pengguna</th>
          <th class="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Nomor Telepon</th>
          <th class="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Alamat Email</th>
          <th class="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Level</th>
          <th class="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id" class="hover:bg-gray-100">
          <td class="px-4 py-2 border-b text-sm text-gray-800">{{ index + 1 }}</td>
          <td class="px-4 py-2 border-b text-sm text-gray-800">{{ user.nama }}</td>
          <td class="px-4 py-2 border-b text-sm text-gray-800">{{ user.telp }}</td>
          <td class="px-4 py-2 border-b text-sm text-gray-800">{{ user.email }}</td>
          <td class="px-4 py-2 border-b text-sm text-gray-800">{{ user.level }}</td>
          <td class="px-4 py-2 border-b text-sm text-gray-800 space-x-2">
            <button
              @click="goToEditUser"
              class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              @click="deleteUser(user.id)"
              class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/AuthStore';
import { computed } from 'vue'; 
export default {
  setup() {
    const authStore = useAuthStore();
    // Menggunakan computed untuk memastikan data selalu diperbarui
    const username = computed(() => authStore.currentUser?.nama);
    const userLevel = computed(() => authStore.currentUser?.level); 
    
    const logout = () => {
      localStorage.clear(); // Menghapus semua data di localStorage
      authStore.currentUser = null; // Mengatur state pengguna ke null
      router.push('/'); // Redirect ke halaman login
      console.log("Logout");
    };

    return {
      username,
      userLevel,
      logout,
      users: [
        {id: 1, nama: "Abidzar Dzakwan Sahudi", telp: "0896-0126-1250", email: "abidzardzakwan36@gmail.com", level: "Admin"},
        {id: 1, nama: "Abidzar Dzakwan Sahudi", telp: "0896-0126-1250", email: "abidzardzakwan36@gmail.com", level: "Admin"},
        {id: 1, nama: "Abidzar Dzakwan Sahudi", telp: "0896-0126-1250", email: "abidzardzakwan36@gmail.com", level: "Admin"},
        {id: 1, nama: "Abidzar Dzakwan Sahudi", telp: "0896-0126-1250", email: "abidzardzakwan36@gmail.com", level: "Admin"},
        {id: 1, nama: "Abidzar Dzakwan Sahudi", telp: "0896-0126-1250", email: "abidzardzakwan36@gmail.com", level: "Admin"},
        {id: 1, nama: "Abidzar Dzakwan Sahudi", telp: "0896-0126-1250", email: "abidzardzakwan36@gmail.com", level: "Admin"},
        {id: 1, nama: "Abidzar Dzakwan Sahudi", telp: "0896-0126-1250", email: "abidzardzakwan36@gmail.com", level: "Admin"},
        {id: 1, nama: "Abidzar Dzakwan Sahudi", telp: "0896-0126-1250", email: "abidzardzakwan36@gmail.com", level: "Admin"},
        {id: 1, nama: "Abidzar Dzakwan Sahudi", telp: "0896-0126-1250", email: "abidzardzakwan36@gmail.com", level: "Admin"},
        {id: 1, nama: "Abidzar Dzakwan Sahudi", telp: "0896-0126-1250", email: "abidzardzakwan36@gmail.com", level: "Admin"},
      ],
    };
  },
  methods: {
    goToEditUser() {
      this.$router.push("/editpengguna");
    },
    deleteUser(userId) {
      if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
        const index = this.users.findIndex(user => user.id === userId);
        if (index !== -1) {
          this.users.splice(index, 1);
          alert("Pengguna berhasil dihapus!");
        } else {
          alert("Pengguna tidak ditemukan!");
        }
      }
    },
  }
};
</script>
