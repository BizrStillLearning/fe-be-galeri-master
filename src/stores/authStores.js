// src/stores/authStores.js
import { defineStore } from 'pinia';
import AuthService from "@/services/AuthService";

export const UseAuthStore = defineStore('authStore', {
  state: () => ({
    formLogin: {
      email: '',
      password: '',
    },
  }),
  actions: {
    async prosesLoginPost() {
      const form = this.formLogin

      try {
        const authService = new AuthService()
        const result = await authService.authLoginPost(form.email, form.password)
        console.log(result)
      }catch (e) {
        console.log(e)
      } finally {
        // dijalankan terus menerus
        console.log('finally')
      }
    },
  },
});
