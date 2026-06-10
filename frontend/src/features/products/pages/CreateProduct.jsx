import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { ArrowLeft, Image as ImageIcon, Loader2, Plus, X, Tag, FileText, Coins, Sparkles, LayoutGrid } from 'lucide-react';

export default function CreateProduct() {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR'
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Check limit
    if (files.length + selectedFiles.length > 7) {
      setErrorMsg('You can upload a maximum of 7 images.');
      return;
    }
    
    setFiles((prev) => [...prev, ...selectedFiles]);
    if (errorMsg) setErrorMsg('');
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.title || !formData.description || !formData.priceAmount) {
      setErrorMsg('Please fill out all required fields');
      return;
    }

    if (files.length === 0) {
      setErrorMsg('Please upload at least 1 product image');
      return;
    }

    setSubmitting(true);
    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('priceAmount', formData.priceAmount);
      uploadData.append('priceCurrency', formData.priceCurrency);

      files.forEach((file) => {
        uploadData.append('images', file);
      });

      await handleCreateProduct(uploadData);
      setSuccessMsg('Product published successfully. Redirecting to dashboard...');
      
      // Redirect to dashboard after brief delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to create product. Make sure all fields are valid.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white flex flex-col font-['Noto_Sans'] antialiased">
      {/* Header */}
      <header className="border-b border-[#141414] bg-[#0c0c0c]/80 backdrop-blur-md sticky top-0 z-50 shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-[12px] text-[#888888] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Console
            </Link>
            <span className="text-[#333]">/</span>
            <span className="text-[14px] font-medium tracking-tight text-white select-none">Create Item</span>
          </div>
          <div>
            <span className="font-['DM_Mono'] text-[9px] uppercase tracking-widest text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded-[4px] bg-emerald-500/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              Console v1.0
            </span>
          </div>
        </div>
      </header>

      {/* Main Bento Grid Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full flex flex-col gap-6">
        
        {/* Title / Header block */}
        <div className="space-y-1">
          <h1 className="text-[22px] font-light text-white tracking-tight flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-[#444]" /> Publish New Product
          </h1>
          <p className="text-[12px] text-[#555] font-light">
            Modular Bento layout to register catalog items with pricing and media.
          </p>
        </div>

        {/* Global Error/Success banner */}
        {(successMsg || errorMsg) && (
          <div className="w-full transition-all">
            {successMsg && (
              <div className="text-[13px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-[8px] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5)]">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="text-[13px] text-[#ffb4ab] bg-[#93000a]/5 border border-[#93000a]/20 p-4 rounded-[8px] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5)]">
                {errorMsg}
              </div>
            )}
          </div>
        )}

        {/* Bento Grid Form Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT SECTION (Takes 2 Columns on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Box 1: Product Core Details (Embossed card) */}
            <div className="bg-[#0c0c0c] border border-[#1b1b1b] p-6 rounded-[12px] shadow-[8px_8px_24px_rgba(0,0,0,0.85),-6px_-6px_24px_rgba(255,255,255,0.012)] relative overflow-hidden space-y-5">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
              
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#666] font-semibold">
                <Tag className="h-3.5 w-3.5" /> Item Specifications
              </div>

              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[11px] text-[#555] font-semibold select-none">
                  TITLE
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Minimalist Combed Cotton Hoodie"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="bg-[#070707] border-[#1c1c1c] text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),inset_-2px_-2px_5px_rgba(255,255,255,0.01)] focus:border-[#333333] transition-all h-11"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-[11px] text-[#555] font-semibold select-none">
                  DESCRIPTION
                </Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the fit, silhouette, fabric weight, composition, fit and details..."
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={submitting}
                  rows={6}
                  className="w-full rounded-[6px] border border-[#1c1c1c] bg-[#070707] px-3 py-2.5 text-sm text-white placeholder:text-[#444444] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),inset_-2px_-2px_5px_rgba(255,255,255,0.01)] focus:border-[#333] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Box 2: Pricing Settings (Embossed card) */}
            <div className="bg-[#0c0c0c] border border-[#1b1b1b] p-6 rounded-[12px] shadow-[8px_8px_24px_rgba(0,0,0,0.85),-6px_-6px_24px_rgba(255,255,255,0.012)] relative overflow-hidden space-y-5">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />

              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#666] font-semibold">
                <Coins className="h-3.5 w-3.5" /> Pricing configuration
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="priceAmount" className="text-[11px] text-[#555] font-semibold select-none">
                    AMOUNT
                  </Label>
                  <Input
                    id="priceAmount"
                    name="priceAmount"
                    type="number"
                    placeholder="2499"
                    required
                    value={formData.priceAmount}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="bg-[#070707] border-[#1c1c1c] text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),inset_-2px_-2px_5px_rgba(255,255,255,0.01)] focus:border-[#333333] transition-all h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceCurrency" className="text-[11px] text-[#555] font-semibold select-none">
                    CURRENCY
                  </Label>
                  <div className="relative">
                    <select
                      id="priceCurrency"
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full h-11 rounded-[6px] border border-[#1c1c1c] bg-[#070707] px-3 text-sm text-white focus:border-[#333] focus:outline-none shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),inset_-2px_-2px_5px_rgba(255,255,255,0.01)] transition-all cursor-pointer appearance-none"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                    {/* Custom Arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#555]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SECTION (Takes 1 Column on large screens) */}
          <div className="space-y-6">
            
            {/* Box 3: Media Upload & Gallery (Embossed card) */}
            <div className="bg-[#0c0c0c] border border-[#1b1b1b] p-6 rounded-[12px] shadow-[8px_8px_24px_rgba(0,0,0,0.85),-6px_-6px_24px_rgba(255,255,255,0.012)] relative overflow-hidden space-y-4">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
              
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#666] font-semibold">
                <span className="flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Media Gallery</span>
                <span className="font-['DM_Mono'] text-[9px] text-[#555]">{files.length} / 7</span>
              </div>

              {/* Skeuomorphic Sunken Dropzone */}
              {files.length < 7 && (
                <div className="border border-[#181818] rounded-[8px] p-6 bg-[#070707] text-center shadow-[inset_3px_3px_8px_rgba(0,0,0,0.95),inset_-2px_-2px_8px_rgba(255,255,255,0.01)] relative hover:border-[#222] transition-colors duration-250 cursor-pointer group">
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={submitting}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="h-9 w-9 rounded-full bg-[#0d0d0d] shadow-[3px_3px_6px_rgba(0,0,0,0.5),-1px_-1px_3px_rgba(255,255,255,0.02)] border border-[#1c1c1c] flex items-center justify-center mx-auto group-hover:scale-[1.03] transition-transform">
                      <Plus className="h-4 w-4 text-[#666]" />
                    </div>
                    <p className="text-[12px] text-[#666] font-light">Add photos</p>
                    <p className="text-[9px] text-[#444] font-['DM_Mono'] uppercase tracking-wider">Max 5MB each</p>
                  </div>
                </div>
              )}

              {/* Image Previews list (Vertical list for Bento sidebar style) */}
              {files.length > 0 && (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {files.map((file, idx) => {
                    const objectUrl = URL.createObjectURL(file);
                    return (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-2 bg-[#070707] border border-[#161616] rounded-[6px] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)] gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-[4px] border border-[#1b1b1b] overflow-hidden flex items-center justify-center bg-black">
                            <img src={objectUrl} alt="Preview" className="h-full w-full object-cover" />
                          </div>
                          <div className="max-w-[120px]">
                            <p className="text-[11px] text-white truncate font-light">{file.name}</p>
                            <p className="text-[9px] text-[#444] font-['DM_Mono']">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="h-6 w-6 rounded-full bg-[#0d0d0d] hover:bg-black border border-[#222] flex items-center justify-center text-[#666] hover:text-white cursor-pointer transition-colors shadow-[1px_1px_3px_rgba(0,0,0,0.5)] active:translate-y-[1px]"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Box 4: Actions & Publish Trigger (Embossed card) */}
            <div className="bg-[#0c0c0c] border border-[#1b1b1b] p-6 rounded-[12px] shadow-[8px_8px_24px_rgba(0,0,0,0.85),-6px_-6px_24px_rgba(255,255,255,0.012)] relative overflow-hidden space-y-4">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
              
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#666] font-semibold">
                <Sparkles className="h-3.5 w-3.5" /> Action Console
              </div>

              <p className="text-[12px] text-[#555] leading-relaxed font-light">
                Once published, this product will immediately show up in the inventory list and collections.
              </p>

              <div className="space-y-3 pt-2">
                {/* Publish Button (Tactile push button) */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 bg-gradient-to-b from-white to-[#e5e5e5] text-black font-semibold rounded-[6px] hover:from-[#fcfcfc] hover:to-[#dadada] shadow-[4px_4px_12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-[1px] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20 select-none text-[13px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-black" />
                      Publishing...
                    </>
                  ) : (
                    <>Publish Product</>
                  )}
                </Button>

                {/* Cancel Button */}
                <Link to="/dashboard" className="block w-full">
                  <Button
                    type="button"
                    disabled={submitting}
                    className="w-full h-10 bg-gradient-to-b from-[#1b1b1b] to-[#0f0f0f] text-[#888] border border-[#222] hover:text-white shadow-[3px_3px_8px_rgba(0,0,0,0.5)] active:translate-y-[1px] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7)] transition-all flex items-center justify-center gap-2 cursor-pointer text-[12px] font-medium"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>

          </div>

        </form>
      </main>
    </div>
  );
}