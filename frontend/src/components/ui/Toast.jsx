import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColor = type === 'success' 
        ? 'bg-green-500' 
        : type === 'error' 
            ? 'bg-red-500' 
            : 'bg-blue-500';

    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={`fixed left-4 bottom-4 z-[100] ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg`}
        >
            {message}
        </motion.div>
    );
};

export default Toast; 