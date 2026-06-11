import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { ArrowLeft, Image as ImageIcon, Loader2, Plus, X, Tag, Coins, Sparkles, LayoutGrid } from 'lucide-react';
import { ThemeToggle } from '../../../components/ThemeToggle';

export default function CreateProduct() {
  const { handleCreateProduct } = useProduct();

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
  const [responseVal, setResponseVal] = useState(null);

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
    setResponseVal(null);

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

      const product = await handleCreateProduct(uploadData);
      setSuccessMsg('Product published successfully.');
      setResponseVal(product); // Just store it in response state
    } catch (err) {
      console.error(err);
      const errors = err.response?.data?.errors;
      if (errors && Array.isArray(errors)) {
        const errorDetails = errors.map(e => e.msg).join(' | ');
        setErrorMsg(`Validation Error: ${errorDetails}`);
      } else {
        setErrorMsg(err.response?.data?.message || 'Failed to create product.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-bento-bg text-bento-text flex flex-col font-['Noto_Sans'] antialiased overflow-hidden">
      {/* Header */}
      <header className="border-b border-bento-border bg-bento-card/80 backdrop-blur-md sticky top-0 z-50 shadow-[0_2px_15px_rgba(0,0,0,0.6)] shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/seller/dashboard" className="text-[12px] text-bento-text-faint hover:text-bento-text transition-colors flex items-center gap-1.5 cursor-pointer">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Console
            </Link>
            <span className="text-bento-text-muted">/</span>
            <span className="text-[14px] font-medium tracking-tight text-bento-text select-none">Create Item</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="font-['DM_Mono'] text-[9px] uppercase tracking-widest text-bento-text-muted border border-bento-border-light px-1.5 py-0.5 rounded-[4px] bg-bento-card-sunken shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              Console v1.0
            </span>
          </div>
        </div>
      </header>

      {/* Main Bento Grid Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-6 w-full flex flex-col gap-4 overflow-hidden h-[calc(100vh-4rem)]">
        
        {/* Title / Header block */}
        <div className="space-y-0.5 shrink-0">
          <h1 className="text-[20px] font-light text-bento-text tracking-tight flex items-center gap-2">
            <LayoutGrid className="h-4.5 w-4.5 text-bento-text-faint" /> Publish New Product
          </h1>
          <p className="text-[11px] text-bento-text-muted font-light">
            Modular Bento layout to register catalog items.
          </p>
        </div>

        {/* Global Error/Success banner */}
        {(successMsg || errorMsg) && (
          <div className="w-full transition-all shrink-0">
            {successMsg && (
              <div className="text-[12px] text-bento-text bg-bento-card-sunken/40 border border-bento-border-light px-4 py-2.5 rounded-[6px] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5)]">
                {successMsg} {responseVal && <span className="font-['DM_Mono'] text-[10px] text-[#777] ml-2">ID: {responseVal._id}</span>}
              </div>
            )}
            {errorMsg && (
              <div className="text-[12px] text-[#ffb4ab] bg-[#93000a]/5 border border-[#93000a]/20 px-4 py-2.5 rounded-[6px] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5)]">
                {errorMsg}
              </div>
            )}
          </div>
        )}

        {/* Bento Grid Form Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 h-0 overflow-hidden pb-4">
          
          {/* LEFT SECTION (Takes 2 Columns on large screens) */}
          <div className="lg:col-span-2 flex flex-col gap-6 h-full overflow-hidden">
            
            {/* Box 1: Product Core Details (Embossed card) */}
            <div className="bg-bento-card border border-bento-border p-5 rounded-[12px] shadow-bento relative overflow-hidden space-y-4 flex flex-col flex-1 h-0">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-bento-border pointer-events-none" />
              
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-bento-text-muted font-semibold shrink-0">
                <Tag className="h-3 w-3" /> Item Specifications
              </div>

              {/* Title Field */}
              <div className="space-y-1.5 shrink-0">
                <Label htmlFor="title" className="text-[10px] text-bento-text-muted font-semibold select-none">
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
                  className="bg-bento-card-sunken border-[#1c1c1c] text-bento-text shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),inset_-2px_-2px_5px_rgba(255,255,255,0.01)] focus:border-[#333333] transition-all h-[38px] text-xs"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-1.5 flex-1 flex flex-col h-0">
                <Label htmlFor="description" className="text-[10px] text-bento-text-muted font-semibold select-none shrink-0">
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
                  className="w-full flex-1 rounded-[6px] border border-[#1c1c1c] bg-bento-card-sunken px-3 py-2 text-xs text-bento-text placeholder:text-[#444444] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),inset_-2px_-2px_5px_rgba(255,255,255,0.01)] focus:border-[#333] focus:outline-none transition-all resize-none min-h-[100px]"
                />
              </div>
            </div>

            {/* Box 2: Pricing Settings (Embossed card) */}
            <div className="bg-bento-card border border-bento-border p-5 rounded-[12px] shadow-bento relative overflow-hidden space-y-4 shrink-0">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-bento-border pointer-events-none" />

              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-bento-text-muted font-semibold">
                <Coins className="h-3 w-3" /> Pricing configuration
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="priceAmount" className="text-[10px] text-bento-text-muted font-semibold select-none">
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
                    className="bg-bento-card-sunken border-[#1c1c1c] text-bento-text shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),inset_-2px_-2px_5px_rgba(255,255,255,0.01)] focus:border-[#333333] transition-all h-[38px] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="priceCurrency" className="text-[10px] text-bento-text-muted font-semibold select-none">
                    CURRENCY
                  </Label>
                  <div className="relative">
                    <select
                      id="priceCurrency"
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full h-[38px] rounded-[6px] border border-[#1c1c1c] bg-bento-card-sunken px-3 text-xs text-bento-text focus:border-[#333] focus:outline-none shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),inset_-2px_-2px_5px_rgba(255,255,255,0.01)] transition-all cursor-pointer appearance-none"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                    {/* Custom Arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-bento-text-muted">
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
          <div className="flex flex-col gap-6 h-full overflow-hidden">
            
            {/* Box 3: Media Upload & Gallery (Embossed card) */}
            <div className="bg-bento-card border border-bento-border p-5 rounded-[12px] shadow-bento relative overflow-hidden space-y-4 flex flex-col flex-1 h-0">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-bento-border pointer-events-none" />
              
              <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-bento-text-muted font-semibold shrink-0">
                <span className="flex items-center gap-1.5"><ImageIcon className="h-3 w-3" /> Media Gallery</span>
                <span className="font-['DM_Mono'] text-[9px] text-bento-text-muted">{files.length} / 7</span>
              </div>

              {/* Skeuomorphic Sunken Dropzone */}
              {files.length < 7 && (
                <div className="border border-bento-border-light rounded-[8px] p-4 bg-bento-card-sunken text-center shadow-[inset_3px_3px_8px_rgba(0,0,0,0.95),inset_-2px_-2px_8px_rgba(255,255,255,0.01)] relative hover:border-bento-border-light transition-colors duration-250 cursor-pointer group shrink-0">
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={submitting}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-1.5 pointer-events-none">
                    <div className="h-8 w-8 rounded-full bg-[#0d0d0d] shadow-[3px_3px_6px_rgba(0,0,0,0.5),-1px_-1px_3px_rgba(255,255,255,0.02)] border border-[#1c1c1c] flex items-center justify-center mx-auto group-hover:scale-[1.03] transition-transform">
                      <Plus className="h-3.5 w-3.5 text-bento-text-muted" />
                    </div>
                    <p className="text-[11px] text-bento-text-muted font-light">Add photos</p>
                    <p className="text-[8px] text-bento-text-faint font-['DM_Mono'] uppercase tracking-wider">Max 5MB each</p>
                  </div>
                </div>
              )}

              {/* Image Previews list (Vertical list for Bento sidebar style) */}
              {files.length > 0 && (
                <div className="space-y-1.5 flex-1 overflow-y-auto pr-1 shadow-[inset_0_2px_5px_rgba(0,0,0,0.3)] bg-bento-card-sunken/10 p-1.5 rounded border border-bento-border-light">
                  {files.map((file, idx) => {
                    const objectUrl = URL.createObjectURL(file);
                    return (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-1.5 bg-bento-card-sunken border border-bento-border-light rounded-[6px] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)] gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-[4px] border border-bento-border overflow-hidden flex items-center justify-center bg-black">
                            <img src={objectUrl} alt="Preview" className="h-full w-full object-cover" />
                          </div>
                          <div className="max-w-[100px]">
                            <p className="text-[10px] text-bento-text truncate font-light">{file.name}</p>
                            <p className="text-[8px] text-bento-text-faint font-['DM_Mono']">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="h-5 w-5 rounded-[4px] border border-bento-border-light bg-bento-card hover:bg-[#252525] shadow-[2px_2px_4px_rgba(0,0,0,0.8),-1px_-1px_2px_rgba(255,255,255,0.03),inset_1px_1px_1px_rgba(255,255,255,0.1),inset_-1px_-1px_1px_rgba(0,0,0,0.6)] active:translate-y-[1px] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)] transition-all flex items-center justify-center text-bento-text-muted hover:text-bento-text cursor-pointer focus:outline-none"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Box 4: Actions & Publish Trigger (Embossed card) */}
            <div className="bg-bento-card border border-bento-border p-5 rounded-[12px] shadow-bento relative overflow-hidden space-y-3 shrink-0">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-bento-border pointer-events-none" />
              
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-bento-text-muted font-semibold">
                <Sparkles className="h-3 w-3" /> Action Console
              </div>

              <p className="text-[11px] text-bento-text-muted leading-relaxed font-light">
                Publish this product to register it immediately in the collections database.
              </p>

              <div className="space-y-2.5 pt-1">
                {/* Publish Button (Tactile push button) */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-[38px] text-[12px] gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-black" />
                      Publishing...
                    </>
                  ) : (
                    <>Publish Product</>
                  )}
                </Button>

                {/* Cancel Button */}
                <Link to="/seller/dashboard" className="block w-full">
                  <Button
                    type="button"
                    disabled={submitting}
                    variant="secondary"
                    className="w-full h-[34px] text-[11px]"
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