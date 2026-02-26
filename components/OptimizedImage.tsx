import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string; // Appended to the wrapper div
    imgClassName?: string; // Appended to the img tag
    skeletonClassName?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    imgClassName = '',
    skeletonClassName = '',
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Skeleton (Visible until image loads) */}
            {!isLoaded && !error && (
                <div
                    className={`absolute inset-0 bg-gray-700 animate-pulse ${skeletonClassName}`}
                />
            )}

            {/* Actual Image */}
            <img
                src={error ? 'https://placehold.co/600x600/1f2937/d1d5db?text=Image+Not+Found' : src}
                alt={alt}
                className={`w-full h-full transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'
                    } ${imgClassName || 'object-cover'}`}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setError(true);
                    setIsLoaded(true);
                }}
                loading="lazy"
                decoding="async"
                {...props}
            />
        </div>
    );
};

export default OptimizedImage;
