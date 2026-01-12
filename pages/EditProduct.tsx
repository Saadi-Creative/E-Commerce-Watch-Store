// src/pages/EditProduct.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { UploadCloud, Plus, Trash2, RefreshCw, Palette, ArrowLeft } from 'lucide-react';
import { compressImage } from '../services/imageOptimizer';
import { uploadImageSecure } from '../services/api'; // NEW: Secure API

interface Variant { color: string; images: string[]; }

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || 'wh-secret-panel';
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // --- FORM STATE ---
  const [productName, setProductName] = useState('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [discountPercentage, setDiscountPercentage] = useState<number | ''>(0);
  const [stock, setStock] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [isFeatured, setIsFeatured] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);

  // --- VARIANT UI STATE ---
  const [currentColor, setCurrentColor] = useState('');
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  // --- FETCH EXISTING DATA ---
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, 'products', id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProductName(data.name || '');
          setOriginalPrice(data.originalPrice || data.price);
          setDiscountPercentage(data.discount || 0);
          setStock(data.stock || 0);
          setDescription(data.description || '');
          setBrand(data.brand || '');
          setGender(data.gender || 'Male');
          setIsFeatured(data.isFeatured || false);
          setVariants(data.variants || []);

          if ((!data.variants || data.variants.length === 0) && data.imageUrls) {
            setVariants([{ color: 'Standard', images: data.imageUrls }]);
          }
        } else {
          alert("Product not found!");
          navigate(`/${ADMIN_PATH}/inventory`);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const finalPrice = useMemo(() => {
    const priceVal = Number(originalPrice);
    const discountVal = Number(discountPercentage);
    if (isNaN(priceVal) || priceVal <= 0) return 0;
    return Math.round(priceVal * (1 - discountVal / 100));
  }, [originalPrice, discountPercentage]);

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
            // 2. Upload Securely
            const url = await uploadImageSecure(compressedFile, import.meta.env.VITE_ADMIN_SECRET);

            if (url) {
              uploadedUrls.push(url);
            } else {
              alert(`Failed to upload ${file.name} via secure server`);
            }
          } catch (err) {
            console.error("Error processing file", file.name, err);
            alert(`Error: ${err instanceof Error ? err.message : String(err)}`);
          }
        }
      }
      setCurrentImages([...currentImages, ...uploadedUrls]);
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleAddVariant = () => {
    if (!currentColor || currentImages.length === 0) { alert("Add color name and images."); return; }
    setVariants([...variants, { color: currentColor, images: currentImages }]);
    setCurrentColor(''); setCurrentImages([]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'products', id), {
        name: productName,
        originalPrice: Number(originalPrice),
        discount: Number(discountPercentage),
        price: finalPrice,
        stock: Number(stock),
        description,
        brand,
        gender,
        isFeatured,
        variants,
        imageUrls: variants.length > 0 ? variants[0].images : [],
        updatedAt: serverTimestamp()
      });
      setMessage({ type: 'success', text: 'Product updated successfully!' });
      setTimeout(() => navigate(`/${ADMIN_PATH}/inventory`), 1500);
    } catch (error: any) {
      setMessage({ type: 'error', text: "Error updating: " + error.message });
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = "w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none";
  const labelStyle = "block text-gray-300 mb-2 font-bold text-sm uppercase tracking-wide";

  if (loadingData) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading Product Data...</div>;

  return (
    <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl border border-gray-700 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
        <div className="flex items-center">
          <button onClick={() => navigate(`/${ADMIN_PATH}/inventory`)} className="mr-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600 text-white"><ArrowLeft size={20} /></button>
          <h2 className="text-2xl font-bold text-white">Edit Product</h2>
        </div>
      </div>

      {message && <div className={`p-4 mb-6 rounded-lg text-center font-bold ${message.type === 'success' ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>{message.text}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        <div><label className={labelStyle}>Product Name</label><input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className={inputStyle} /></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <div><label className={labelStyle}>Original Price</label><input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))} className={inputStyle} /></div>
          <div><label className={labelStyle}>Discount %</label><input type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(Number(e.target.value))} className={inputStyle} /></div>
          <div><label className={labelStyle}>Final Price</label><div className="h-[50px] flex items-center px-4 rounded bg-gray-700 border border-gray-600 text-green-400 font-bold text-lg">Rs. {finalPrice.toLocaleString()}</div></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div><label className={labelStyle}>Stock</label><input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className={inputStyle} /></div>
          <div><label className={labelStyle}>Brand</label><input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className={inputStyle} /></div>
          <div><label className={labelStyle}>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value as any)} className={inputStyle}>
              <option value="Male">Male ♂️</option><option value="Female">Female ♀️</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-gray-700/30 p-3 rounded border border-gray-600">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-5 w-5 text-yellow-500" />
          <label className="text-gray-300">Mark as Featured</label>
        </div>

        <div><label className={labelStyle}>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={inputStyle}></textarea></div>

        {/* VARIANTS */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-600">
          <h3 className="text-yellow-500 font-bold mb-4 flex items-center text-lg"><Palette className="mr-2" /> Variants</h3>
          {variants.map((v, idx) => (
            <div key={idx} className="flex justify-between items-center bg-gray-700 p-3 rounded mb-2 border border-gray-600">
              <span className="text-white font-bold">{v.color} ({v.images.length} imgs)</span>
              <button type="button" onClick={() => setVariants(variants.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
            </div>
          ))}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-700">
            <input type="text" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} className={inputStyle} placeholder="New Color Name" />
            <label className="cursor-pointer flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              {uploading ? <RefreshCw className="animate-spin mr-2" size={20} /> : <UploadCloud className="mr-2" size={20} />}
              {uploading ? uploadProgress : 'Upload Images'}
              <input type="file" multiple onChange={handleFileChange} className="hidden" disabled={uploading} />
            </label>
          </div>
          <button type="button" onClick={handleAddVariant} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded flex items-center justify-center"><Plus className="mr-2" /> Add Variant</button>
        </div>

        <button type="submit" disabled={saving} className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-extrabold py-4 rounded-xl text-lg shadow-xl mt-6 transition-transform hover:scale-[1.01]">
          {saving ? 'Saving Changes...' : 'UPDATE PRODUCT'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;