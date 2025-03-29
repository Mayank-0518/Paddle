import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminSignup = lazy(() => import('./pages/AdminSignup'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CreateCourse = lazy(() => import('./pages/CreateCourse'));
const EditCourse = lazy(() => import('./pages/EditCourse'));
const UserCourses = lazy(() => import('./pages/UserCourses'));
const Courses = lazy(() => import('./pages/Courses'));
const PurchaseCourses = lazy(() => import('./pages/PurchaseCourses'));

function App() {
    useEffect(() => {
        // Set dark mode as default
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
    }, []);

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <Navbar />
                <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/signup" element={<AdminSignup />} />

                        {/* Protected Admin Routes */}
                        <Route 
                            path="/admin/dashboard" 
                            element={
                                <ProtectedRoute role="admin">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/admin/create-course" 
                            element={
                                <ProtectedRoute role="admin">
                                    <CreateCourse />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/admin/edit-course/:courseId" 
                            element={
                                <ProtectedRoute role="admin">
                                    <EditCourse />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Protected User Routes */}
                        <Route 
                            path="/user/courses" 
                            element={
                                <ProtectedRoute role="user">
                                    <UserCourses />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/user/purchase-courses" 
                            element={
                                <ProtectedRoute role="user">
                                    <PurchaseCourses />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Catch all route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </div>
        </Router>
    );
}

export default App;