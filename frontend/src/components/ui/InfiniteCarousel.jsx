import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const InfiniteCarousel = ({ images }) => {
    const controls = useAnimation();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const startAnimation = () => {
        controls.start({
            x: '-50%',
            transition: {
                duration: 10,
                ease: "linear",
                repeat: Infinity,
            }
        });
    };

    useEffect(() => {
        startAnimation();
        return () => controls.stop();
    }, []);

    const handleMouseEnter = () => {
        setIsHovered(true);
        controls.stop();
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        startAnimation();
    };

    return (
        <div 
            className="relative w-full overflow-hidden  dark:bg-black py-12"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Left overlay */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-black to-transparent z-10" />
            
            <div className="relative w-full">
                <motion.div
                    className="flex"
                    animate={controls}
                    initial={{ x: '0%' }}
                >
                    {/* First set of images */}
                    <div className="flex gap-4 px-2">
                        {images.map((image, idx) => (
                            <div
                                key={`first-${idx}`}
                                className="relative flex-shrink-0 w-[300px] h-[200px] rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
                                onClick={() => navigate('/courses')}
                            >
                                <img
                                    src={image}
                                    alt={`Course ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                        ))}
                    </div>
                    {/* Duplicated set for seamless loop */}
                    <div className="flex gap-4 px-2">
                        {images.map((image, idx) => (
                            <div
                                key={`second-${idx}`}
                                className="relative flex-shrink-0 w-[300px] h-[200px] rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
                                onClick={() => navigate('/courses')}
                            >
                                <img
                                    src={image}
                                    alt={`Course ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-black to-transparent z-10" />
        </div>
    );
};

export default InfiniteCarousel; 