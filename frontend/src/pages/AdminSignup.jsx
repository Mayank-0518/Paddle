import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const AdminSignup = () => {
    return <AuthForm isAdmin={true} isSignup={true} />;
};

export default AdminSignup;