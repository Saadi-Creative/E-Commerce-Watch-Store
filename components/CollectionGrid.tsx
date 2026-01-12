// src/components/CollectionGrid.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';

interface Product {
    id: string;
    name: string;
    imageUrls?: string[];
    category?: string;
}

const CollectionGrid: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch latest 4 products
                const q = query(
                    collection(db, 'products'),
                    orderBy('createdAt', 'desc'),
                    limit(4)
                );
                const querySnapshot = await getDocs(q);
                const fetchedProducts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[];

                setProducts(fetchedProducts);
            } catch (error) {
                console.error("Error fetching collections:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleCardClick = () => {
        navigate('/shop');
    };

    if (loading) {
        return <div className="py-24 bg-brand-dark min-h-[600px] flex items-center justify-center text-gray-500">Loading Collections...</div>;
    }

    // Fallback if no products exist
    if (products.length === 0) return null;

    // Helper to safely get product data at index
    const getProduct = (index: number) => {
        const product = products[index];
        if (!product) return null;

        return {
            name: product.name,
            image: product.imageUrls?.[0] || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=2599&auto=format&fit=crop', // Fallback
            category: product.category || 'Exclusive'
        };
    };

    const p0 = getProduct(0);
    const p1 = getProduct(1);
    const p2 = getProduct(2);
    const p3 = getProduct(3);

    return (
        <section className="py-24 bg-brand-dark px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Curated Collections</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Explore our masterfully crafted timepieces, designed for every occasion.</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[300px]">

                    {/* Main Large Item - Spans 2x2 */}
                    {p0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            onClick={handleCardClick}
                            className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-2xl cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                            <img
                                src={p0.image}
                                alt={p0.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 p-6 z-20 w-full bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-3xl font-serif text-white mb-2">{p0.name}</h3>
                                <span className="inline-flex items-center text-brand-gold text-sm font-medium tracking-wider uppercase">
                                    Shop Now <ArrowUpRight size={16} className="ml-1" />
                                </span>
                            </div>
                        </motion.div>
                    )}

                    {/* Tall Item - Spans 1x2 */}
                    {p1 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            onClick={handleCardClick}
                            className="md:col-span-1 md:row-span-2 group relative overflow-hidden rounded-2xl cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                            <img
                                src={p1.image}
                                alt={p1.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 p-6 z-20 w-full bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-2xl font-serif text-white mb-2">{p1.name}</h3>
                                <span className="inline-flex items-center text-brand-gold text-sm font-medium tracking-wider uppercase">
                                    Shop Now <ArrowUpRight size={16} className="ml-1" />
                                </span>
                            </div>
                        </motion.div>
                    )}

                    {/* Medium Item 1 - Spans 1x1 */}
                    {p2 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            onClick={handleCardClick}
                            className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-2xl cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                            <img
                                src={p2.image}
                                alt={p2.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 p-6 z-20 w-full bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-xl font-serif text-white mb-1">{p2.name}</h3>
                            </div>
                        </motion.div>
                    )}

                    {/* Medium Item 2 - Spans 1x1 */}
                    {p3 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            onClick={handleCardClick}
                            className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-2xl cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                            <img
                                src={p3.image}
                                alt={p3.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 p-6 z-20 w-full bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-xl font-serif text-white mb-1">{p3.name}</h3>
                            </div>
                        </motion.div>
                    )}

                </div>
            </div>
        </section>
    );
};

export default CollectionGrid;
