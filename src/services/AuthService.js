import repository from '@/repositories/AuthRepository';

export default class AuthService {
	constructor() {
		this.dataRepository = repository;
	}

	async authLoginPost(email, password) {

		// layer untuk validasi
		if (!email) {
			throw Error('Email is required');
		}
		if (!password) {
			throw Error('Password is required');
		}

		try {
			const formData = {
				"email": email,
				"password": password
			}
			return await this.dataRepository.postAuthLogin(formData);
		} catch (error) {
			console.log(error)
		}
	}

	async authCurrenrPost() {
		try {
			return await this.dataRepository.getPresenceSummary(params);
		} catch (error) {
			console.log(error)
		}
	}
}
