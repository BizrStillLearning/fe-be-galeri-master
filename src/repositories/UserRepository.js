import ApiService from '../api/ApiService';

const API_URL = 'http://localhost/smkti/FE-BE-galeri/restapi/api/users';

const UserRepository = {
  async getUserList() {
    try {
      // Mengirim permintaan GET untuk mendapatkan daftar pengguna
      const response = await ApiService.get(API_URL);
      if (response && response.status === 200 && response.data) {
        // Menyimpan daftar pengguna di localStorage jika diperlukan
        localStorage.setItem('userList', JSON.stringify(response.data));
        return response.data; 
      } else {
        throw new Error('Invalid response from server while fetching user list');
      }
    } catch (error) {
      console.error('Error while fetching user list:', error.message);
      throw new Error('Failed to fetch user list. Please try again later.');
    }
  },

  async addUser(userData) {
    try {
      // Mengirim permintaan POST untuk menambah pengguna baru
      const response = await ApiService.post(API_URL, userData);
      if (response && response.status === 201 && response.data) {
        return response.data; 
      } else {
        throw new Error('Invalid response from server while adding user');
      }
    } catch (error) {
      console.error('Error while adding user:', error.message);
      throw new Error('Failed to add user. Please check your input and try again.');
    }
  },

  async editUser(userId, userData) {
    try {
      // Mengirim permintaan PUT untuk mengedit pengguna berdasarkan ID
      const response = await ApiService.put(`${API_URL}/${userId}`, userData);
      if (response && response.status === 200 && response.data) {
        return response.data; 
      } else {
        throw new Error('Invalid response from server while editing user');
      }
    } catch (error) {
      console.error('Error while editing user:', error.message);
      throw new Error('Failed to edit user. Please try again later.');
    }
  },

  async deleteUser(userId) {
    try {
      // Mengirim permintaan DELETE untuk menghapus pengguna berdasarkan ID
      const response = await ApiService.delete(`${API_URL}/${userId}`);
      if (response && response.status === 204) { // No Content
        return true; 
      } else {
        throw new Error('Invalid response from server while deleting user');
      }
    } catch (error) {
      console.error('Error while deleting user:', error.message);
      throw new Error('Failed to delete user. Please try again later.');
    }
  },
};

export default UserRepository;
