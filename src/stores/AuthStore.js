import { defineStore } from 'pinia';
import AuthRepository from '../repositories/AuthRepository'; 

export const useAuthStore = defineStore('auth', {
  state: () => ({
    formLogin: {
      email: '',
      password: ''
    },
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null, // Memuat data dari localStorage
  }),
  actions: {
    async prosesLoginPost() {
      try {
        const response = await AuthRepository.postAuthLogin(this.formLogin);
        
        // Debug: Lihat respons dari server
        console.log("Login response:", response);

        if (response.data) {
          this.currentUser = {
            id: response.data.id,
            nama: response.data.nama,
            email: response.data.email,
            level: response.data.level,
            tgl_buat: response.data.tgl_buat,
            tgl_update: response.data.tgl_update
          };

          if (response.token) {
            localStorage.setItem('token', response.token);
          }

          localStorage.setItem('currentUser', JSON.stringify(this.currentUser)); // Menyimpan currentUser ke localStorage
          
          return { success: true, message: response.message };
        } else {
          return { success: false, message: 'Login gagal, tidak ada data pengguna.' };
        }
      } catch (error) {
        console.error('Error during login:', error);
        return { 
          success: false, 
          message: error.response?.data?.message || 'Terjadi kesalahan saat login.' 
        };
      }
    },

    logout() {
      this.currentUser = null;
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
  },
});
