<template>
  <div class="container mx-auto p-4 w-full">
    <div class="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 class="text-2xl font-bold mb-2 text-gray-800">Selamat Datang di Dashboard</h2>
      <p class="text-gray-600">
        Hallo <span class="font-bold text-gray-700">{{ currentUser?.nama || 'Pengguna' }}</span>, Anda berhasil login!
      </p>
      <p class="text-gray-600">
        Level: <span class="font-bold text-gray-700">{{ currentUser?.level || 'Tidak diketahui' }}</span>
      </p>
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

    <h2 class="text-2xl font-bold mb-4">Tambah Pengguna</h2>
    <form @submit.prevent="submitUser">
      <div class="mb-4">
        <label for="nama" class="block text-sm font-medium text-gray-700">Nama</label>
        <input v-model="userData.nama" type="text" id="nama" class="mt-1 block w-full border border-gray-300 rounded-md p-2" required>
      </div>
      <div class="mb-4">
        <label for="no_telpon" class="block text-sm font-medium text-gray-700">Nomor Telepon</label>
        <input v-model="userData.no_telpon" type="text" id="no_telpon" class="mt-1 block w-full border border-gray-300 rounded-md p-2" required>
      </div>
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input v-model="userData.email" type="email" id="email" class="mt-1 block w-full border border-gray-300 rounded-md p-2" required>
      </div>
      <div class="mb-4">
        <label for="level" class="block text-sm font-medium text-gray-700">Level</label>
        <select v-model="userData.level" id="level" class="mt-1 block w-full border border-gray-300 rounded-md p-2" required>
          <option value="" disabled selected>Pilih Level</option>
          <option value="admin">Admin</option>
          <option value="super admin">Super Admin</option>
        </select>
      </div>
      <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Simpan</button>
    </form>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useUserStore } from '@/stores/UserStores'; 
import { useAuthStore } from '@/stores/AuthStore';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const userStore = useUserStore();
    const authStore = useAuthStore();
    const router = useRouter();

    // Ambil currentUser dari authStore
    const currentUser = computed(() => authStore.currentUser || { nama: 'Guest', level: 'Unknown' });

    const userData = ref({
      nama: '',
      no_telpon: '',
      email: '',
      level: ''
    });

    const submitUser = async () => {
      console.log('Data yang dikirim:', userData.value); // Debugging data yang dikirim
      // Validasi field
      if (!userData.value.nama || !userData.value.no_telpon || !userData.value.email || !userData.value.level) {
        alert('Semua field wajib diisi!');
        return;
      }

      try {
        await userStore.addUser(userData.value);
        alert('Data pengguna berhasil ditambahkan.');
        router.push('/usertable'); // Arahkan ke halaman tabel pengguna setelah berhasil menambah
      } catch (error) {
        console.error('Error while adding user:', error.response?.data || error.message);
        alert('Gagal menambahkan pengguna.'); // Tampilkan alert kesalahan
      }
    };

    const logout = () => {
      authStore.logout(); // Fungsi logout di authStore
      router.push('/');
    };

    return {
      currentUser,
      userData,
      submitUser,
      logout,
    };
  }
};
</script>

