import axios from 'axios'
// import { HandlerAlertUnauthorized } from "@/utils/Helpers"

// Create an axios instance
const ApiService = axios.create({
	baseURL: "http://localhost/smkti/FE-BE-galeri/restapi",
	headers: {
		Accept: "application/json",
		"Access-Control-Allow-Origin": "Authorization",
		"Content-Type": "application/json",
		"X-Requested-With": "XMLHttpRequest"
	},
	mode: "no-cors",
	withCredentials: true,
	crossdomain: true
})

// Interceptor to add token to headers
ApiService.interceptors.request.use(
	(config) => {

		/*const localData = JSON.parse(localStorage.getItem('storediskola') || 'null')
		const token = localData?.userToken ?? ''
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}*/
		return config
	},
	(error) => Promise.reject(error)
)

// Applying the error handling function to the response interceptor
ApiService.interceptors.response.use(
	async (response) => {
		// Anda bisa melakukan pengecekan atau transformasi pada response di sini
		return response
	},
	async (error) => {
		// Anda bisa menggunakan async/await di sini jika perlu
		return error
	},
)

// A separate function to handle global error responses
function handleError(error) {
	if (error.response) {

		/*const responseError = {
			code: error.code,
			status: error.response.status,
			error: error.response.data.error || error.response.data.message,
			errorList: error.response.data.errors,
		}
		if (error.response.status === 307) {
			responseError.data = error.response.data
		}*/

		return Promise.reject(error.response)
	} else if (error.request) {
		console.log("Error with request:", error.request)
	}
	return Promise.reject(error)
}

export default ApiService
