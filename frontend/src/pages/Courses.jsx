import React, { useState, useEffect } from 'react';
import CourseCard from '../components/course/CourseCard';
import { courseService } from '../api/courses';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await courseService.getAllCourses();
            setCourses(response.courses || []);
        } catch (err) {
            setError('Failed to fetch courses');
            console.error('Error fetching courses:', err);
            setCourses([]);
        } finally {
            setLoading(false);
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
        <div className="min-h-screen bg-zinc-100 dark:bg-black px-[110px] py-[50px]">
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-8">Available Courses</h1>

            {error && (
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {courses && courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <CourseCard
                            key={course._id}
                            course={course}
                            showPreview={true}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-zinc-600 dark:text-gray-300 text-lg">No courses available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default Courses; 