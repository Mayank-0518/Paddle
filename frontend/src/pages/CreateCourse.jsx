import React from 'react';
import { useNavigate } from 'react-router-dom';
import CourseForm from '../components/course/CourseForm';
import { courseService } from '../api/courses';

const CreateCourse = () => {
    const navigate = useNavigate();

    const handleSubmit = async (courseData) => {
        try {
            await courseService.createCourse(courseData);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Error creating course:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <CourseForm
                onSubmit={handleSubmit}
                onCancel={() => navigate('/admin/dashboard')}
            />
        </div>
    );
};

export default CreateCourse;