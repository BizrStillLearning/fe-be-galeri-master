import axios from 'axios';

// Create an axios instance
const ApiService = axios.create({
	baseURL: "http://localhost/smkti/FE-BE-galeri-master/restapi", // Pastikan URL ini benar
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		"X-Requested-With": "XMLHttpRequest"
	},
	withCredentials: true, // Kirim cookie, header otentikasi, dll.
});

// Interceptor to add token to headers
ApiService.interceptors.request.use(
	(config) => {
		// Uncomment if you need to add Authorization token
		/* const localData = JSON.parse(localStorage.getItem('storediskola') || 'null');
		const token = localData?.userToken ?? '';
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		} */
		return config;
	},
	(error) => Promise.reject(error)
);

// Interceptor for handling responses and errors
ApiService.interceptors.response.use(
	(response) => {
		// Handle the response if necessary
		return response;
	},
	(error) => {
		// Handle errors globally
		if (error.response) {
			console.error("Error response:", error.response.data);
		} else if (error.request) {
			console.error("Error with request:", error.request);
		} else {
			console.error("Error message:", error.message);
		}
		return Promise.reject(error);
	},
);

export default ApiService;
