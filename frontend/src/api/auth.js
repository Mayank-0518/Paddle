import api from './axios';

export const authService = {
    // User authentication
    userSignup: async (userData) => {
        const response = await api.post('/user/signup', userData);
        return response.data;
    },

    userSignin: async (credentials) => {
        const response = await api.post('/user/signin', credentials);
        return response.data;
    },

    // Admin authentication
    adminSignup: async (adminData) => {
        const response = await api.post('/admin/signup', adminData);
        return response.data;
    },

    adminSignin: async (credentials) => {
        const response = await api.post('/admin/signin', credentials);
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('userToken');
        window.location.href = '/';
    }
}; 