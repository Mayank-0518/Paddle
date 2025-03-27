import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import { authService } from '../../api/auth';

const Navbar = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('userToken');

    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
        if (savedDarkMode) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const handleLogout = () => {
        authService.logout();
    };

    return (
        <nav className="sticky top-0 z-40 bg-zinc-100 dark:bg-[#0A0F1C] backdrop-blur-sm border-b border-zinc-200 dark:border-gray-800 transition-all duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                                Paddle
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-colors duration-200"
                        >
                            {darkMode ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>

                        {!adminToken && !userToken ? (
                            <>
                                <Link to="/login">
                                    <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200">
                                        Login
                                    </button>
                                </Link>
                                <Link to="/admin/signup">
                                    <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20">
                                        Join as Creator
                                    </button>
                                </Link>
                                <Link to="/signup">
                                    <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20">
                                        Sign Up
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <>
                                {adminToken ? (
                                    <Link to="/admin/dashboard">
                                        <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200">
                                            Dashboard
                                        </button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/user/courses">
                                            <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200">
                                                Your Courses
                                            </button>
                                        </Link>
                                        <Link to="/courses">
                                            <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200">
                                                All Courses
                                            </button>
                                        </Link>
                                        <Link to="/user/purchase-courses">
                                            <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20">
                                                Purchase New Courses
                                            </button>
                                        </Link>
                                    </>
                                )}
                                <button 
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-zinc-800 dark:text-white bg-zinc-200 hover:bg-zinc-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-all duration-200"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 