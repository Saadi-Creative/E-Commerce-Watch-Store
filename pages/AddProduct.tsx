// src/pages/AddProduct.tsx
import React, { useState, useMemo } from 'react';
import { db } from '../firebase';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
// FIX: Removed CheckCircle from import
import { UploadCloud, Plus, Trash2, RefreshCw, Palette } from 'lucide-react';
import { compressImage } from '../services/imageOptimizer';
import { uploadImageSecure } from '../services/api'; // NEW: Secure API

interface Variant {
  color: string;
  images: string[];
}

const AddProduct: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [discountPercentage, setDiscountPercentage] = useState<number | ''>(0);
  const [stock, setStock] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [isFeatured, setIsFeatured] = useState(false);

  const [variants, setVariants] = useState<Variant[]>([]);
  const [currentColor, setCurrentColor] = useState('');
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const finalPrice = useMemo(() => {
    const priceVal = Number(originalPrice);
    const discountVal = Number(discountPercentage);
    if (isNaN(priceVal) || priceVal <= 0 || isNaN(discountVal) || discountVal < 0 || discountVal > 100) {
      return null;
    }
    return Math.round(priceVal * (1 - discountVal / 100));
  }, [originalPrice, discountPercentage]);

  // REMOVED direct uploadImageToImgBB
  // Replaced with uploadImageSecure in handleFileChange

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      const files = e.target.files;
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
          try {
            setUploadProgress(`Uploading ${file.name}...`);

            // 1. Compress
            const compressedFile = await compressImage(file);

            // 2. Upload Securely via Backend
            const url = await uploadImageSecure(compressedFile, import.meta.env.VITE_ADMIN_SECRET);

            if (url) {
              uploadedUrls.push(url);
            } else {
              // Fallback? No, just fail securely.
              console.error("Secure upload failed for", file.name);
              alert(`Failed to upload ${file.name} via secure server`);
              // Try uncompressed direct? No, that exposes key.
            }
          } catch (error) {
            console.error("Error processing file", file.name, error);
            alert(`Error processing ${file.name}: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
      }
      setCurrentImages([...currentImages, ...uploadedUrls]);
      setUploading(false);
      setUploadProgress('');
    }
  };

  const removeCurrentImage = (index: number) => setCurrentImages(currentImages.filter((_, i) => i !== index));
  const addManualUrl = () => {
    const url = prompt("Enter Image URL manually:");
    if (url) setCurrentImages([...currentImages, url]);
  };

  const handleAddVariant = () => {
    if (!currentColor || currentImages.length === 0) {
      alert("Please enter a Color Name and upload at least one image.");
      return;
    }
    setVariants([...variants, { color: currentColor, images: currentImages }]);
    setCurrentColor('');
    setCurrentImages([]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const generateSafeId = (name: string) => {
    const cleanName = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${cleanName}-${randomSuffix}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName || originalPrice === '' || stock === '' || !description || !brand || finalPrice === null) {
      setMessage({ type: 'error', text: 'Please check all basic fields.' });
      return;
    }
    if (variants.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one Color Variant.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const customDocId = generateSafeId(productName);
      const productData = {
        name: productName,
        originalPrice: Number(originalPrice),
        discount: Number(discountPercentage),
        price: finalPrice,
        stock: Number(stock),
        description: description,
        brand: brand,
        gender: gender,
        isFeatured: isFeatured,
        variants: variants,
        imageUrls: variants[0].images,
        createdAt: serverTimestamp(),
        id: customDocId
      };

      await setDoc(doc(db, 'products', customDocId), productData);

      setMessage({ type: 'success', text: `Product saved successfully! ID: ${customDocId}` });

      setProductName(''); setOriginalPrice(''); setDiscountPercentage(0); setStock(''); setDescription(''); setVariants([]); setBrand(''); setIsFeatured(false);
      window.scrollTo(0, 0);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none transition-colors";
  const labelStyle = "block text-gray-300 mb-2 font-bold text-sm uppercase tracking-wide";

  return (
    <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl border border-gray-700 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Plus className="mr-2 text-yellow-500" /> Add New Product
        </h2>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg text-center font-bold ${message.type === 'success' ? 'bg-green-900/50 text-green-200 border border-green-500' : 'bg-red-900/50 text-red-200 border border-red-500'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className={labelStyle}>Product Name</label>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className={inputStyle} placeholder="e.g. Omega Seamaster" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <div>
            <label className={labelStyle}>Original Price (Rs)</label>
            <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputStyle} min="1" placeholder="0" />
          </div>
          <div>
            <label className={labelStyle}>Discount (%)</label>
            <input type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value === '' ? 0 : parseFloat(e.target.value))} className={inputStyle} min="0" max="100" placeholder="0" />
          </div>
          <div>
            <label className={labelStyle}>Final Price</label>
            <div className="h-[50px] flex items-center px-4 rounded bg-gray-700 border border-gray-600 text-green-400 font-bold text-lg">
              {finalPrice !== null ? `Rs. ${finalPrice.toLocaleString()}` : '...'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelStyle}>Stock Qty</label>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputStyle} min="0" placeholder="10" />
          </div>
          <div>
            <label className={labelStyle}>Brand</label>
            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className={inputStyle} placeholder="Rolex" />
          </div>
          <div>
            <label className={labelStyle}>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value as 'Male' | 'Female')} className={inputStyle}>
              <option value="Male">Male ♂️</option>
              <option value="Female">Female ♀️</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-gray-700/30 p-3 rounded border border-gray-600">
          <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-5 w-5 text-yellow-500 rounded focus:ring-yellow-500 cursor-pointer" />
          <label htmlFor="isFeatured" className="text-gray-300 cursor-pointer font-medium select-none">Mark as "Featured Product" on Homepage</label>
        </div>

        <div>
          <label className={labelStyle}>Description</label>
          <div className="relative group">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className={`${inputStyle} resize-none pr-16 focus:ring-2 focus:ring-yellow-500/50`}
              placeholder="Write a compelling description that highlights the watch's key features, materials, and what makes it special..."
            />
            {/* Character Count */}
            <div className="absolute bottom-3 right-3 text-xs text-gray-500">
              <span className={description.length > 500 ? 'text-yellow-400' : ''}>{description.length}</span>
              <span className="text-gray-600"> / 500+</span>
            </div>
          </div>
          {/* Writing Tips */}
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-[10px] text-gray-500 bg-gray-700/50 px-2 py-1 rounded-full">💡 Include: movement type, case size, water resistance, strap material</span>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-600">
          <h3 className="text-yellow-500 font-bold mb-4 flex items-center text-lg"><Palette className="mr-2" /> Image & Color Manager</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">1. Color Name</label>
              <input type="text" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} className={inputStyle} placeholder="e.g. Silver Dial" />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">2. Upload Images</label>
              <label className="cursor-pointer flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition w-full shadow-lg">
                {uploading ? <RefreshCw className="animate-spin mr-2" size={20} /> : <UploadCloud className="mr-2" size={20} />}
                {uploading ? uploadProgress : 'Select Files'}
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
              </label>
              <button type="button" onClick={addManualUrl} className="text-xs text-gray-500 mt-2 hover:text-gray-300 underline">Or use URL</button>
            </div>
          </div>

          {currentImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4 p-3 bg-gray-800 rounded border border-gray-700">
              {currentImages.map((url, index) => (
                <div key={index} className="relative w-20 h-20 group">
                  <img src={url} alt="Preview" className="w-full h-full object-cover rounded border border-gray-500" />
                  <button type="button" onClick={() => removeCurrentImage(index)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
          )}

          <button type="button" onClick={handleAddVariant} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center shadow-lg transition-transform transform active:scale-95">
            <Plus className="mr-2" /> Add This Variant
          </button>
        </div>

        {variants.length > 0 && (
          <div className="space-y-2">
            <label className={labelStyle}>Ready to Save:</label>
            {variants.map((v, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-700 p-3 rounded border border-gray-600 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded bg-gray-800 overflow-hidden">
                    <img src={v.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">{v.color}</span>
                    <span className="text-xs text-gray-400">{v.images.length} images</span>
                  </div>
                </div>
                <button type="button" onClick={() => removeVariant(idx)} className="text-red-400 hover:text-red-200 p-2 hover:bg-gray-600 rounded"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" disabled={loading || uploading} className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-extrabold py-4 rounded-xl text-lg shadow-xl hover:shadow-yellow-500/20 transition-all transform hover:scale-[1.01]">
          {loading ? 'Uploading Product...' : 'PUBLISH PRODUCT'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;