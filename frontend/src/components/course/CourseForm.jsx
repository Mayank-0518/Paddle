import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const CourseForm = ({ course, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        image: null,
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Populate form data if editing an existing course
    useEffect(() => {
        if (course) {
            setFormData({
                title: course.title || '',
                description: course.description || '',
                price: course.price || 0,
                image: null, // Reset image for editing
            });
            setPreviewUrl(course.imageURL || '');
        }
    }, [course]);

    // Handle input changes for text fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    

    // Handle image file selection and preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate required fields
            if (!formData.title || !formData.description || !formData.price) {
                setError('All fields are required');
                setLoading(false);
                return;
            }

            // Convert price to number and validate
            const priceNumber = Number(formData.price);
            if (isNaN(priceNumber) || priceNumber <= 0) {
                setError('Price must be a positive number');
                setLoading(false);
                return;
            }

            // Create FormData object with the exact field names expected by the backend
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title.trim());
            formDataToSend.append('description', formData.description.trim());
            formDataToSend.append('price', priceNumber);

            // Only append image if it's a new file or if we're creating a new course
            if (formData.image instanceof File) {
                formDataToSend.append('image', formData.image);
            } else if (!course) { // If creating new course, image is required
                setError('Please select an image');
                setLoading(false);
                return;
            }

            // If editing, append the course ID
            if (course?._id) {
                formDataToSend.append('courseId', course._id);
            }
            
            await onSubmit(formDataToSend);
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
                {/* Title Input */}
                <Input
                    label="Course Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                {/* Description Input */}
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

                {/* Price Input */}
                <Input
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />

                {/* Image Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Course Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 
                        dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200"
                    />
                    {previewUrl && (
                        <div className="mt-2">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="max-w-xs rounded-lg shadow-md"
                            />
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex space-x-4">
                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Processing...' : course ? 'Update Course' : 'Create Course'}
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