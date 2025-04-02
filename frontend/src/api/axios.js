import axios from 'axios';
const URL=import.meta.env.VITE_BACKEND_URL;
console.log(URL);
const api = axios.create({
    baseURL: `${URL}`,
});

api.interceptors.request.use(
    (config) => {
        const adminToken = localStorage.getItem('adminToken');
        const userToken = localStorage.getItem('userToken');
        const token = adminToken || userToken;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

     

        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => {
        
        return response;
    },
    (error) => {
        console.error('Response Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('userToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; 