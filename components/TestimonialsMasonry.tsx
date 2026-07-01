// src/components/TestimonialsMasonry.tsx
import React, { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, limit, query, orderBy } from '../firebase';

interface Review {
    id: string;
    customerName: string;
    role?: string;
    comment: string;
    rating: number;
    images?: string[];
}

const TestimonialsMasonry: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const q = query(
                    collection(db, 'reviews'),
                    orderBy('createdAt', 'desc'),
                    limit(6)
                );
                const querySnapshot = await getDocs(q);
                const fetchedReviews = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Review[];

                setReviews(fetchedReviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) return null; // Or a loading skeleton
    if (reviews.length === 0) return null; // Hide section if no reviews

    return (
        <section className="py-24 bg-brand-darker relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Voices of Trust</h2>
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <div className="flex text-brand-gold">
                            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                        </div>
                        <span className="text-gray-400 font-medium">4.9/5 Average Rating</span>
                    </div>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="break-inside-avoid bg-brand-charcoal border border-white/5 p-6 rounded-2xl hover:border-brand-gold/30 transition-colors duration-300 relative group"
                        >
                            <Quote className="absolute top-4 right-4 text-brand-gold/10 group-hover:text-brand-gold/20 transition-colors" size={40} />

                            <div className="flex items-center gap-4 mb-4">
                                {review.images && review.images.length > 0 ? (
                                    <img
                                        src={review.images[0]}
                                        alt={review.customerName}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-gold/20"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold ring-2 ring-brand-gold/20">
                                        {review.customerName.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-white font-medium">{review.customerName}</h4>
                                    <p className="text-xs text-brand-gold">{review.role || "Verified Buyer"}</p>
                                </div>
                            </div>

                            <div className="flex mb-3 text-brand-gold">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>

                            <p className="text-gray-400 text-sm leading-relaxed">
                                "{review.comment}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsMasonry;
