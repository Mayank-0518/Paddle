import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import { authService } from '../api/auth';

const Signup = () => {
    const navigate = useNavigate();

    const handleSignup = async (formData) => {
        try {
            await authService.signup(formData);
            // Redirect to login page after successful signup
            navigate('/login');
        } catch (error) {
            console.error('Signup error:', error);
        }
    };

    return <AuthForm isAdmin={false} isSignup={true} onSubmit={handleSignup} />;
};

export default Signup;