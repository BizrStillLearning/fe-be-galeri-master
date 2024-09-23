<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100"> 
    <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-lg"> 
      <h2 class="text-2xl font-bold mb-2 text-gray-800">Selamat Datang di Dashboard</h2>
      <p class="text-gray-600">Hallo <span class="font-bold text-gray-700">{{ userName }}</span>, Anda berhasil login!</p>
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
export default {
  data() {
    return {
      userName: "Nama Pengguna", 
      userLevel: "Admin", 
    };
  },
  methods: {
    logout() {
      this.$router.push("/");
      console.log("Logout");
    }
  }
};
</script>

