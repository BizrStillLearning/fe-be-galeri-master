import { defineStore } from 'pinia';
import { UserService } from '../services/UserService'; // Sesuaikan dengan path file service Anda

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [], // Daftar pengguna
  }),

  actions: {
    // Memuat daftar pengguna dari API
    async loadUsers() {
      try {
        const response = await UserService.getUsers();

        // Pastikan response.data adalah array
        if (response && Array.isArray(response.data)) {
          this.users = response.data;
          this.saveToLocalStorage(); // Simpan ke localStorage
        } else {
          throw new Error('Data pengguna yang diterima bukan array.');
        }
      } catch (error) {
        console.error('Error loading users:', error.message || error);
      }
    },

    // Menambahkan pengguna baru
    async addUser(userData) {
      if (userData && userData.nama && userData.email && userData.no_telpon && userData.level) {
        try {
          const savedUser = await UserService.saveUser(userData);

          // Jika pengguna berhasil disimpan, tambahkan ke state
          if (savedUser) {
            this.users.push(savedUser);
            this.saveToLocalStorage(); // Simpan perubahan ke localStorage
          } else {
            throw new Error('Pengguna tidak berhasil disimpan.');
          }
        } catch (error) {
          console.error('Error while saving user:', error.response?.data?.message || error.message);
        }
      } else {
        console.error('Data pengguna tidak valid. Pastikan semua field diisi.');
      }
    },

    // Mengedit pengguna berdasarkan ID
    async editUser(userId, updatedData) {
      try {
        const updatedUser = await UserService.editUser(userId, updatedData);

        // Cari pengguna di state dan update datanya
        const index = this.users.findIndex(user => user.id === userId);
        if (index !== -1 && updatedUser) {
          this.users[index] = updatedUser;
          this.saveToLocalStorage(); // Simpan perubahan ke localStorage
        } else {
          throw new Error('Pengguna tidak ditemukan atau data tidak valid.');
        }
      } catch (error) {
        console.error('Error while editing user:', error.response?.data?.message || error.message);
      }
    },

    // Menghapus pengguna berdasarkan ID
    async deleteUser(userId) {
      try {
        const response = await UserService.deleteUser(userId);

        // Jika pengguna berhasil dihapus, hapus dari state
        if (response.success) {
          this.users = this.users.filter(user => user.id !== userId);
          this.saveToLocalStorage(); // Simpan perubahan ke localStorage
        } else {
          throw new Error('Pengguna gagal dihapus.');
        }
      } catch (error) {
        console.error('Error while deleting user:', error.response?.data?.message || error.message);
      }
    },

    // Menyimpan data pengguna ke localStorage
    saveToLocalStorage() {
      try {
        localStorage.setItem('users', JSON.stringify(this.users));
      } catch (error) {
        console.error('Error while saving to localStorage:', error.message || error);
      }
    },

    // Memuat data pengguna dari localStorage
    loadFromLocalStorage() {
      try {
        const usersFromStorage = localStorage.getItem('users');
        if (usersFromStorage) {
          const parsedUsers = JSON.parse(usersFromStorage);
          if (Array.isArray(parsedUsers)) {
            this.users = parsedUsers; // Memuat data pengguna dari localStorage
          } else {
            throw new Error('Data di localStorage tidak valid.');
          }
        }
      } catch (error) {
        console.error('Error while loading from localStorage:', error.message || error);
      }
    },
  },
});
