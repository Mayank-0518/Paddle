import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/course/CourseCard';
import Button from '../components/common/Button';
import { courseService } from '../api/courses';

const UserCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPurchasedCourses();
    }, []);

    const fetchPurchasedCourses = async () => {
        try {
            const response = await courseService.getPurchasedCourses();
            setCourses(response.purchases || []);
        } catch (err) {
            setError('Failed to fetch your courses');
            console.error('Error fetching courses:', err);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-black px-[100px] py-[50px]">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">Your Courses</h1>
                    <Button onClick={() => navigate('/user/purchase-courses')}>
                        Purchase New Courses
                    </Button>
                </div>

                {error && (
                    <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {courses && courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(purchase => (
                            <CourseCard
                                key={purchase.courseId._id}
                                course={purchase.courseId}
                                isPurchased={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">You haven't purchased any courses yet.</p>
                        <Button onClick={() => navigate('/user/purchase-courses')}>
                            Browse Available Courses
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCourses; 