// src/components/HeroSection.tsx
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HeroSection: React.FC = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

    const slogan = "Own Your Time";

    // Text Animation Variants (Wave/Jumble effect)
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.3 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            rotateX: -90,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <div ref={targetRef} className="relative h-screen w-full overflow-hidden bg-brand-darker">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                {/* Static Background Image */}
                <img
                    src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=2600&auto=format&fit=crop"
                    alt="Luxury Watch Background"
                    className="h-full w-full object-cover opacity-40 scale-105"
                    loading="eager"
                />
                {/* Refined Gradient Overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-brand-darker/60 via-brand-darker/20 to-brand-darker/90" />
            </div>

            {/* Content */}
            <motion.div
                style={{ opacity, scale, y }}
                className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4 md:px-6"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="backdrop-blur-md bg-white/5 border border-white/10 p-10 md:p-16 rounded-3xl shadow-glass max-w-5xl w-full mx-auto"
                >
                    <motion.h2
                        initial={{ opacity: 0, letterSpacing: "0.2em" }}
                        animate={{ opacity: 1, letterSpacing: "0.5em" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="mb-6 text-sm md:text-lg font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] text-brand-gold-light"
                    >
                        WristHub Premium
                    </motion.h2>


                    <motion.div
                        style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", justifyContent: "center" }}
                        variants={container}
                        initial="hidden"
                        animate="visible"
                        className="text-4xl md:text-7xl lg:text-8xl font-serif font-medium text-white leading-tight mb-8 drop-shadow-lg"
                    >
                        {slogan.split(" ").map((word, wordIndex) => (
                            <span key={wordIndex} className="inline-block whitespace-nowrap mr-2 sm:mr-4">
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span variants={child} key={letterIndex} className="inline-block relative">
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="mx-auto mt-4 max-w-2xl"
                    >
                        <p className="text-lg md:text-2xl text-gray-200 font-light leading-relaxed">
                            Experience luxury that transcends generations.
                        </p>
                        <p className="mt-3 text-brand-gold text-base md:text-xl italic font-serif">
                            Precision. Elegance. Legacy.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8, duration: 0.8, type: "spring" }}
                        className="mt-12"
                    >
                        <a
                            href="#collections"
                            className="group relative inline-flex items-center justify-center px-10 py-4 text-sm md:text-base font-bold tracking-widest text-brand-dark uppercase transition-all duration-300 bg-brand-gold hover:bg-white hover:text-brand-darker hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] rounded-sm overflow-hidden"
                        >
                            <span className="relative z-10 transition-colors duration-300">Explore Collection</span>
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-white" />
                        </a>
                    </motion.div>

                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/50 cursor-pointer hover:text-brand-gold transition-colors"
                onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                    <ChevronDown size={28} />
                </div>
            </motion.div>
        </div>
    );
};

export default HeroSection;
