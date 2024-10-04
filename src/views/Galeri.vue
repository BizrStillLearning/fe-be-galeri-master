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
  </div>

  <main class="p-8 bg-slate-100 shadow-md rounded-lg">
    <div class="mb-4 px-4">
      <div class="flex justify-between items-center p-8">
        <h2 class="text-2xl font-bold text-gray-800">Data Galeri</h2>
        <div class="space-x-2">
          <router-link to="/GaleriTambah" id="btn-tambah" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Tambah</router-link>
          <button @click="refresh" id="btn-refresh" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Refresh</button>
        </div>
      </div>
      <label for="filter_q" class="block mb-2 p-8 pt-0">
        <input type="text" id="filter_q" v-model="filter" placeholder="Filter nama galeri" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
      </label>
    </div>
    <div v-if="filteredGalleries.length === 0" class="flex flex-col items-center justify-center p-8">
      <img src="../assets/img/bg.png" alt="No Data" class="w-20 mb-4">
      <h1 class="text-2xl mb-2 text-gray-800">Galeri Anda Masih Kosong</h1> 
      <p class="text-gray-500 text-xl">Pastikan Anda Mengisi Data Galeri</p>
    </div>

    <div v-else class="flex flex-wrap gap-5 p-8">
      <div v-for="(gallery, index) in filteredGalleries" :key="index" class="px-2">
        <div class="galeri-item bg-white p-4 rounded-lg shadow-lg text-center w-52">
          <img :src="gallery.imageUrl" :alt="gallery.nama" class="w-full rounded-lg mb-2">
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
        <img :src="selectedGallery.imageUrl" alt="Current Image" class="w-full rounded-lg mb-4">
        <label for="new-image-file" class="block mb-2">URL Gambar Baru:</label>
        <input type="file" @change="handleFileUpload" id="new-image-file" accept="image/*" class="w-full p-2 border border-gray-300 rounded mb-4">
        <button @click="submitNewImage" class="bg-blue-500 text-white px-4 py-2 rounded transition hover:bg-blue-600 mb-2">Simpan</button>
        <button @click="cancelEditImage" class="bg-gray-300 text-black px-4 py-2 rounded transition hover:bg-gray-400">Batal</button>
      </div>
    </div>
  </main>
</template>

<script>
import { useGaleriStore } from '../stores/galeriStores';
import { ref } from 'vue';
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
      filter: '',
      galeriStore: useGaleriStore(),
      username,
      userLevel,
      logout,
      filteredGalleries: [], // Menyimpan daftar galeri yang difilter
      timeout: null,
      isEditImageModalOpen: false,
      selectedGallery: null,
      newImageFile: null,
    };
  },
  watch: {
    filter(newFilter) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.filterGalleries(newFilter);
      }, 1500);
    },
  },
  methods: {
    filterGalleries(newFilter) {
      this.filteredGalleries = this.galeriStore.galeriList.filter(gallery => 
        gallery.nama.toLowerCase().includes(newFilter.toLowerCase())
      );
    },
    editName(index) {
      const newName = prompt("Masukkan nama baru:", this.galeriStore.galeriList[index].nama);
      if (newName) {
        this.galeriStore.editGaleri(index, { ...this.galeriStore.galeriList[index], nama: newName });
        alert(`Nama telah diubah menjadi: ${newName}`);
      }
    },
    deleteGaleri(index) {
      if (confirm("Apakah Anda yakin ingin menghapus gambar?")) {
        this.galeriStore.deleteGaleri(index);
      }
    },
    editImage(index) {
      this.selectedGalleryIndex = index;
      this.selectedGallery = this.galeriStore.galeriList[index];
      this.isEditImageModalOpen = true;
    },
    handleFileUpload(event) {
      this.newImageFile = event.target.files[0];
    },
    submitNewImage() {
      if (!this.newImageFile) {
        alert('Silakan pilih file gambar baru.');
        return;
      }

      const newImageUrl = URL.createObjectURL(this.newImageFile);
      this.galeriStore.galeriList[this.selectedGalleryIndex].imageUrl = newImageUrl;

      this.isEditImageModalOpen = false; 
      this.newImageFile = null; 
      this.selectedGallery = null; 
    },
    cancelEditImage() {
      this.isEditImageModalOpen = false;
      this.newImageFile = null;
      this.selectedGallery = null;
    },
  },
  mounted() {
    this.filteredGalleries = this.galeriStore.galeriList; // Initialize filtered galleries
  },
};
</script>
