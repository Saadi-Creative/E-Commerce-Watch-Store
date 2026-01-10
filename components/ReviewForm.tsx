// src/components/ReviewForm.tsx
import React, { useState } from 'react';
import { Star, X, Camera, Send, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from './Toast';
import { compressImage } from '../services/imageOptimizer';
import { sanitizeMultiline, validateImageFile } from '../utils/security';
import { uploadImageSecure } from '../services/api'; // NEW: Secure API

interface ReviewFormProps {
    orderId: string;
    productId: string;
    productName: string;
    customerName: string;
    customerPhone: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
    orderId,
    productId,
    productName,
    customerName,
    customerPhone,
    onSuccess,
    onCancel,
}) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { showToast } = useToast();

    // REMOVED: Direct ImgBB upload logic from here
    // Replaced with uploadImageSecure inside handleFileChange

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploading(true);
            const files = Array.from(e.target.files);

            for (const file of files) {
                if (images.length >= 5) {
                    showToast('Maximum 5 images allowed', 'error');
                    break;
                }

                // Validate file before processing
                const validation = validateImageFile(file);
                if (!validation.valid) {
                    showToast(validation.error || 'Invalid file', 'error');
                    continue;
                }

                try {
                    // Compress image before upload
                    const compressedFile = await compressImage(file);
                    // Use Secure Backend Upload
                    const url = await uploadImageSecure(compressedFile);
                    if (url) {
                        setImages(prev => [...prev, url]);
                    } else {
                        showToast('Failed to upload image via secure server', 'error');
                    }
                } catch (error) {
                    console.error("Upload failed", error);
                    showToast('Failed to process image', 'error');
                }
            }

            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            showToast('Please select a rating', 'error');
            return;
        }

        if (comment.trim().length < 10) {
            showToast('Please write at least 10 characters', 'error');
            return;
        }

        if (images.length === 0) {
            showToast('Please upload at least 1 image', 'error');
            return;
        }

        setSubmitting(true);

        try {
            // Sanitize comment before submitting
            const sanitizedComment = sanitizeMultiline(comment, 1000);

            await addDoc(collection(db, 'reviews'), {
                orderId,
                productId,
                productName,
                customerName,
                customerPhone,
                rating,
                comment: sanitizedComment,
                images,
                isApproved: true, // Auto-approve for now (can add admin moderation later)
                createdAt: serverTimestamp(),
            });

            showToast('Thank you for your review!', 'success');
            onSuccess?.();
        } catch (error) {
            showToast('Failed to submit review', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-1">Leave a Review</h3>
            <p className="text-gray-400 text-sm mb-6">Share your experience with {productName}</p>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Rating */}
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Your Rating *</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-1 transition-transform hover:scale-110"
                            >
                                <Star
                                    size={28}
                                    className={
                                        star <= (hoverRating || rating)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-600'
                                    }
                                />
                            </button>
                        ))}
                        <span className="ml-2 text-gray-400 text-sm self-center">
                            {rating > 0 && ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1]}
                        </span>
                    </div>
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Your Review *</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all resize-none"
                        placeholder="Tell us about your experience with this product..."
                    />
                    <p className="text-gray-500 text-xs mt-1">{comment.length} / 500 characters</p>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Upload Photos * <span className="text-gray-500 font-normal">(min 1, max 5)</span>
                    </label>

                    <div className="flex flex-wrap gap-3">
                        {/* Uploaded Images */}
                        {images.map((img, idx) => (
                            <div key={idx} className="relative w-20 h-20 group">
                                <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover rounded-lg border border-gray-600" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}

                        {/* Upload Button */}
                        {images.length < 5 && (
                            <label className="w-20 h-20 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 transition-colors">
                                {uploading ? (
                                    <Loader2 className="text-yellow-500 animate-spin" size={20} />
                                ) : (
                                    <>
                                        <Camera className="text-gray-500 mb-1" size={20} />
                                        <span className="text-gray-500 text-xs">Add</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    id="review-image"
                                    name="review-image"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden" // Kept hidden as per original functionality, but added id/name
                                    disabled={uploading}
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={submitting || uploading}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Send size={18} />
                        )}
                        Submit Review
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
