import axios from 'axios';

// Membuat instance axios
const ApiService = axios.create({
  baseURL: "http://localhost/smkti/FE-BE-galeri-master/restapi", 
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  withCredentials: true, // Kirim cookie, header otentikasi, dll.
});

// Interceptor untuk menambahkan token ke header
ApiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') ?? ''; // Ambil token dari localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor untuk menangani respons dan kesalahan
ApiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Error response:", error.response.data);
      if (error.response.status === 401) {
        // Menghapus token yang kadaluarsa dan mengarahkan pengguna ke halaman login
        localStorage.removeItem('token'); 
        localStorage.removeItem('currentUser'); // Perbaiki dari 'currentUsers' menjadi 'currentUser'
        // Redirect ke login (sesuaikan rute login Anda)
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error("Error with request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    return Promise.reject(error);
  },
);

// Fungsi untuk menggunakan API galeri
export const GaleriService = {
  async addGaleri(formData) {
    return await ApiService.post('/galeri', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Menyertakan header untuk upload file
      }
    });
  },

  async getGaleri() {
    return await ApiService.get('/galeri');
  },

  async getGaleriById(id) {
    return await ApiService.get(`/galeri/${id}`);
  },

  async deleteGaleri(id) {
    return await ApiService.delete(`/galeri/${id}`);
  },
};

// Fungsi untuk menggunakan API pengguna
export const UserService = {
  async getAllUsers() {
    return await ApiService.get('/users'); // Ambil semua pengguna
  },

  async addUser(userData) {
    return await ApiService.post('/users', userData); // Tambah pengguna
  },

  async getUserById(id) {
    return await ApiService.get(`/users/${id}`); // Ambil pengguna berdasarkan ID
  },

  async updateUser(id, userData) {
    return await ApiService.put(`/users/${id}`, userData); // Update pengguna
  },

  async deleteUser(id) {
    return await ApiService.delete(`/users/${id}`); // Hapus pengguna
  },
};

export default ApiService;
