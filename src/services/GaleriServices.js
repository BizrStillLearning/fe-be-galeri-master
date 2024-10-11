import GaleriRepository from "@/repositories/GaleriRepositories";

export default class GaleriService {
  constructor() {
    this.dataRepository = new GaleriRepository(); // Pastikan ini sesuai dengan cara Anda menginisialisasi repository
  }

  // Fungsi untuk menambahkan galeri baru
  async addGaleriPost(nama, image) {
    // Memeriksa apakah nama dan gambar sudah diisi
    if (!nama) {
      throw new Error("Nama galeri is required");
    }
    if (!image) {
      throw new Error("Image is required");
    }

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('image', image);

    try {
      const response = await this.dataRepository.postGaleri(formData);
      
      // Cek apakah respons berhasil
      if (response && response.success) {
        console.log("Galeri post response:", response);

        // Simpan data galeri baru ke local storage
        const newGallery = {
          id: response.data.id,
          nama: response.data.nama,
          image_url: response.data.image_url,
          tgl_buat: response.data.tgl_buat,
          tgl_update: response.data.tgl_update,
        };

        const galleries = JSON.parse(localStorage.getItem('galeri')) || [];
        galleries.push(newGallery);
        localStorage.setItem('galeri', JSON.stringify(galleries));

        return newGallery; // Kembalikan galeri baru
      } else {
        throw new Error(response.message || "Failed to add gallery");
      }
    } catch (error) {
      console.error('---> Error during gallery post:', error);
      throw error; 
    }
  }

  // Fungsi untuk mendapatkan data galeri
  async getGaleriList() {
    try {
      const response = await this.dataRepository.getGaleri();
      
      // Cek apakah respons berhasil
      if (response && response.success) {
        console.log("Galeri list response:", response);

        // Simpan daftar galeri ke local storage
        localStorage.setItem('galeri', JSON.stringify(response.data));

        return response.data; // Mengembalikan data galeri
      } else {
        throw new Error(response.message || "Failed to load galleries");
      }
    } catch (error) {
      console.error('---> Error fetching gallery list:', error);
      throw error; 
    }
  }

  // Fungsi untuk mengedit galeri
  async editGaleriPost(id, nama, image) {
    if (!id) {
      throw new Error("Gallery ID is required");
    }
    if (!nama) {
      throw new Error("Gallery name is required");
    }

    const formData = new FormData();
    formData.append('nama', nama);
    if (image) {
      formData.append('image', image); // Sertakan image jika ada
    }

    try {
      const response = await this.dataRepository.putGaleri(id, formData);
      
      // Cek apakah respons berhasil
      if (response && response.success) {
        console.log("Galeri edit response:", response);

        const galleries = JSON.parse(localStorage.getItem('galeri')) || [];
        const index = galleries.findIndex(galeri => galeri.id === id);
        if (index !== -1) {
          galleries[index] = {
            ...galleries[index],
            nama: response.data.nama,
            image_url: response.data.image_url,
            tgl_update: response.data.tgl_update,
          };
          localStorage.setItem('galeri', JSON.stringify(galleries));
        }

        return response; 
      } else {
        throw new Error(response.message || "Failed to edit gallery");
      }
    } catch (error) {
      console.error('---> Error during gallery edit:', error);
      throw error; 
    }
  }

  // Fungsi untuk menghapus galeri
  async deleteGaleri(id) {
    if (!id) {
      throw new Error("Gallery ID is required");
    }

    try {
      const response = await this.dataRepository.deleteGaleri(id);
      
      // Cek apakah respons berhasil
      if (response && response.success) {
        console.log("Galeri delete response:", response);

        const galleries = JSON.parse(localStorage.getItem('galeri')) || [];
        const updatedGalleries = galleries.filter(galeri => galeri.id !== id);
        localStorage.setItem('galeri', JSON.stringify(updatedGalleries));

        return response; 
      } else {
        throw new Error(response.message || "Failed to delete gallery");
      }
    } catch (error) {
      console.error('---> Error during gallery delete:', error);
      throw error; 
    }
  }
}
