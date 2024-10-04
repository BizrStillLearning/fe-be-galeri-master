import ApiService from '../api/ApiService';

const API_URL = 'http://localhost/smkti/FE-BE-galeri/restapi'; 

const AuthRepository = {
  async postAuthLogin(formData) {
    try {
      // Mengirim permintaan login ke API
      const response = await ApiService.post(`${API_URL}/api/auth/login`, formData);
      
      // Pastikan respons memiliki data yang diharapkan
      if (response && response.data) {
        return response.data; 
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error during API call:', error);
      throw error; 
    }
  },
};

export default AuthRepository;
