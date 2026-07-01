// src/pages/MyOrders.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Search, Package, Clock, CheckCircle, Truck, XCircle, Star, ArrowLeft } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from '../firebase';
import ReviewForm from '../components/ReviewForm';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface Order {
    id: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: any;
    customerName: string;
    phone: string;
    address: string;
    paymentMethod: string;
}

const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Pending' },
    processing: { icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Processing' },
    shipped: { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'Shipped' },
    delivered: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Delivered' },
    cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Cancelled' },
};

const MyOrders: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [reviewingOrder, setReviewingOrder] = useState<{ orderId: string; item: OrderItem } | null>(null);
    const [reviewedItems, setReviewedItems] = useState<Set<string>>(new Set());

    const formatPhone = (input: string) => {
        // Remove all non-digits
        const digits = input.replace(/\D/g, '');
        // Limit to 11 digits (Pakistani format)
        return digits.slice(0, 11);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(formatPhone(e.target.value));
    };

    const searchOrders = async (e: React.FormEvent) => {
        e.preventDefault();

        if (phone.length < 10) {
            return;
        }

        setLoading(true);
        setSearched(true);

        try {
            const ordersRef = collection(db, 'orders');
            const q = query(
                ordersRef,
                where('phone', '==', phone),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            const ordersData: Order[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Order));

            setOrders(ordersData);

            // Check which items have been reviewed
            const reviewsRef = collection(db, 'reviews');
            const reviewsQuery = query(reviewsRef, where('customerPhone', '==', phone));
            const reviewsSnapshot = await getDocs(reviewsQuery);
            const reviewed = new Set(reviewsSnapshot.docs.map(doc => doc.data().productId));
            setReviewedItems(reviewed);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-PK', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleReviewSuccess = (productId: string) => {
        setReviewedItems(prev => new Set([...prev, productId]));
        setReviewingOrder(null);
    };

    return (
        <div className="min-h-screen py-8">
            {/* Header */}
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>

                <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
                <p className="text-gray-400">Enter your phone number to view your orders and leave reviews</p>
            </div>

            {/* Phone Search */}
            <form onSubmit={searchOrders} className="mb-8">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 max-w-md">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Phone Number
                    </label>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="tel"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="03XXXXXXXXX"
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={phone.length < 10 || loading}
                            className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 text-gray-900 font-bold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Search size={18} />
                            {loading ? 'Searching...' : 'Find'}
                        </button>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">Enter the phone number you used during checkout</p>
                </div>
            </form>

            {/* Review Modal */}
            {reviewingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setReviewingOrder(null)} />
                    <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <ReviewForm
                            orderId={reviewingOrder.orderId}
                            productId={reviewingOrder.item.id}
                            productName={reviewingOrder.item.name}
                            customerName={orders.find(o => o.id === reviewingOrder.orderId)?.customerName || ''}
                            customerPhone={phone}
                            onSuccess={() => handleReviewSuccess(reviewingOrder.item.id)}
                            onCancel={() => setReviewingOrder(null)}
                        />
                    </div>
                </div>
            )}

            {/* Results */}
            {searched && (
                <div>
                    {orders.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 max-w-md mx-auto">
                                <Package className="text-gray-600 mx-auto mb-4" size={48} />
                                <h3 className="text-xl font-bold text-white mb-2">No Orders Found</h3>
                                <p className="text-gray-400 mb-4">
                                    We couldn't find any orders with this phone number.
                                </p>
                                <Link
                                    to="/shop"
                                    className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400"
                                >
                                    Start Shopping →
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <p className="text-gray-400">Found {orders.length} order(s)</p>

                            {orders.map((order) => {
                                const StatusIcon = statusConfig[order.status]?.icon || Clock;
                                const statusColor = statusConfig[order.status]?.color || 'text-gray-500';
                                const statusBg = statusConfig[order.status]?.bg || 'bg-gray-500/10';
                                const statusLabel = statusConfig[order.status]?.label || order.status;

                                return (
                                    <div key={order.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
                                        {/* Order Header */}
                                        <div className="p-4 border-b border-gray-700/50 flex flex-wrap items-center justify-between gap-4">
                                            <div>
                                                <p className="text-gray-500 text-xs">Order ID</p>
                                                <p className="text-white font-mono text-sm">{order.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Date</p>
                                                <p className="text-white text-sm">{formatDate(order.createdAt)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Total</p>
                                                <p className="text-yellow-500 font-bold">Rs. {order.total?.toLocaleString()}</p>
                                            </div>
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusBg}`}>
                                                <StatusIcon size={16} className={statusColor} />
                                                <span className={`text-sm font-medium ${statusColor}`}>{statusLabel}</span>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="p-4 space-y-4">
                                            {order.items?.map((item, idx) => {
                                                const hasReviewed = reviewedItems.has(item.id);

                                                return (
                                                    <div key={idx} className="flex items-center gap-4">
                                                        {/* Product Image */}
                                                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                                            {item.image ? (
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                                                    <Package className="text-gray-500" size={24} />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-white font-medium truncate">{item.name}</h4>
                                                            <p className="text-gray-400 text-sm">
                                                                Rs. {item.price?.toLocaleString()} × {item.quantity}
                                                            </p>
                                                        </div>

                                                        {/* Review Button */}
                                                        {order.status === 'delivered' && (
                                                            <div>
                                                                {hasReviewed ? (
                                                                    <span className="flex items-center gap-1 text-green-500 text-sm">
                                                                        <CheckCircle size={16} />
                                                                        Reviewed
                                                                    </span>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => setReviewingOrder({ orderId: order.id, item })}
                                                                        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                                                                    >
                                                                        <Star size={16} />
                                                                        Review
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Delivery Info */}
                                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                            <div className="px-4 pb-4">
                                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-start gap-3">
                                                    <Truck className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                                                    <div className="text-sm">
                                                        <p className="text-yellow-500 font-medium">Order in progress</p>
                                                        <p className="text-gray-400">You can leave a review once your order is delivered.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Initial State */}
            {!searched && (
                <div className="text-center py-12">
                    <div className="bg-gray-800/30 border border-dashed border-gray-700 rounded-xl p-8 max-w-md mx-auto">
                        <Search className="text-gray-600 mx-auto mb-4" size={48} />
                        <h3 className="text-xl font-bold text-white mb-2">Track Your Orders</h3>
                        <p className="text-gray-400 text-sm">
                            Enter your phone number above to view your order history, track deliveries, and leave reviews for delivered products.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
