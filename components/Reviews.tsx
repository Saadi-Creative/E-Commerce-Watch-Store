// src/components/Reviews.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, MessageSquare, Camera, ArrowRight } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy, limit } from '../firebase';

interface Review {
    id: string;
    productId: string;
    productName: string;
    customerName: string;
    rating: number;
    comment: string;
    images: string[];
    createdAt: any;
}

interface ReviewsProps {
    productId?: string; // Filter by specific product
    maxItems?: number;  // Limit number of reviews shown
    showEmpty?: boolean; // Show empty state
}

const Reviews: React.FC<ReviewsProps> = ({ productId, maxItems = 6, showEmpty = true }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewsRef = collection(db, 'reviews');
                let q;

                if (productId) {
                    q = query(
                        reviewsRef,
                        where('productId', '==', productId),
                        where('isApproved', '==', true),
                        orderBy('createdAt', 'desc'),
                        limit(maxItems)
                    );
                } else {
                    q = query(
                        reviewsRef,
                        where('isApproved', '==', true),
                        orderBy('createdAt', 'desc'),
                        limit(maxItems)
                    );
                }

                const snapshot = await getDocs(q);
                const reviewsData: Review[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Review));

                setReviews(reviewsData);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId, maxItems]);

    const renderStars = (rating: number) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={14}
                    className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                />
            ))}
        </div>
    );

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Loading state
    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-pulse text-gray-400">Loading reviews...</div>
            </div>
        );
    }

    // Empty state - No reviews yet
    if (reviews.length === 0 && showEmpty) {
        return (
            <div className="text-center py-12 px-4">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="text-yellow-500" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Reviews Yet</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Be the first to share your experience! Purchase a product and leave a review after delivery.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                        <Camera size={14} />
                        <span>Reviews include photos from verified buyers</span>
                    </div>
                </div>
            </div>
        );
    }

    // No reviews, don't show empty state
    if (reviews.length === 0) {
        return null;
    }

    // Reviews Grid
    return (
        <div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-yellow-500/20 transition-colors"
                    >
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {review.customerName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-white text-sm truncate">{review.customerName}</h4>
                                <div className="flex items-center gap-2">
                                    {renderStars(review.rating)}
                                    <span className="text-gray-500 text-xs">{formatDate(review.createdAt)}</span>
                                </div>
                            </div>
                            <Quote size={16} className="text-yellow-500/30 flex-shrink-0" />
                        </div>

                        {/* Product Name */}
                        <p className="text-yellow-500/80 text-xs font-medium mb-2 truncate">
                            Purchased: {review.productName}
                        </p>

                        {/* Comment */}
                        <p className="text-gray-400 text-sm leading-relaxed mb-3 line-clamp-3">
                            {review.comment}
                        </p>

                        {/* Images */}
                        {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                {review.images.slice(0, 3).map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Review ${idx + 1}`}
                                        className="w-16 h-16 rounded-lg object-cover border border-gray-600 flex-shrink-0"
                                    />
                                ))}
                                {review.images.length > 3 && (
                                    <div className="w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                                        +{review.images.length - 3}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* View All Link */}
            <div className="text-center mt-6">
                <Link
                    to="/reviews"
                    className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors text-sm font-medium"
                >
                    View All Reviews <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export default Reviews;
