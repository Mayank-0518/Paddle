import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const CourseForm = ({ course, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        imageURL: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (course) {
            setFormData({
                title: course.title,
                description: course.description,
                price: course.price,
                imageURL: course.imageURL
            });
        }
    }, [course]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const courseData = {
                ...formData,
                price: Number(formData.price)
            };

            if (course) {
                courseData.courseId = course._id;
            }

            await onSubmit(courseData);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {course ? 'Edit Course' : 'Create New Course'}
            </h2>

            {error && (
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Course Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        required
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 
                        dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200"
                    />
                </div>

                <Input
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />

                <Input
                    label="Image URL"
                    name="imageURL"
                    type="url"
                    value={formData.imageURL}
                    onChange={handleChange}
                    required
                />

                <div className="flex space-x-4">
                    <Button
                        type="submit"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (course ? 'Update Course' : 'Create Course')}
                    </Button>
                    {onCancel && (
                        <Button
                            type="button"
                            variant="secondary"
                            fullWidth
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CourseForm; 