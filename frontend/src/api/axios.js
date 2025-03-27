import axios from 'axios';
const URL=import.meta.env.VITE_BACKEND_URL;
console.log(URL);
const api = axios.create({
    baseURL: `${URL}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
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
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('userToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; 