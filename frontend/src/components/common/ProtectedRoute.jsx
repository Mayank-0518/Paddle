import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem(role === 'admin' ? 'adminToken' : 'userToken');

    if (!token) {
        // Redirect to appropriate login page based on role
        return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
    }

    return children;
};

export default ProtectedRoute; 