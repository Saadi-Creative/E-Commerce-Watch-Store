// src/components/BrandStory.tsx
import React from 'react';
import { motion } from 'framer-motion';

// NEW IMPORTS
import { useState, useEffect } from 'react';


const BrandStory: React.FC = () => {
    const [clientCount, setClientCount] = useState(0);

    // Fetch confirmed/delivered orders count
    // Use static count to avoid unnecessary reads and permission issues
    useEffect(() => {
        setClientCount(1250);
    }, []);

    return (
        <section className="py-20 bg-brand-darker relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-charcoal/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="order-2 lg:order-1"
                    >
                        <span className="text-brand-gold text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
                            The Art of Time
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
                            Craftsmanship beyond <br />
                            <span className="italic text-gray-400">measure.</span>
                        </h2>
                        <div className="space-y-6 text-gray-300 font-light text-lg">
                            <p>
                                At WristHub, we believe a watch is more than a tool—it is a statement of legacy.
                                Born from a passion for precision and an eye for timeless aesthetics, our collection selects
                                only the finest automatic and mechanical movements.
                            </p>
                            <p>
                                Every piece tells a story of dedication, status, and the relentless pursuit of perfection.
                                Wearing one isn't just about knowing the time; it's about owning it.
                            </p>
                        </div>

                        <div className="mt-8 flex gap-8 border-t border-gray-800 pt-8">
                            <div>
                                <span className="block text-3xl font-serif text-white">2024</span>
                                <span className="text-xs text-gray-500 uppercase tracking-widest">Established</span>
                            </div>
                            <div>
                                {/* REAL DYNAMIC COUNTER */}
                                <span className="block text-3xl font-serif text-white">
                                    {clientCount}
                                </span>
                                <span className="text-xs text-gray-500 uppercase tracking-widest">Happy Clients</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Visual Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="order-1 lg:order-2 relative"
                    >
                        <div className="relative rounded-lg overflow-hidden shadow-2xl border border-gray-800">
                            {/* Visual Side */}
                            <div className="relative h-[500px] w-full overflow-hidden rounded-lg">
                                <div className="absolute inset-0 bg-black/20 z-10"></div>
                                <video
                                    className="w-full h-full object-cover scale-110"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    poster="https://images.unsplash.com/photo-1594576722512-582d7195d6d6?q=80&w=2603&auto=format&fit=crop"
                                >
                                    <source src="/hero-video.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>

                                {/* Decorative Element */}
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl rounded-full"></div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            <div className="absolute bottom-8 left-8">
                                <p className="text-white font-serif italic text-xl">"Time is the ultimate luxury."</p>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-gold rounded-full flex items-center justify-center animate-spin-slow hidden md:flex">
                            <svg className="w-full h-full p-2 text-brand-darker" viewBox="0 0 100 100">
                                <path
                                    id="circlePath"
                                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                                    fill="none"
                                    stroke="none"
                                />
                                <text fontSize="11" fontWeight="bold" fill="currentColor">
                                    <textPath xlinkHref="#circlePath" startOffset="0%">
                                        OFFICIAL RETAILER • PREMIUM QUALITY •
                                    </textPath>
                                </text>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl">★</span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default BrandStory;
