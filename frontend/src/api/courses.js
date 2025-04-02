import axios from './axios';

export const courseService = {
    // Course management (Admin)
    createCourse: async (courseData) => {
        // Ensure courseData is FormData and being sent with correct headers
        if (!(courseData instanceof FormData)) {
            throw new Error('Course data must be FormData');
        }

        // Log FormData entries for debugging
        
        
        const response = await axios.post('/admin/course', courseData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    updateCourse: async (courseData) => {
        // Ensure courseData is FormData
        if (!(courseData instanceof FormData)) {
            throw new Error('Course data must be FormData');
        }

      

        const response = await axios.put('/admin/course', courseData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
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

    //user's course endpoints
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