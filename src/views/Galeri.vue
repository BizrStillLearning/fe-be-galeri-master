<template>
  <div class="container mx-auto p-4 w-full">
    <div class="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 class="text-2xl font-bold mb-2 text-gray-800">Selamat Datang di Dashboard</h2>
      <p class="text-gray-600">Hallo <span class="font-bold text-gray-700">{{ username }}</span> Anda berhasil login!</p>
      <p class="text-gray-600">Level: <span class="font-bold text-gray-700">{{ userLevel }}</span></p>
      <div class="flex space-x-2 mt-4">
        <router-link to="/dashboard" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Dashboard</router-link>
        <router-link to="/galeri" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Galeri</router-link>
        <router-link to="/usertable" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Pengguna</router-link>
        <button @click="logout" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">LogOut</button>
      </div>
    </div>

    <main class="p-8 bg-slate-100 shadow-md rounded-lg">
      <div class="mb-4 px-4">
        <div class="flex justify-between items-center p-8">
          <h2 class="text-2xl font-bold text-gray-800 mx-20">Data Galeri</h2>
          <div class="space-x-2 mx-20">
            <router-link to="/GaleriTambah" id="btn-tambah" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Tambah</router-link>
            <button @click="refresh" id="btn-refresh" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Refresh</button>
          </div>
        </div>
        <label for="filter_q" class="block mb-2 p-8 pt-0 mx-20">
          <input type="text" id="filter_q" v-model="filter" placeholder="Filter nama galeri" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
        </label>
      </div>

      <div v-if="filteredGalleries.length === 0" class="flex flex-col items-center justify-center p-8">
        <img src="../assets/img/bg.png" alt="No Data" class="w-20 mb-4">
        <h1 class="text-2xl mb-2 text-gray-800">Galeri Anda Masih Kosong</h1>
        <p class="text-gray-500 text-xl">Pastikan Anda Mengisi Data Galeri</p>
      </div>

      <div v-else class="flex flex-wrap gap-5 p-8 -mt-10 mx-20">
        <div v-for="(gallery, index) in filteredGalleries" :key="gallery.id" class="px-2">
          <div class="galeri-item bg-white p-4 rounded-lg shadow-lg text-center w-52">
            <img :src="gallery.file" :alt="gallery.nama" class="w-full rounded-lg mb-2">
            <p class="mb-2">{{ gallery.nama }}</p>
            <button @click="editName(index)" class="bg-blue-500 text-white px-3 py-1 rounded transition hover:bg-blue-600 mb-2">Edit Nama</button>
            <button @click="editImage(index)" class="bg-blue-500 text-white px-3 py-1 rounded transition hover:bg-blue-600 mb-2">Edit Gambar</button>
            <button @click="deleteGaleri(index)" class="bg-red-500 text-white px-3 py-1 rounded transition hover:bg-red-600">Hapus</button>
          </div>
        </div>
      </div>

      <div v-if="isEditImageModalOpen" id="edit-image-modal" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-5 rounded-lg shadow-lg text-center">
          <h3 class="text-xl font-semibold mb-4">Edit Gambar</h3>
          <img :src="selectedGallery?.file" alt="Current Image" class="w-full rounded-lg mb-4">
          <label for="new-image-file" class="block mb-2">Upload Gambar Baru:</label>
          <input type="file" @change="handleFileUpload" id="new-image-file" accept="image/*" class="w-full p-2 border border-gray-300 rounded mb-4">
          <button @click="submitNewImage" :disabled="isProcessing" class="bg-blue-500 text-white px-4 py-2 rounded transition hover:bg-blue-600 mb-2">
            <span v-if="isProcessing">Processing...</span>
            <span v-else>Simpan</span>
          </button>
          <button @click="cancelEditImage" class="bg-gray-300 text-black px-4 py-2 rounded transition hover:bg-gray-400">Batal</button>
        </div>
      </div>

      <!-- Display error message -->
      <div v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</div>
    </main>
  </div>
</template>

<script>
import { useGaleriStore } from '../stores/galeriStores';
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';
import { useRouter } from 'vue-router';
import axios from 'axios';

const API_BASE_URL = 'http://localhost/smkti/FE-BE-galeri/restapi';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const username = computed(() => authStore.currentUser?.nama || "User");
    const userLevel = computed(() => authStore.currentUser?.level || "User");
    const galeriStore = useGaleriStore();
    const filter = ref('');
    const isEditImageModalOpen = ref(false);
    const selectedGallery = ref(null);
    const errorMessage = ref(''); // State for error messages
    const isProcessing = ref(false); // State for processing indicator

    const filteredGalleries = computed(() => {
      const galleries = galeriStore.galleries || []; // Update to use `galleries`
      return galleries.filter(gallery => 
        gallery && gallery.nama && gallery.nama.toLowerCase().includes(filter.value.toLowerCase())
      );
    });

    const logout = () => {
      localStorage.clear();
      authStore.currentUser = null;
      router.push('/');
    };

    const checkAuthToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Anda tidak memiliki akses ke halaman ini. Silakan login.");
        logout();
      }
    };

    const loadGalleries = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/'); // Redirect ke halaman login jika token tidak ada
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/galeri`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.data) {
          galeriStore.galleries = response.data.data; // Update the store directly
        } else {
          console.error('Data galeri tidak ditemukan');
        }
      } catch (error) {
        console.error('Error:', error);
        if (error.response?.status === 401) {
          alert("Session Anda telah berakhir. Silakan login kembali.");
          logout();
        } else {
          errorMessage.value = "Terjadi kesalahan saat memuat galeri. Silakan coba lagi."; // Set error message
        }
      }
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          selectedGallery.value.file = e.target.result; // Set the new image URL
        };
        reader.readAsDataURL(file);
      }
    };

    const editName = async (index) => {
      const galleryToEdit = filteredGalleries.value[index];
      const newName = prompt(`Masukkan Nama Baru untuk ${galleryToEdit.nama}`);

      if (newName) {
        try {
          const response = await axios.put(`${API_BASE_URL}/api/galeri/${galleryToEdit.id}`, {
            nama: newName
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            }
          });

          if (response.data.success) {
            alert("Nama galeri berhasil diperbarui");
            galleryToEdit.nama = newName; // Update the name locally
            galeriStore.galleries[index] = galleryToEdit; // Update the store
          } else {
            alert("Gagal memperbarui nama galeri");
          }
        } catch (error) {
          console.error('Error:', error);
          alert("Terjadi kesalahan saat memperbarui nama galeri. Silakan coba lagi.");
        }
      }
    };

    const editImage = (index) => {
      selectedGallery.value = { ...filteredGalleries.value[index] }; // Set the selected gallery
      isEditImageModalOpen.value = true; // Open the modal
    };

    const submitNewImage = async () => {
  if (!selectedGallery.value.file) {
    alert("Silakan unggah gambar baru terlebih dahulu.");
    return;
  }
  isProcessing.value = true; // Show processing state
  errorMessage.value = ''; // Clear previous error messages

  const formData = new FormData();
  formData.append('file', selectedGallery.value.file);
  formData.append('id', selectedGallery.value.id); // Append gallery ID

  try {
    const response = await axios.put(`${API_BASE_URL}/api/galeri/${selectedGallery.value.id}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      alert("Gambar berhasil diperbarui!");
      const index = galeriStore.galleries.findIndex(g => g.id === selectedGallery.value.id);
      if (index !== -1) {
        galeriStore.galleries[index].file = response.data.file; // Update the image URL
      }
      isEditImageModalOpen.value = false; // Close modal
      selectedGallery.value = null; // Reset selection
    } else {
      alert("Gagal memperbarui gambar. Silakan coba lagi.");
    }
  } catch (error) {
    console.error('Error:', error.response.data); // Log the server response
    errorMessage.value = "Terjadi kesalahan saat memperbarui gambar. Silakan coba lagi."; // Set error message
  } finally {
    isProcessing.value = false; // Reset processing state
  }
};


    const cancelEditImage = () => {
      isEditImageModalOpen.value = false; // Close modal
      selectedGallery.value = null; // Reset selection
    };

    const deleteGaleri = async (index) => {
      const galleryToDelete = filteredGalleries.value[index];
      const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus galeri ${galleryToDelete.nama}?`);

      if (confirmDelete) {
        try {
          const response = await axios.delete(`${API_BASE_URL}/api/galeri/${galleryToDelete.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (response.data.success) {
            galeriStore.galleries.splice(index, 1); // Remove gallery from store
            alert("Galeri berhasil dihapus.");
          } else {
            alert("Gagal menghapus galeri.");
          }
        } catch (error) {
          console.error('Error:', error);
          alert("Terjadi kesalahan saat menghapus galeri. Silakan coba lagi.");
        }
      }
    };

    const refresh = () => {
      loadGalleries(); // Refresh the gallery data
    };

    onMounted(() => {
      checkAuthToken(); // Check for auth token
      loadGalleries(); // Load galleries on component mount
    });

    return {
      username,
      userLevel,
      filter,
      filteredGalleries,
      logout,
      editName,
      editImage,
      deleteGaleri,
      isEditImageModalOpen,
      selectedGallery,
      submitNewImage,
      handleFileUpload,
      cancelEditImage,
      errorMessage,
      isProcessing,
      refresh,
    };
  },
};
</script>

<style scoped>
.galeri-item {
  transition: transform 0.2s;
}

.galeri-item:hover {
  transform: scale(1.05);
}
</style>
