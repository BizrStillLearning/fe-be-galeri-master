import repository from "@/repositories/AuthRepository";

export default class AuthService {
	constructor() {
		this.dataRepository = repository;
	}

	async authLoginPost(email, password) {

		// layer untuk validasi
		if (!email) {
			throw Error("Email is required");
		}
		if (!password) {
			throw Error("Password is required");
		}

		const formData = {
			"email": email,
			"password": password
		}
		const a = await this.dataRepository.postAuthLogin(formData);
		console.log("aaaa")
		return a
		/*try {
		} catch (error) {
			console.log('--->',error)
			throw error
		}*/
	}

	async authCurrenrPost() {
		try {
			return await this.dataRepository.getPresenceSummary(params);
		} catch (error) {
			console.log(error)
		}
	}

}
