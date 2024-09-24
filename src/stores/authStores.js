// src/stores/authStores.js
import { defineStore } from 'pinia';
import AuthService from "@/services/AuthService";

export const UseAuthStore = defineStore('authStore', {
  state: () => ({
    formLogin: {
      email: null,
      password: null,
    },
  }),
  actions: {
    async prosesLogin() {

      const form = this.formLogin

      const authService = new AuthService()
      const result = await authService.authLoginPost(form.email, form.password)
      console.log(result)
    },
  },
});
