import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost/php/',
})

export default axiosInstance;