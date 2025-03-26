import axios from './axios';

export const courseService = {
    // Course management (Admin)
    createCourse: async (courseData) => {
        const response = await axios.post('/admin/course', courseData);
        return response.data;
    },

    updateCourse: async (courseData) => {
        const response = await axios.put('/admin/course', courseData);
        return response.data;
    },

    getAdminCourses: async () => {
        const response = await axios.get('/admin/course/bulk');
        return response.data.courses;
    },

    deleteCourse: async (courseId) => {
        const response = await axios.delete('/admin/course', {
            data: { courseId }
        });
        return response.data;
    },

    // Course operations (User)
    getAllCourses: async () => {
        const response = await axios.get('/courses/preview');
        return response.data;
    },

    purchaseCourse: async (courseId) => {
        const response = await axios.post('/courses/purchase', { courseId });
        return response.data;
    },

    getPurchasedCourses: async () => {
        const response = await axios.get('/user/purchases');
        return response.data;
    }
}; 