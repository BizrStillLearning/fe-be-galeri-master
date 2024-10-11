import ApiService from '../api/ApiService';

const API_URL = 'http://localhost/smkti/FE-BE-galeri/restapi/api/galeri'; 

const GaleriRepository = {
  async getGalleries() {
    return await axios.get(`${API_URL}/galleries`);
  },
  async postGaleri(formGaleri) {
    return await axios.post(`${API_URL}/galleries`, formGaleri);
  },
  async getGaleriList() {
    try {
      const response = await ApiService.post(`${API_URL}/api/galeri`, FormData);

      if (response && response.data) {
        return response.data; 
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error while fetching gallery list:', error);
      throw error; 
    }
  },

  async addGaleri(galeriData) {
    try {
      // Mengirim permintaan POST untuk menambah galeri baru
      const response = await ApiService.post(API_URL, galeriData);
      if (response && response.data) {
        return response.data; 
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error while adding gallery:', error);
      throw error; 
    }
  },

  async editGaleri(galleryId, galeriData) {
    try {
      // Mengirim permintaan PUT untuk mengedit galeri berdasarkan ID
      const response = await ApiService.put(`${API_URL}/${galleryId}`, galeriData);
      if (response && response.data) {
        return response.data; 
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error while editing gallery:', error);
      throw error; 
    }
  },

  async deleteGaleri(galleryId) {
    try {
      // Mengirim permintaan DELETE untuk menghapus galeri berdasarkan ID
      const response = await ApiService.delete(`${API_URL}/${galleryId}`);
      if (response && response.data) {
        return response.data; 
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error while deleting gallery:', error);
      throw error; 
    }
  },
};

export default GaleriRepository;
