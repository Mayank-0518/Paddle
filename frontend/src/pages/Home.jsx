import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { BackgroundLines } from '../components/ui/BgLines';
import InfiniteCarousel from '../components/ui/InfiniteCarousel';
import { AnimatedTestimonials } from '../components/ui/Testimonial';
import { courseService } from '../api/courses';
import { Button as BorderButton } from '../components/ui/Borders';

const Home = () => {
    const [courseImages, setCourseImages] = useState([]);

    const testimonials = [
        {
            name: "Sarah Johnson",
            designation: "Web Development Student",
            quote: "This platform transformed my learning journey. The courses are well-structured and the instructors are incredibly knowledgeable. I went from beginner to confident developer in just months.",
            src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        },
        {
            name: "Michael Chen",
            designation: "Data Science Professional",
            quote: "The quality of content and hands-on projects here are unmatched. I've taken courses on other platforms, but none compare to the depth and practical approach offered here.",
            src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        },
        {
            name: "Emily Rodriguez",
            designation: "UI/UX Designer",
            quote: "As someone transitioning careers, these courses provided exactly what I needed. The community support and instructor feedback made all the difference in my learning experience.",
            src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        }
    ];

    useEffect(() => {
        const fetchCourseImages = async () => {
            try {
                const response = await courseService.getAllCourses();
                const images = response.courses.map(course => course.imageURL);
                setCourseImages(images);
            } catch (error) {
                console.error('Error fetching course images:', error);
            }
        };

        fetchCourseImages();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-black transition-colors duration-200">
            {/* Hero Section - Full Screen */}
            <div className="relative h-screen flex items-center justify-center">
                <BackgroundLines className="absolute inset-0 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-zinc-800 dark:text-white sm:text-5xl md:text-6xl">
                            <span className="block">Learn New Skills</span>
                            <span className="block text-blue-600 dark:text-blue-400">Start Your Journey Today</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-zinc-600 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            Discover a world of knowledge with our comprehensive online courses.
                        </p>
                        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                            <div className="rounded-md shadow">
                                <Link to="/courses">
                                    <Button>Browse Courses</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="relative bg-zinc-100 dark:bg-black">
                {/* Course Preview Carousel */}
                {courseImages.length > 0 && (
                    <div className="relative z-10 py-16 bg-zinc-100 dark:bg-black">
                        <InfiniteCarousel images={courseImages} />
                    </div>
                )}

                {/* Features Section */}
                <div className="relative z-10 py-16 bg-zinc-100 dark:bg-black">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center text-zinc-800 dark:text-white mb-12">
                            Why Choose Us
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <BorderButton
                                borderRadius="1rem"
                                className="flex flex-col items-center justify-center p-6 text-center"
                                containerClassName="w-full h-full"
                            >
                                <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mb-4">Expert Instructors</h3>
                                <p className="text-zinc-600 dark:text-gray-300 mb-4">Learn from industry professionals with years of experience in their respective fields.</p>
                                <ul className="text-zinc-500 dark:text-gray-400 text-sm text-left space-y-2">
                                    <li>• Industry veterans with 10+ years experience</li>
                                    <li>• Regular updates to course content</li>
                                    <li>• Personalized feedback and guidance</li>
                                </ul>
                            </BorderButton>

                            <BorderButton
                                borderRadius="1rem"
                                className="flex flex-col items-center justify-center p-6 text-center"
                                containerClassName="w-full h-full"
                            >
                                <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mb-4">Flexible Learning</h3>
                                <p className="text-zinc-600 dark:text-gray-300 mb-4">Study at your own pace with lifetime access to all course materials.</p>
                                <ul className="text-zinc-500 dark:text-gray-400 text-sm text-left space-y-2">
                                    <li>• Self-paced learning modules</li>
                                    <li>• Mobile-friendly content</li>
                                    <li>• 24/7 course access</li>
                                </ul>
                            </BorderButton>

                            <BorderButton
                                borderRadius="1rem"
                                className="flex flex-col items-center justify-center p-6 text-center"
                                containerClassName="w-full h-full"
                            >
                                <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mb-4">Project-Based Learning</h3>
                                <p className="text-zinc-600 dark:text-gray-300 mb-4">Apply your knowledge with hands-on projects and real-world exercises.</p>
                                <ul className="text-zinc-500 dark:text-gray-400 text-sm text-left space-y-2">
                                    <li>• Real-world project portfolio</li>
                                    <li>• Industry-standard tools</li>
                                    <li>• Practical assignments</li>
                                </ul>
                            </BorderButton>
                        </div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="relative z-10 py-16 bg-zinc-100 dark:bg-black">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center text-zinc-800 dark:text-white mb-12">
                            What Our Students Say
                        </h2>
                        <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;