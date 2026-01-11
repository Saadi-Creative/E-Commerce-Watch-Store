import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ChevronDown, Filter, Search, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';

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
  brand?: string;
  gender?: 'Male' | 'Female';
  createdAt?: any;
}

const Shop: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- FILTER STATES ---
  const [brandFilter, setBrandFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [priceSort, setPriceSort] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  const uniqueBrands = useMemo(() => {
    const brands = new Set(allProducts.map(p => p.brand).filter((b): b is string => !!b));
    return ['All', ...Array.from(brands).sort()];
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let list = [...allProducts];
    if (brandFilter !== 'All') { list = list.filter(p => p.brand === brandFilter); }
    if (genderFilter !== 'All') { list = list.filter(p => p.gender === genderFilter); }
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(lowerCaseSearch) ||
        (p.brand && p.brand.toLowerCase().includes(lowerCaseSearch))
      );
    }
    if (priceSort === 'asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (priceSort === 'newest') {
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }
    return list;
  }, [allProducts, brandFilter, genderFilter, priceSort, searchTerm]);

  const resetFilters = () => {
    setBrandFilter('All');
    setGenderFilter('All');
    setPriceSort('newest');
    setSearchTerm('');
  };

  // --- PAGINATION STATE ---
  const [visibleCount, setVisibleCount] = useState(12);

  // ... (filters logic remains)

  // Modified to slice the array based on visibleCount
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [brandFilter, genderFilter, priceSort, searchTerm]);

  useEffect(() => {
    // Fetch ALL products once (Data is small, DOM is heavy)
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        // ... (parsing logic remains same)
        const productsData: Product[] = [];
        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          let images: string[] = [];
          if (data.variants && Array.isArray(data.variants) && data.variants.length > 0) { images = data.variants[0].images; }
          else if (data.imageUrls && Array.isArray(data.imageUrls)) { images = data.imageUrls; }
          else if (typeof data.imageUrl === 'string') { images = [data.imageUrl]; }
          const price = Number(data.price);
          const original = data.originalPrice ? Number(data.originalPrice) : 0;

          productsData.push({
            id: doc.id,
            name: data.name,
            price: price,
            originalPrice: original,
            discount: data.discount || 0,
            description: data.description,
            brand: data.brand || 'Unbranded',
            gender: data.gender || 'Unisex',
            imageUrls: images,
            createdAt: data.createdAt
          } as Product);
        });
        setAllProducts(productsData);
      } catch (err) {
        setError("Failed to load products. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] bg-gray-900 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500 mb-4"></div>
      <p className="text-white text-xl font-semibold">Curating Collection...</p>
    </div>
  );

  if (error) return <div className="text-red-500 text-center mt-20 p-4 bg-red-900/20 border border-red-500 mx-4 rounded">{error}</div>;

  return (
    <div className="bg-gray-900 min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">

        {/* --- BANNER - Enhanced with glass effect --- */}
        <div className="h-[120px] mb-8 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-2xl flex flex-col items-center justify-center p-4 shadow-glow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-widest drop-shadow-lg z-10 text-center">
            Premium Collection
          </h2>
          <p className="text-yellow-100 text-sm md:text-base font-medium z-10 mt-1">Find your perfect timepiece</p>
        </div>

        {/* --- FILTER BAR --- */}
        {/* 🔥 FIX: Changed to 'relative'. It stays at the top of the list, 
            but SCROLLS AWAY when you scroll down, so it never blocks the products. 
        */}
        <div className="bg-gray-800/60 backdrop-blur-sm p-4 rounded-xl shadow-lg mb-8 flex flex-col lg:flex-row gap-4 items-center border border-gray-700/50 relative z-30 transition-all">

          {/* Search Bar */}
          <div className="relative w-full lg:w-1/3 group">
            <input
              type="text"
              placeholder="Search watches, brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 pl-11 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all group-hover:bg-gray-600"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-yellow-500 transition-colors" size={20} />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap md:flex-nowrap gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 items-center custom-scrollbar">
            <div className="relative flex-grow md:flex-grow-0 min-w-[140px]">
              <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="appearance-none w-full md:w-48 bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 pr-10 focus:ring-2 focus:ring-yellow-500 cursor-pointer hover:bg-gray-600 transition-colors">
                {uniqueBrands.map(brand => (<option key={brand} value={brand}>{brand === 'All' ? 'All Brands' : brand}</option>))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
            <div className="relative flex-grow md:flex-grow-0 min-w-[140px]">
              <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="appearance-none w-full md:w-40 bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 pr-10 focus:ring-2 focus:ring-yellow-500 cursor-pointer hover:bg-gray-600 transition-colors">
                <option value="All">All Genders</option><option value="Male">Male ♂️</option><option value="Female">Female ♀️</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
            <div className="relative flex-grow md:flex-grow-0 min-w-[140px]">
              <select value={priceSort} onChange={(e) => setPriceSort(e.target.value)} className="appearance-none w-full md:w-40 bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 pr-10 focus:ring-2 focus:ring-yellow-500 cursor-pointer hover:bg-gray-600 transition-colors">
                <option value="newest">Sort: Newest</option><option value="asc">Price: Low to High</option><option value="desc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
            {(brandFilter !== 'All' || genderFilter !== 'All' || priceSort !== 'newest' || searchTerm) && (
              <button onClick={resetFilters} className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors whitespace-nowrap">Reset</button>
            )}
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-400 py-24 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
            <div className="bg-gray-800 p-4 rounded-full inline-block mb-4"><Filter className="text-yellow-500" size={48} /></div>
            <h3 className="text-2xl font-bold text-white mb-2">No watches found</h3>
            <p className="text-gray-400 mb-6">We couldn't find any matches for your filters.</p>
            <button onClick={resetFilters} className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors">Clear All Filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {visibleProducts.map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* LOAD MORE BUTTON */}
            {visibleCount < filteredProducts.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-3 bg-gray-800 text-white border border-gray-600 rounded-full hover:bg-yellow-500 hover:text-gray-900 hover:border-yellow-500 transition-all font-bold tracking-wider uppercase text-sm"
                >
                  Load More Watches ({filteredProducts.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;