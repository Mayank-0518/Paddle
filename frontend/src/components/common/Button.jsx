import React from 'react';
import { cn } from '../../lib/utils';

const Button = ({ children, className, variant = 'default', ...props }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200";
    
    const variants = {
        default: "bg-zinc-100 hover:bg-zinc-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-zinc-800 dark:text-white border border-zinc-300 dark:border-slate-700",
        danger: "bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-100 border border-red-300 dark:border-red-700",
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button; 