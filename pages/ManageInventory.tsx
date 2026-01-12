// src/pages/ManageInventory.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Trash2, RefreshCw, Edit, XCircle, CheckCircle, MessageCircle, Search, PackageCheck } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    imageUrls?: string[];
    createdAt?: any;
}

interface Order {
    id: string;
    totalAmount: number;
    paymentMethod: string;
    status: string;
    customer: { fullName: string; phoneNumber: string; };
    placedAt: any;
}

const ManageInventory: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);

    // --- SEARCH & TAB STATES ---
    const [inventorySearch, setInventorySearch] = useState('');
    const [orderSearch, setOrderSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'Active' | 'Delivered' | 'Cancelled'>('Active');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const productSnapshot = await getDocs(collection(db, 'products'));
            const list = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
            setProducts(list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const fetchOrders = async () => {
        try {
            const orderSnapshot = await getDocs(collection(db, 'orders'));
            const list = orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
            setOrders(list.sort((a, b) => (b.placedAt?.seconds || 0) - (a.placedAt?.seconds || 0)));
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchProducts(); fetchOrders(); }, []);

    // --- FILTER LOGIC ---
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(inventorySearch.toLowerCase())
    );

    // 1. Search Filter
    const searchFilteredOrders = orders.filter(o =>
        o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.id.toLowerCase().includes(orderSearch.toLowerCase())
    );

    // 2. Tab Filter
    const finalOrders = searchFilteredOrders.filter(o => {
        if (activeTab === 'Active') return ['Pending Payment', 'Pending Confirmation', 'Processing'].includes(o.status);
        if (activeTab === 'Delivered') return o.status === 'Delivered';
        if (activeTab === 'Cancelled') return o.status === 'Cancelled';
        return true;
    });

    const getStockStatus = (stock: number) => {
        if (stock === 0) return <span className="text-red-400 font-bold text-xs">Out of Stock</span>;
        if (stock < 5) return <span className="text-yellow-500 font-bold text-xs">Low ({stock})</span>;
        return <span className="text-green-400 font-bold text-xs">{stock} in stock</span>;
    };

    const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || 'wh-secret-panel';

    const handleEditClick = (id: string) => {
        navigate(`/${ADMIN_PATH}/edit/${id}`);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this product?")) {
            await deleteDoc(doc(db, "products", id));
            setMessage("Product deleted.");
            fetchProducts();
        }
    };

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        const confirmMsg = newStatus === 'Delivered'
            ? "Mark this order as completed/delivered?"
            : `Mark order as ${newStatus}?`;

        if (window.confirm(confirmMsg)) {
            await updateDoc(doc(db, "orders", orderId), { status: newStatus });
            setMessage(`Order moved to ${newStatus}.`);
            fetchOrders();
        }
    };

    const openWhatsAppNotify = (order: Order) => {
        let msg = `Assalam-o-Alaikum ${order.customer.fullName}! `;
        if (order.status === 'Processing') {
            msg += `Your WristHub Order #${order.id.substring(0, 5)} has been confirmed and is being processed.`;
        } else if (order.status === 'Delivered') {
            msg += `Your WristHub Order #${order.id.substring(0, 5)} has been delivered. We hope you love your new timepiece!`;
        } else {
            msg += `Regarding your WristHub Order #${order.id.substring(0, 5)}...`;
        }
        window.open(`https://wa.me/${order.customer.phoneNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    if (loading) return <div className="p-10 text-center text-white">Loading Dashboard...</div>;

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Inventory & Order Management</h1>
            {message && <div className="p-3 mb-4 rounded text-center bg-blue-900/50 text-blue-200">{message}</div>}

            <div className="grid lg:grid-cols-2 gap-8">

                {/* --- INVENTORY COLUMN --- */}
                <div className="bg-gray-900 rounded-lg border border-gray-700 flex flex-col max-h-[85vh]">
                    <div className="p-4 border-b border-gray-700 space-y-3">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Inventory</h2>
                            <button onClick={fetchProducts}><RefreshCw size={20} className="text-gray-400 hover:text-white" /></button>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={inventorySearch}
                                onChange={(e) => setInventorySearch(e.target.value)}
                                className="w-full bg-gray-800 text-white text-sm rounded-lg pl-9 pr-4 py-2 border border-gray-600 focus:border-yellow-500 focus:outline-none"
                            />
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div className="overflow-y-auto p-2 flex-grow custom-scrollbar">
                        {filteredProducts.map((prod) => (
                            <div key={prod.id} className="mb-3 bg-gray-800 p-3 rounded-lg border border-gray-700 flex items-center justify-between hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <img src={prod.imageUrls?.[0] || '/placeholder.png'} alt="" className="w-12 h-12 rounded object-contain bg-white border border-gray-600" />
                                    <div className="min-w-0">
                                        <h3 className="text-white font-bold text-sm truncate w-32 sm:w-48">{prod.name}</h3>
                                        <p className="text-yellow-500 text-xs">Rs. {prod.price.toLocaleString()}</p>
                                        {getStockStatus(prod.stock)}
                                    </div>
                                </div>
                                <div className="flex space-x-2 flex-shrink-0">
                                    <button onClick={() => handleEditClick(prod.id)} className="p-2 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600 hover:text-white transition-colors"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(prod.id)} className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600 hover:text-white transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- ORDERS COLUMN (WITH TABS) --- */}
                <div className="bg-gray-900 rounded-lg border border-gray-700 flex flex-col max-h-[85vh]">
                    <div className="p-4 border-b border-gray-700 space-y-3">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Orders</h2>
                            <button onClick={fetchOrders}><RefreshCw size={20} className="text-gray-400 hover:text-white" /></button>
                        </div>

                        {/* TABS */}
                        <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
                            {['Active', 'Delivered', 'Cancelled'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`flex-1 py-1 text-xs font-bold rounded-md transition-colors ${activeTab === tab
                                        ? 'bg-yellow-500 text-gray-900'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Orders..."
                                value={orderSearch}
                                onChange={(e) => setOrderSearch(e.target.value)}
                                className="w-full bg-gray-800 text-white text-sm rounded-lg pl-9 pr-4 py-2 border border-gray-600 focus:border-yellow-500 focus:outline-none"
                            />
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div className="overflow-y-auto p-2 flex-grow custom-scrollbar">
                        {finalOrders.map((order) => (
                            <div key={order.id} className="p-4 mb-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-yellow-500 font-bold">#{order.id.substring(0, 6)}</span>
                                    <span className={`px-2 rounded text-xs font-bold ${order.status === 'Cancelled' ? 'bg-red-900 text-red-200' :
                                        order.status === 'Delivered' ? 'bg-green-900 text-green-200' :
                                            order.status === 'Processing' ? 'bg-blue-900 text-blue-200' :
                                                'bg-gray-700 text-gray-300'
                                        }`}>{order.status}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-white font-semibold">{order.customer?.fullName}</p>
                                        <p className="text-gray-400 text-xs">{order.customer?.phoneNumber}</p>
                                        <p className="text-gray-500 text-[10px] uppercase mt-1">{order.paymentMethod}</p>
                                    </div>
                                    <p className="text-white font-bold text-right">Rs. {order.totalAmount.toLocaleString()}</p>
                                </div>

                                {/* ADMIN ACTIONS */}
                                <div className="mt-4 pt-3 border-t border-gray-700 flex flex-wrap justify-between items-center gap-2">

                                    {/* 1. Notify User */}
                                    <button onClick={() => openWhatsAppNotify(order)} className="bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 p-2 rounded text-xs font-bold transition" title="WhatsApp Notify">
                                        <MessageCircle size={16} />
                                    </button>

                                    {/* 2. Verify (If Active & Pending) */}
                                    {activeTab === 'Active' && order.status !== 'Processing' && (
                                        <button onClick={() => handleUpdateStatus(order.id, 'Processing')} className="flex-grow bg-yellow-600/20 text-yellow-500 hover:bg-yellow-600/40 py-1.5 rounded text-xs font-bold flex justify-center items-center transition">
                                            <CheckCircle size={14} className="mr-1" /> Verify
                                        </button>
                                    )}

                                    {/* 3. Mark Delivered (If Active & Processing) */}
                                    {activeTab === 'Active' && order.status === 'Processing' && (
                                        <button onClick={() => handleUpdateStatus(order.id, 'Delivered')} className="flex-grow bg-green-600/20 text-green-400 hover:bg-green-600/40 py-1.5 rounded text-xs font-bold flex justify-center items-center transition">
                                            <PackageCheck size={14} className="mr-1" /> Mark Delivered
                                        </button>
                                    )}

                                    {/* 4. Cancel (If Active) */}
                                    {activeTab === 'Active' && (
                                        <button onClick={() => handleUpdateStatus(order.id, 'Cancelled')} className="bg-red-900/30 text-red-400 hover:bg-red-900/50 p-2 rounded text-xs font-bold transition" title="Cancel Order">
                                            <XCircle size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {finalOrders.length === 0 && <p className="text-gray-500 text-center p-4 text-sm">No orders in this tab.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageInventory;