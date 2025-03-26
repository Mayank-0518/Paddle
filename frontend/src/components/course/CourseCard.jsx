import React from 'react';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ 
    course, 
    onPurchase, 
    onEdit, 
    onDelete, 
    isAdmin = false,
    isPurchased = false 
}) => {
    const navigate = useNavigate();

    const handlePurchase = () => {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) {
            alert('Please login to purchase courses');
            navigate('/login');
            return;
        }
        onPurchase(course._id);
    };

    const handleDelete = async () => {
        try {
            const confirmed = window.confirm('Are you sure you want to delete this course?');
            if (confirmed) {
                await onDelete(course._id);
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Failed to delete course. Please try again.');
        }
    };

    return (
        <div className="bg-zinc-50 dark:bg-[#0A0F1C] rounded-lg overflow-hidden h-full flex flex-col shadow-lg">
            <img 
                src={course.imageURL} 
                alt={course.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x225?text=Course+Image';
                }}
            />
            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-2xl font-semibold mb-2 text-black dark:text-white">
                    {course.title}
                </h3>
                <p className="text-zinc-600 dark:text-gray-400 mb-8 flex-1">
                    {course.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold text-[#4B83F2]">
                        ₹{course.price}
                    </span>
                    {isAdmin ? (
                        <div className="space-x-2">
                            <button
                                onClick={() => onEdit(course)}
                                className="px-4 py-2 rounded-lg font-medium bg-zinc-200 hover:bg-zinc-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-zinc-800 dark:text-white"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg font-medium bg-zinc-200 hover:bg-zinc-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-zinc-800 dark:text-white"
                            >
                                Delete
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handlePurchase}
                            disabled={isPurchased}
                            className={`px-6 py-2 rounded-lg font-medium ${
                                isPurchased 
                                ? "bg-green-800 text-green-100 cursor-not-allowed" 
                                : "bg-[#4B83F2] hover:bg-[#3A6CD1] text-white"
                            }`}
                        >
                            {isPurchased ? 'Purchased' : 'Purchase'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseCard; 