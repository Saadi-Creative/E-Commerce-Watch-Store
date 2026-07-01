// src/pages/ReviewsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Camera, ShoppingBag, MessageSquare, ArrowLeft } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from '../firebase';

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

const ReviewsPage: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllReviews = async () => {
            try {
                const reviewsRef = collection(db, 'reviews');
                const q = query(
                    reviewsRef,
                    where('isApproved', '==', true),
                    orderBy('createdAt', 'desc')
                );

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

        fetchAllReviews();
    }, []);

    const renderStars = (rating: number) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={16}
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

    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    return (
        <div className="min-h-screen py-8">
            {/* Header */}
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Customer Reviews</h1>
                        {reviews.length > 0 && (
                            <div className="flex items-center gap-3">
                                {renderStars(Math.round(averageRating))}
                                <span className="text-yellow-400 font-bold">{averageRating.toFixed(1)}</span>
                                <span className="text-gray-500">({reviews.length} verified reviews)</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700/50">
                        <Camera size={16} className="text-yellow-500" />
                        <span>All reviews include photos from verified buyers</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="animate-pulse text-gray-400">Loading reviews...</div>
                </div>
            ) : reviews.length === 0 ? (
                // Empty State
                <div className="text-center py-16">
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 max-w-lg mx-auto">
                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageSquare className="text-yellow-500" size={36} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">No Reviews Yet</h2>
                        <p className="text-gray-400 mb-6">
                            Be the first to share your experience! After your order is delivered, you can leave a review with photos.
                        </p>

                        <div className="bg-gray-900/50 rounded-xl p-4 mb-6 text-left">
                            <h3 className="text-yellow-500 font-semibold text-sm mb-3">How to Leave a Review:</h3>
                            <ol className="space-y-2 text-gray-400 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="bg-yellow-500 text-gray-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                    <span>Purchase a product from our store</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="bg-yellow-500 text-gray-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                    <span>Wait for your order to be delivered</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="bg-yellow-500 text-gray-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                    <span>Submit your review with at least 1 photo</span>
                                </li>
                            </ol>
                        </div>

                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                            <ShoppingBag size={18} />
                            Start Shopping
                        </Link>
                    </div>
                </div>
            ) : (
                // Reviews Grid
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 hover:border-yellow-500/20 transition-all"
                        >
                            {/* Header */}
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                    {review.customerName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-white">{review.customerName}</h4>
                                    <div className="flex items-center gap-2">
                                        {renderStars(review.rating)}
                                    </div>
                                    <span className="text-gray-500 text-xs">{formatDate(review.createdAt)}</span>
                                </div>
                            </div>

                            {/* Product */}
                            <Link
                                to={`/product/${review.productId}`}
                                className="text-yellow-500 text-sm font-medium hover:text-yellow-400 transition-colors block mb-3"
                            >
                                🛒 {review.productName}
                            </Link>

                            {/* Comment */}
                            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                {review.comment}
                            </p>

                            {/* Images */}
                            {review.images && review.images.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                    {review.images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`Review ${idx + 1}`}
                                            className="w-20 h-20 rounded-lg object-cover border border-gray-600 flex-shrink-0 hover:border-yellow-500/50 transition-colors cursor-pointer"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewsPage;
