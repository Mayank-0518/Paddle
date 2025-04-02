import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseForm from '../components/course/CourseForm';
import { courseService } from '../api/courses';

const EditCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
                if (notification.type === 'success') {
                    navigate('/admin/dashboard');
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [notification.show, notification.type, navigate]);

    const fetchCourse = async () => {
        try {
            const courses = await courseService.getAdminCourses();
            const course = courses.find(c => c._id === courseId);
            if (course) {
                setCourse(course);
            } else {
                setError('Course not found');
            }
        } catch (err) {
            setError('Failed to fetch course');
            console.error('Error fetching course:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (courseData) => {
        try {
            // Ensure courseData is FormData and contains courseId
            if (!(courseData instanceof FormData)) {
                throw new Error('Course data must be FormData');
            }

            

            await courseService.updateCourse(courseData);
            setNotification({
                show: true,
                message: 'Course updated successfully!',
                type: 'success'
            });
        } catch (err) {
            setNotification({
                show: true,
                message: err.response?.data?.message || 'Failed to update course. Please try again.',
                type: 'error'
            });
            console.error('Error updating course:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-200">
            {notification.show && (
                <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg transition-all transform z-50 ${
                    notification.type === 'success' 
                        ? 'bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-100'
                        : 'bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100'
                }`}>
                    <div className="flex items-center">
                        {notification.type === 'success' ? (
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                            </svg>
                        )}
                        {notification.message}
                    </div>
                </div>
            )}

            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Course</h1>
                {error ? (
                    <div>
                        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded">
                            {error}
                        </div>
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                ) : (
                    <CourseForm
                        course={course}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate('/admin/dashboard')}
                    />
                )}
            </div>
        </div>
    );
};

export default EditCourse;