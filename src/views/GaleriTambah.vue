<template>
  <div class="container mx-auto p-4 w-full">
    <div class="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 class="text-2xl font-bold mb-2 text-gray-800">Selamat Datang di Dashboard</h2>
      <p class="text-gray-600">
        Hallo <span class="font-bold text-gray-700">{{ username }}</span> Anda berhasil login!
      </p>
      <p class="text-gray-600">
        Level: <span class="font-bold text-gray-700">{{ userLevel }}</span>
      </p>
      <div class="flex space-x-2 mt-4">
        <router-link to="/dashboard" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Dashboard</router-link>
        <router-link to="/galeri" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Galeri</router-link>
        <router-link to="/usertable" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Pengguna</router-link>
        <button @click="logout" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">LogOut</button>
      </div>
    </div>

    <div class="bg-white shadow-md rounded p-6">
      <h2 class="text-2xl font-semibold mb-4">Tambah Galeri</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="flex flex-col">
          <label for="nama" class="font-medium mb-1">Nama</label>
          <input v-model="galeriStore.formGaleri.nama" type="text" name="nama" id="nama" class="p-2 border border-gray-300 rounded" required />
        </div>
        <div class="flex flex-col">
          <label for="image" class="font-medium mb-1">Gambar</label>
          <input type="file" accept="image/*" name="image" id="image" class="p-2 border border-gray-300 rounded" @change="handleFileUpload" required />
        </div>
        <button type="submit" class="w-full py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600" :disabled="isLoading">
          {{ isLoading ? 'Loading...' : 'Simpan' }}
        </button>
        <div v-if="message" :class="messageClass" class="mt-2">
          {{ message }}
        </div>
      </form>
      <div v-if="successMessage" class="text-green-500 mt-2">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { useGaleriStore } from '../stores/galeriStores';
import { useAuthStore } from '../stores/AuthStore';
import { computed, ref } from 'vue'; 
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter(); 
    const galeriStore = useGaleriStore();

    const username = computed(() => authStore.currentUser?.nama);
    const userLevel = computed(() => authStore.currentUser?.level);

    const isLoading = ref(false); 
    const message = ref(''); 
    const messageClass = ref(''); 
    const successMessage = ref(''); 

    const logout = () => {
      localStorage.clear(); 
      authStore.logout(); // Panggil metode logout di store
      router.push('/'); 
    };

    const handleFileUpload = (event) => {
      galeriStore.formGaleri.imageFile = event.target.files[0]; // Simpan file gambar ke state galeriStore
    };

    const handleSubmit = async () => {
      if (!galeriStore.formGaleri.imageFile) { 
        showMessage('Silakan pilih file gambar.', 'text-red-500');
        return;
      }

      isLoading.value = true; 
      try {
        const result = await galeriStore.addGaleri(); // Memanggil fungsi untuk menambahkan galeri
        if (result.success) {
          resetForm();
          successMessage.value = 'Gambar telah ditambahkan!'; 
          setTimeout(() => {
            router.push('/galeri'); // Mengarahkan pengguna ke halaman galeri
          }, 1000); 
        } else {
          showMessage(result.message, 'text-red-500');
        }
      } catch (error) {
        showMessage('Gagal menambahkan gambar.', 'text-red-500');
      } finally {
        isLoading.value = false; 
      }
    };

    const resetForm = () => {
      galeriStore.resetForm(); // Reset form di store
      message.value = ''; 
      messageClass.value = ''; 
      successMessage.value = ''; // Reset success message
    };

    const showMessage = (msg, msgClass) => {
      message.value = msg; 
      messageClass.value = msgClass; 
    };

    return {
      username,
      userLevel,
      logout,
      isLoading,
      message,
      messageClass,
      successMessage,
      handleFileUpload,
      handleSubmit,
      resetForm,
      showMessage,
      galeriStore,
    };
  },
};
</script>
