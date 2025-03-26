import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/course/CourseCard';
import CourseForm from '../components/course/CourseForm';
import Button from '../components/common/Button';
import { courseService } from '../api/courses';
import { authService } from '../api/auth';

const AdminDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    // Auto-hide notification after 3 seconds
    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification.show]);

    const fetchCourses = async () => {
        try {
            const courses = await courseService.getAdminCourses();
            setCourses(courses || []);
            setError('');
        } catch (err) {
            if (err.response?.status !== 404) {
                setError('Failed to fetch courses');
                console.error('Error fetching courses:', err);
            }
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCourse = async (courseData) => {
        try {
            await courseService.createCourse(courseData);
            setShowCreateForm(false);
            await fetchCourses();
            setNotification({
                show: true,
                message: 'Course created successfully!',
                type: 'success'
            });
        } catch (err) {
            setNotification({
                show: true,
                message: 'Error creating course. Please try again.',
                type: 'error'
            });
            console.error('Error creating course:', err);
        }
    };

    const handleEditCourse = (course) => {
        navigate(`/admin/edit-course/${course._id}`);
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await courseService.deleteCourse(courseId);
                fetchCourses();
            } catch (err) {
                setError('Failed to delete course');
                console.error('Error deleting course:', err);
            }
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-zinc-100 dark:bg-black">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {/* Notification Toast */}
                    {notification.show && (
                        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg transition-all transform translate-y-0 ${
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

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">Admin Dashboard</h1>
                        <div className="space-x-4">
                            <Button onClick={() => setShowCreateForm(true)}>
                                Create Course
                            </Button>
                           
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {showCreateForm ? (
                        <CourseForm
                            onSubmit={handleCreateCourse}
                            onCancel={() => setShowCreateForm(false)}
                        />
                    ) : courses.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-zinc-50 dark:bg-slate-900 rounded-lg shadow-md p-8 max-w-md mx-auto">
                                <svg 
                                    className="mx-auto h-12 w-12 text-zinc-400 dark:text-gray-500" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                                    />
                                </svg>
                                <h2 className="mt-4 text-xl font-semibold text-zinc-800 dark:text-white">No Courses Yet</h2>
                                <p className="mt-2 text-zinc-600 dark:text-gray-400">
                                    Get started by creating your first course. Share your knowledge with students around the world.
                                </p>
                                <div className="mt-6">
                                    <Button onClick={() => setShowCreateForm(true)}>
                                        Create Your First Course
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map(course => (
                                <CourseCard
                                    key={course._id}
                                    course={course}
                                    isAdmin={true}
                                    onEdit={handleEditCourse}
                                    onDelete={handleDeleteCourse}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default AdminDashboard; 