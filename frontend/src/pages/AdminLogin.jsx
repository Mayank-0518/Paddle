import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const AdminLogin = () => {
    return <AuthForm isAdmin={true} />;
};

export default AdminLogin;