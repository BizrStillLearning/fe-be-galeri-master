import ApiService from '../api/ApiService';

const API_URL = 'http://localhost/smkti/FE-BE-galeri/restapi/api/users';

export const UserService = {
  async getUsers() {
    try {
      const response = await ApiService.get(API_URL);
      if (response && response.data) {
        // Simpan ke localStorage jika diperlukan
        localStorage.setItem('users', JSON.stringify(response.data));
        return response.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error while fetching users:', error);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      const response = await ApiService.delete(`${API_URL}/${userId}`);
      if (response) {
        // Menghapus pengguna dari localStorage jika berhasil
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(user => user.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
      } else {
        throw new Error('Failed to delete user from server');
      }
    } catch (error) {
      console.error('Error while deleting user:', error);
      throw error;
    }
  },

  async saveUser(user) {
    try {
      // Kirim permintaan POST untuk menambah pengguna baru
      const response = await ApiService.post(API_URL, user);
      if (response && response.data) {
        // Tambahkan pengguna baru ke localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(response.data); // Menggunakan data dari response (ID pengguna baru)
        localStorage.setItem('users', JSON.stringify(users));
        return response.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      // Menangani error yang mungkin muncul saat menyimpan pengguna
      console.error('Error while saving user:', error);
      throw error;
    }
  },

  async editUser(userId, userData) {
    try {
      // Kirim permintaan PUT untuk mengedit pengguna
      const response = await ApiService.put(`${API_URL}/${userId}`, userData);
      if (response && response.data) {
        // Update pengguna di localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const index = users.findIndex(user => user.id === userId);
        if (index !== -1) {
          users[index] = response.data; // Menggunakan data yang diupdate
          localStorage.setItem('users', JSON.stringify(users));
        }
        return response.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      // Menangani error yang mungkin muncul saat mengedit pengguna
      console.error('Error while editing user:', error);
      throw error;
    }
  }
};
