import repository from "@/repositories/AuthRepository";

export default class AuthService {
  constructor() {
    this.dataRepository = repository;
  }

  async authLoginPost(email, password) {
    // Memeriksa apakah email dan password sudah diisi
    if (!email) {
      throw Error("Email is required");
    }
    if (!password) {
      throw Error("Password is required");
    }

    const formData = {
      email: email,
      password: password,
    };

    try {
      const response = await this.dataRepository.postAuthLogin(formData);
      
      // Cek apakah respons berhasil
      if (response && response.success) {
        console.log("Login response:", response);

        // Simpan data pengguna ke local storage
        const userData = {
          id: response.data.id,
          nama: response.data.nama,
          email: response.data.email,
          level: response.data.level,
          tgl_buat: response.data.tgl_buat,
          tgl_update: response.data.tgl_update,
        };

        // Simpan data pengguna dalam local storage
        localStorage.setItem('currentUser', JSON.stringify(userData));

        return response; 
      } else {
        // Lempar error jika login gagal
        throw Error(response.message || "Login failed");
      }
    } catch (error) {
      console.log('---> Error during login:', error);
      throw error; // Melempar error kembali ke pemanggil
    }
  }

  async authCurrentPost(params) {
    try {
      return await this.dataRepository.getPresenceSummary(params);
    } catch (error) {
      console.log('Error fetching current post:', error);
      throw error; // Melempar error jika terjadi kesalahan
    }
  }
}
