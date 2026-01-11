import { Link } from 'react-router-dom';
import { Venus, Mars, Watch } from 'lucide-react';

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

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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
    <div className="group relative bg-gray-800 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-700 hover:border-brand-gold/20 flex flex-col h-full">

      {/* === Image Area === */}
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] bg-gray-700 overflow-hidden">
        {/* Primary Image */}
        <img
          className={`w-full h-full object-cover object-center transition-opacity duration-300 ease-in-out ${hoverImage !== coverImage ? 'group-hover:opacity-0' : ''}`}
          src={coverImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          width="300"
          height="375"
        />

        {/* Secondary Image (Hover Reveal) */}
        {hoverImage !== coverImage && (
          <img
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
            src={hoverImage}
            alt={`${product.name} alternate view`}
            loading="lazy"
            decoding="async"
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
    </div>
  );
};

export default ProductCard;