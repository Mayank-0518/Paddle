import React, { useState, useEffect } from 'react';
import CourseCard from '../components/course/CourseCard';
import { courseService } from '../api/courses';
import Toast from '../components/ui/Toast';
import { AnimatePresence } from 'framer-motion';

const PurchaseCourses = () => {
    const [courses, setCourses] = useState([]);
    const [purchasedCourses, setPurchasedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        fetchData();
    }, []); // Only fetch on initial load

    const fetchData = async () => {
        try {
            const [coursesResponse, purchasesResponse] = await Promise.all([
                courseService.getAllCourses(),
                courseService.getPurchasedCourses()
            ]);

            setCourses(coursesResponse.courses || []);
            const purchasedIds = (purchasesResponse.purchases || []).map(p => p.courseId._id);
            setPurchasedCourses(purchasedIds);
        } catch (err) {
            setError('Failed to fetch courses');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (courseId) => {
        try {
            // Optimistically update the UI
            setPurchasedCourses(prev => [...prev, courseId]);
            
            // Make the API call
            await courseService.purchaseCourse(courseId);
            
            // Show success toast
            setToast({
                show: true,
                message: 'Course purchased successfully!',
                type: 'success'
            });
        } catch (err) {
            // Revert the optimistic update on error
            setPurchasedCourses(prev => prev.filter(id => id !== courseId));
            setToast({
                show: true,
                message: err.response?.data?.message || 'Failed to purchase course. Please try again.',
                type: 'error'
            });
            console.error('Error purchasing course:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const unpurchasedCourses = courses.filter(course => !purchasedCourses.includes(course._id));

    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-black px-[110px] py-[50px]">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-8">Purchase Courses</h1>

                {error && (
                    <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {unpurchasedCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {unpurchasedCourses.map(course => (
                            <CourseCard
                                key={course._id}
                                course={course}
                                onPurchase={handlePurchase}
                                showPurchaseButton={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No new courses available for purchase.</p>
                    </div>
                )}
            </div>
            <AnimatePresence>
                {toast.show && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast({ ...toast, show: false })}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default PurchaseCourses; 