import React from 'react';
import { Link } from 'react-router-dom';
import { Venus, Mars, Watch } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import OptimizedImage from './OptimizedImage';

interface Variant { color: string; images: string[]; }

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  variants?: Variant[];
  imageUrls: string[];
  gender?: 'Male' | 'Female';
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  // --- 3D Hover Logic ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-150, 150], [8, -8]);
  const rotateY = useTransform(x, [-150, 150], [-8, 8]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    x.set(mouseX - width / 2);
    y.set(mouseY - height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // 1. Robust Image Logic
  let coverImage = 'https://placehold.co/300?text=No+Image'; // Fallback
  if (product.variants && product.variants.length > 0 && product.variants[0].images.length > 0) {
    coverImage = product.variants[0].images[0];
  } else if (product.imageUrls && product.imageUrls.length > 0) {
    coverImage = product.imageUrls[0];
  }

  // 2. Second Image for Hover Reveal
  let hoverImage = coverImage;
  if (product.variants && product.variants.length > 0 && product.variants[0].images.length > 1) {
    hoverImage = product.variants[0].images[1];
  } else if (product.imageUrls && product.imageUrls.length > 1) {
    hoverImage = product.imageUrls[1];
  }

  // 3. Gender Icon Logic
  const getGenderIcon = (gender: 'Male' | 'Female' | 'Unisex' | undefined) => {
    switch (gender) {
      case 'Male': return <Mars size={16} className="text-blue-400" />;
      case 'Female': return <Venus size={16} className="text-pink-400" />;
      default: return <Watch size={16} className="text-gray-400" />;
    }
  };

  // 4. Discount Logic
  const originalPrice = product.originalPrice || 0;
  const discount = product.discount || 0;
  const hasDiscount = discount > 0 && originalPrice > product.price;

  return (
    <motion.div 
      className="group relative bg-gray-800 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-700 hover:border-brand-gold/40 flex flex-col h-full z-10"
      style={{ perspective: 1000, rotateX, rotateY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02, zIndex: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >

      {/* === Image Area === */}
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] bg-gray-700 overflow-hidden">
        {/* Primary Image */}
        <OptimizedImage
          className={`w-full h-full transition-opacity duration-300 ease-in-out ${hoverImage !== coverImage ? 'group-hover:opacity-0' : ''}`}
          src={coverImage}
          alt={product.name}
          width="300"
          height="375"
        />

        {/* Secondary Image (Hover Reveal) */}
        {hoverImage !== coverImage && (
          <OptimizedImage
            className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
            src={hoverImage}
            alt={`${product.name} alternate view`}
            width="300"
            height="375"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {hasDiscount && (
            <span className="bg-brand-gold text-brand-darker text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider shadow-sm">
              {Math.round(discount)}% OFF
            </span>
          )}
        </div>

        {/* Gender Icon Overlay */}
        <div className="absolute top-2 right-2 p-1.5 bg-gray-900/60 backdrop-blur-[2px] rounded-full text-white/80 hover:text-white transition-colors z-10">
          {getGenderIcon(product.gender)}
        </div>
      </Link>

      {/* === Content Area === */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-xs sm:text-sm font-medium text-gray-100 group-hover:text-brand-gold transition-colors line-clamp-1 mb-1 font-sans tracking-wide">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-sm sm:text-base font-bold text-brand-gold-light">
            Rs. {product.price.toLocaleString()}
          </span>

          {hasDiscount && (
            <span className="text-[10px] sm:text-xs text-gray-500 line-through decoration-brand-gold/50">
              Rs. {originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default ProductCard;