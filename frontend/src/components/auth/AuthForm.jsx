import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { authService } from '../../api/auth';

const AuthForm = ({ isSignup = false }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        confirmPassword: ''
    });
    const [isCreator, setIsCreator] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            if (isSignup) {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                await authService.userSignup(formData);
            } else {
                const { token } = await authService[isCreator ? 'adminSignin' : 'userSignin']({
                    email: formData.email,
                    password: formData.password
                });
                localStorage.setItem(isCreator ? 'adminToken' : 'userToken', token);
            }
            
            navigate(isCreator ? '/admin/dashboard' : '/user/courses');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-zinc-50 dark:bg-slate-900 p-8 rounded-lg border border-zinc-300 dark:border-slate-800">
                    <h2 className="text-3xl font-bold text-zinc-800 dark:text-white text-center">
                        {isSignup ? 'Create Account' : 'Sign in to your account'}
                    </h2>
                    <p className="mt-2 text-center text-zinc-600 dark:text-gray-300">
                        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <a 
                            href={isSignup ? '/login' : '/signup'} 
                            className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
                        >
                            {isSignup ? 'Sign in' : 'Sign up'}
                        </a>
                        {!isSignup && (
                            <span className="block mt-2">
                                Want to become a course creator?{' '}
                                <a 
                                    href="/admin/signup" 
                                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
                                >
                                    Sign up as creator
                                </a>
                            </span>
                        )}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded relative">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {isSignup && (
                            <>
                                <Input
                                    label="First Name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Last Name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                />
                            </>
                        )}
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {isSignup && (
                            <Input
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        )}
                        {!isSignup && (
                            <div className="flex items-center">
                                <input
                                    id="creator-checkbox"
                                    name="creator-checkbox"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                    checked={isCreator}
                                    onChange={(e) => setIsCreator(e.target.checked)}
                                />
                                <label htmlFor="creator-checkbox" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                    Login as Course Creator
                                </label>
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (isSignup ? 'Sign up' : 'Sign in')}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AuthForm; 