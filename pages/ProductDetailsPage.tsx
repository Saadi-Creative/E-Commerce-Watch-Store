// src/pages/ProductDetailsPage.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { ShoppingCart, CheckCircle, ChevronLeft, ChevronRight, Package, ShieldAlert } from 'lucide-react';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';

interface Variant { color: string; images: string[]; }
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock?: number;
  variants?: Variant[];
  imageUrls: string[];
}

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  // --- FETCH ---
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const prod = { id: docSnap.id, ...data } as Product;

          if (!prod.variants && prod.imageUrls) {
            prod.variants = [{ color: 'Standard', images: prod.imageUrls }];
          }
          setProduct(prod);

          // 🚀 PRELOAD IMAGES for instant color switching
          if (prod.variants) {
            prod.variants.forEach(variant => {
              variant.images.forEach(url => {
                const img = new Image();
                img.src = url;
              });
            });
          }

        } else {
          setError('Product not found.');
        }
      } catch (err: any) {
        setError(`Failed to fetch: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const currentImages = product?.variants?.[activeVariantIndex]?.images || [];

  const nextImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1));
  }, [currentImages]);

  const prevImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));
  }, [currentImages]);

  // --- ✨ ANIMATION LOGIC ---
  const triggerFlingAnimation = () => {
    // 1. Find the image
    const imgElement = document.getElementById('main-product-image') as HTMLImageElement;
    if (!imgElement) return;

    // 2. Clone it
    const ghost = imgElement.cloneNode(true) as HTMLImageElement;
    const rect = imgElement.getBoundingClientRect();

    // 3. Position it exactly over the original
    ghost.style.position = 'fixed';
    ghost.style.left = `${rect.left}px`;
    ghost.style.top = `${rect.top}px`;
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.zIndex = '9999'; // Top layer
    ghost.style.pointerEvents = 'none';
    ghost.style.objectFit = 'contain';
    ghost.style.transition = 'all 0.8s cubic-bezier(0.2, 1, 0.3, 1)'; // Smooth fling curve
    ghost.style.borderRadius = '12px';
    ghost.style.opacity = '0.9';

    document.body.appendChild(ghost);

    // 4. Move to Cart (Top Right)
    requestAnimationFrame(() => {
      // Target: Top right corner (responsive calculation)
      const targetX = window.innerWidth - 60;
      const targetY = 25; // Top header area

      ghost.style.left = `${targetX}px`;
      ghost.style.top = `${targetY}px`;
      ghost.style.width = '30px'; // Shrink size
      ghost.style.height = '30px';
      ghost.style.opacity = '0';
      ghost.style.transform = 'rotate(360deg) scale(0.5)'; // Spin and shrink
    });

    // 5. Cleanup
    setTimeout(() => {
      if (document.body.contains(ghost)) {
        document.body.removeChild(ghost);
      }
    }, 800);
  };

  const handleAddToCart = () => {
    if (!product || isAdmin) return;

    // 1. Trigger Animation
    triggerFlingAnimation();

    // 2. Logic
    const selectedColor = product.variants?.[activeVariantIndex]?.color || 'Standard';
    const cartItemName = selectedColor !== 'Standard' ? `${product.name} (${selectedColor})` : product.name;

    addToCart({
      id: product.id,
      name: cartItemName,
      price: product.price,
      imageUrl: currentImages[0] || 'https://via.placeholder.com/300',
      quantity: 1
    });

    // 3. Button Feedback
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const renderDescription = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return (
      <div className="text-gray-300 text-base leading-relaxed space-y-2 my-6 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
        {lines.map((line, index) => {
          if (line.trim().startsWith('-')) {
            return <div key={index} className="flex items-start"><span className="text-yellow-500 mr-2 mt-1.5 text-xs">●</span><span>{line.replace('-', '').trim()}</span></div>;
          }
          if (line.trim().length === 0) return <br key={index} />;
          return <p key={index}>{line}</p>;
        })}
      </div>
    );
  };

  // SEO & Schema Logic
  const productSchema = useMemo(() => {
    if (!product) return undefined;
    return {
      "@context": "https://schema.org/",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://wristhub.pk/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Shop",
              "item": "https://wristhub.pk/shop"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": product.name,
              "item": window.location.href
            }
          ]
        },
        {
          "@type": "Product",
          "name": product.name,
          "image": product.imageUrls,
          "description": product.description,
          "sku": product.id,
          "brand": {
            "@type": "Brand",
            "name": "WristHub"
          },
          "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "PKR",
            "price": product.price,
            "availability": (product.stock && product.stock > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition"
          }
        }
      ]
    };
  }, [product]);

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-20">{error}</div>;
  if (!product) return null;

  return (
    <div className="bg-gray-900 min-h-screen py-8 px-4">
      {product && (
        <SEO
          title={product.name}
          description={`Buy ${product.name} in Pakistan. Price: Rs. ${product.price.toLocaleString()}. ${product.description.substring(0, 100)}...`}
          image={currentImages[0]}
          type="product"
          schema={productSchema}
        />
      )}
      <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto bg-gray-800 p-6 md:p-10 rounded-2xl shadow-2xl border border-gray-700">

        {/* GALLERY SECTION */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden flex items-center justify-center border border-gray-600 shadow-inner group">

            {/* 🖼️ ID ADDED HERE FOR ANIMATION */}
            <OptimizedImage
              src={currentImages[selectedImageIndex] || ''}
              alt="Product"
              className="w-full h-full"
              imgClassName="object-contain p-6 transition-transform duration-500 hover:scale-110"
              id="main-product-image"
            />

            {currentImages.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/80 text-white p-3 rounded-full hover:bg-yellow-500 hover:text-black transition-all opacity-0 group-hover:opacity-100"><ChevronLeft size={24} /></button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/80 text-white p-3 rounded-full hover:bg-yellow-500 hover:text-black transition-all opacity-0 group-hover:opacity-100"><ChevronRight size={24} /></button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {currentImages.length > 1 && (
            <div className="flex space-x-3 mt-6 overflow-x-auto pb-2 scrollbar-hide justify-center">
              {currentImages.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden p-1 border-2 transition-all ${selectedImageIndex === index ? 'border-yellow-500 scale-105' : 'border-gray-600 hover:border-gray-400 opacity-70 hover:opacity-100'}`}
                >
                  <OptimizedImage src={url} alt="thumb" className="w-full h-full" imgClassName="object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS SECTION */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="mb-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">{product.name}</h1>

            {/* Stock Badge */}
            {product.stock && product.stock > 0 ? (
              <span className="inline-flex items-center bg-green-900/50 text-green-300 text-xs font-bold px-3 py-1 rounded-full border border-green-700 uppercase tracking-wider">
                <Package size={14} className="mr-1" /> In Stock ({product.stock})
              </span>
            ) : (
              <span className="inline-flex items-center bg-red-900/50 text-red-300 text-xs font-bold px-3 py-1 rounded-full border border-red-700 uppercase tracking-wider">
                Out of Stock
              </span>
            )}
          </div>

          <div className="text-5xl font-bold text-yellow-400 mb-8 tracking-tight">
            Rs. {product.price.toLocaleString()}
          </div>

          {/* --- COLOR SELECTOR --- */}
          {product.variants && product.variants.length > 1 && (
            <div className="mb-8 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Select Variation: <span className="text-white ml-1">{product.variants[activeVariantIndex].color}</span></h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setActiveVariantIndex(idx); setSelectedImageIndex(0); }}
                    className={`px-5 py-2 rounded-md border-2 transition-all text-sm font-bold ${activeVariantIndex === idx ? 'bg-yellow-500 text-gray-900 border-yellow-500 shadow-lg scale-105' : 'bg-gray-800 text-white border-gray-600 hover:border-gray-400'}`}
                  >
                    {v.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {renderDescription(product.description)}

          <div className="mt-auto pt-6 border-t border-gray-700">

            {/* --- ADMIN VIEW PROTECTION --- */}
            {isAdmin ? (
              <div className="w-full py-4 px-6 rounded-xl bg-red-900/20 border border-red-500/50 text-red-200 font-bold flex items-center justify-center cursor-not-allowed shadow-lg">
                <ShieldAlert className="mr-2" /> Admin View Only (Purchase Disabled)
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isAdded || product.stock === 0}
                className={`w-full py-4 px-6 rounded-xl font-extrabold text-lg uppercase tracking-widest flex items-center justify-center shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 ${isAdded ? 'bg-green-600 text-white' : product.stock === 0 ? 'bg-gray-600 cursor-not-allowed text-gray-400' : 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'}`}
              >
                {isAdded ? <CheckCircle className="mr-2" size={24} /> : <ShoppingCart className="mr-2" size={24} />}
                {isAdded ? 'Added to Cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            )}

            <button onClick={() => navigate('/shop')} className="w-full mt-4 py-3 px-6 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-gray-700 transition duration-300 flex items-center justify-center">
              <ChevronLeft size={16} className="mr-1" /> Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;