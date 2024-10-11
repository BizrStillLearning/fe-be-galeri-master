import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost/smkti/FE-BE-galeri/restapi/api/galeri';

export const useGaleriStore = defineStore('galeri', {
  state: () => ({
    galleries: JSON.parse(localStorage.getItem('galleries')) || [], // Memuat galeri dari localStorage
    formGaleri: {
      nama: '', // Nama galeri
      imageFile: null // Menyimpan file gambar
    },
    isLoading: false, // Menyimpan status loading
    message: '' // Menyimpan pesan status
  }),
  actions: {
    async fetchGalleries() {
      this.isLoading = true; // Set loading state
      try {
        const token = localStorage.getItem('token'); // Ambil token
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` } // Kirim token di header
        });

        if (response.data) {
          this.galleries = response.data; // Update state galleries
          localStorage.setItem('galleries', JSON.stringify(this.galleries));
          return { success: true, message: 'Galeri berhasil diambil.' };
        } else {
          return { success: false, message: 'Gagal mengambil galeri.' };
        }
      } catch (error) {
        console.error('Error fetching galleries:', error);
        return { 
          success: false, 
          message: error.response?.data?.message || 'Terjadi kesalahan saat mengambil galeri.' 
        };
      } finally {
        this.isLoading = false; // Set loading state selesai
      }
    },

    async addGaleri() {
      if (!this.formGaleri.imageFile) {
        return { success: false, message: 'Silakan pilih file gambar.' }; // Tambahkan pemeriksaan file gambar
      }

      try {
        const token = localStorage.getItem('token'); // Ambil token
        const formData = new FormData(); // Buat FormData untuk mengirim file
        formData.append('nama', this.formGaleri.nama); // Menambahkan nama
        formData.append('image', this.formGaleri.imageFile); // Menambahkan file gambar

        const response = await axios.post(API_URL, formData, {
          headers: {
            Authorization: `Bearer ${token}`, // Kirim token di header
            'Content-Type': 'multipart/form-data' // Tentukan tipe konten
          }
        });

        if (response.data) {
          this.galleries.push(response.data); // Tambahkan galeri yang baru ditambahkan
          localStorage.setItem('galleries', JSON.stringify(this.galleries));
          this.message = 'Galeri berhasil ditambahkan.';
          return { success: true, message: this.message };
        } else {
          return { success: false, message: 'Gagal menambahkan galeri.' };
        }
      } catch (error) {
        console.error('Error adding gallery:', error);
        return { 
          success: false, 
          message: error.response?.data?.message || 'Terjadi kesalahan saat menambahkan galeri.' 
        };
      }
    },

    async deleteGallery(id) {
      try {
        const token = localStorage.getItem('token'); // Ambil token
        const response = await axios.delete(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Kirim token di header
          }
        });
    
        if (response.status === 200) {
          this.removeGaleri(id); // Hapus dari state
    
          // Hapus galeri dari local storage
          const galleries = JSON.parse(localStorage.getItem('galleries')) || [];
          const updatedGalleries = galleries.filter(galeri => galeri.id !== id); // Hapus galeri dari array
          localStorage.setItem('galleries', JSON.stringify(updatedGalleries)); // Simpan kembali ke local storage
    
          return { success: true, message: 'Galeri berhasil dihapus.' };
        } else {
          return { success: false, message: 'Gagal menghapus galeri.' };
        }
      } catch (error) {
        console.error('Error deleting gallery:', error);
        return { 
          success: false, 
          message: error.response?.data?.message || 'Terjadi kesalahan saat menghapus galeri.' 
        };
      }
    },

    async editGalleryName(id, newName) {
      try {
        const token = localStorage.getItem('token'); // Ambil token
        const response = await axios.put(`${API_URL}/${id}`, { nama: newName }, {
          headers: {
            Authorization: `Bearer ${token}`, // Kirim token di header
            'Content-Type': 'application/json' // Tentukan tipe konten
          }
        });

        if (response.data) {
          const galleryIndex = this.galleries.findIndex(gallery => gallery.id === id);
          if (galleryIndex !== -1) {
            this.galleries[galleryIndex].nama = newName; // Update nama galeri di state
            localStorage.setItem('galleries', JSON.stringify(this.galleries)); // Simpan perubahan di localStorage
          }
          return { success: true, message: 'Nama galeri berhasil diperbarui.' };
        } else {
          return { success: false, message: 'Gagal memperbarui nama galeri.' };
        }
      } catch (error) {
        console.error('Error updating gallery name:', error);
        return { 
          success: false, 
          message: error.response?.data?.message || 'Terjadi kesalahan saat memperbarui nama galeri.' 
        };
      }
    },

    async editGalleryImage(id, newImageFile) {
      if (!newImageFile) {
        return { success: false, message: 'Silakan pilih gambar baru.' };
      }

      try {
        const token = localStorage.getItem('token'); // Ambil token
        const formData = new FormData(); // Buat FormData untuk mengirim file
        formData.append('image', newImageFile); // Menambahkan file gambar baru

        const response = await axios.put(`${API_URL}/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`, // Kirim token di header
            'Content-Type': 'multipart/form-data' // Tentukan tipe konten
          }
        });

        if (response.data) {
          const galleryIndex = this.galleries.findIndex(gallery => gallery.id === id);
          if (galleryIndex !== -1) {
            this.galleries[galleryIndex].file = response.data.file; // Update gambar galeri di state
            localStorage.setItem('galleries', JSON.stringify(this.galleries)); // Simpan perubahan di localStorage
          }
          return { success: true, message: 'Gambar galeri berhasil diperbarui.' };
        } else {
          return { success: false, message: 'Gagal memperbarui gambar galeri.' };
        }
      } catch (error) {
        console.error('Error updating gallery image:', error);
        return { 
          success: false, 
          message: error.response?.data?.message || 'Terjadi kesalahan saat memperbarui gambar galeri.' 
        };
      }
    },

    removeGaleri(id) {
      this.galleries = this.galleries.filter(galeri => galeri.id !== id); // Filter untuk menghapus galeri
      localStorage.setItem('galleries', JSON.stringify(this.galleries)); // Simpan perubahan di localStorage
    },

    handleFileUpload(event) {
      this.formGaleri.imageFile = event.target.files[0]; // Menyimpan file gambar ke state
    },

    resetForm() {
      this.formGaleri.nama = ''; 
      this.formGaleri.imageFile = null; 
      this.message = ''; // Reset message
    }
  }
});
