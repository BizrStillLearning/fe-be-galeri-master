import ApiService from "@/api/ApiService.js";

class AuthRepository {
	constructor() {
		this.apiService = ApiService;
		// this.apiService = apiService;
	}

	async postAuthLogin(formData) {
		return await this.apiService.post(`/api/auth/login`, formData);
	}

}

export default new AuthRepository()
