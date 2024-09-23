// src/stores/galeriStores.js
import { defineStore } from 'pinia';

export const useGaleriStore = defineStore('galeri', {
  state: () => ({
    galeriList: [], // Daftar galeri
  }),
  actions: {
    addGaleri(galeri) {
      this.galeriList.push(galeri); // Menambahkan galeri baru
    },
    deleteGaleri(index) {
      this.galeriList.splice(index, 1); // Menghapus galeri berdasarkan index
    },
    editGaleri(index, updatedGaleri) {
      this.galeriList[index] = updatedGaleri; // Mengupdate galeri berdasarkan index
    },
  },
});
