import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/hook/useAuth';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { getAllProducts, createProduct, deleteProduct, updateProduct } from '../service/product.api';
import { Plus, Trash2, Edit2, LogOut, ArrowLeft, Image as ImageIcon, Loader2, Package, Tag, Coins, X } from 'lucide-react';

export default function Dashboard() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR'
  });
  const [files, setFiles] = useState([]);

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR'
  });
  const [editFiles, setEditFiles] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'seller') {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      // Filter products owned by this seller
      const myProducts = data.filter(
        (p) => p.seller && (p.seller._id === user.id || p.seller === user.id || p.seller._id === user._id || p.seller === user._id)
      );
      setProducts(myProducts);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleEditFileChange = (e) => {
    setEditFiles(Array.from(e.target.files));
  };

  const handleLogoutClick = async () => {
    const res = await handleLogout();
    if (res.success) {
      navigate('/login');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.title || !formData.description || !formData.priceAmount) {
      setErrorMsg('Please fill out all required fields');
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

      await createProduct(uploadData);
      setSuccessMsg('Product created successfully');
      setFormData({ title: '', description: '', priceAmount: '', priceCurrency: 'INR' });
      setFiles([]);
      
      const fileInput = document.getElementById('product-images');
      if (fileInput) fileInput.value = '';

      fetchProducts();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await deleteProduct(id);
      setSuccessMsg('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to delete product');
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditFormData({
      title: product.title,
      description: product.description,
      priceAmount: product.price?.amount || '',
      priceCurrency: product.price?.currency || 'INR'
    });
    setEditFiles([]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFiles([]);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const uploadData = new FormData();
      uploadData.append('title', editFormData.title);
      uploadData.append('description', editFormData.description);
      uploadData.append('priceAmount', editFormData.priceAmount);
      uploadData.append('priceCurrency', editFormData.priceCurrency);

      editFiles.forEach((file) => {
        uploadData.append('images', file);
      });

      await updateProduct(editingId, uploadData);
      setSuccessMsg('Product updated successfully');
      setEditingId(null);
      setEditFiles([]);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-primary flex flex-col font-['DM_Sans']">
      {/* Header */}
      <header className="border-b border-[#1e1e1e] bg-[#0c0c0c]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-[12px] text-[#555555] hover:text-white transition-colors flex items-center gap-1.5">
              <ArrowLeft className="h-3 w-3" /> Back
            </Link>
            <span className="text-white">/</span>
            <span className="text-[15px] font-medium tracking-tight text-white select-none">snitch. console</span>
            <span className="font-['DM_Mono'] text-[9px] uppercase tracking-widest text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded-[4px] bg-emerald-500/5">
              Seller Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-[#666666] font-light">
              Logged in as <strong className="text-[#a0a0a0] font-normal">{user?.fullname}</strong>
            </span>
            <button
              onClick={handleLogoutClick}
              className="text-[12px] text-[#888888] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer focus:outline-none"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Column: Products List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[20px] font-light text-white tracking-tight">Your Inventory</h2>
              <p className="text-[12px] text-[#555555]">Manage your catalog and items.</p>
            </div>
            <span className="text-[11px] font-['DM_Mono'] text-[#444444] border border-[#1e1e1e] px-2 py-1 rounded-[4px] bg-[#0c0c0c]">
              Total Items: {products.length}
            </span>
          </div>

          {/* Success / Error Messages */}
          {successMsg && (
            <div className="text-[13px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-[6px] transition-all">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="text-[13px] text-[#ffb4ab] bg-[#93000a]/10 border border-[#93000a]/20 p-3.5 rounded-[6px] transition-all">
              {errorMsg}
            </div>
          )}

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 text-[#444444] animate-spin" />
              <span className="text-[12px] text-[#555555] tracking-wide">Syncing inventory...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="border border-[#1e1e1e] border-dashed rounded-[8px] p-20 text-center flex flex-col items-center justify-center gap-4 bg-[#0c0c0c]/40">
              <Package className="h-10 w-10 text-[#2a2a2a]" strokeWidth={1} />
              <div className="space-y-1">
                <p className="text-[14px] text-[#777777] font-light">No products listed yet</p>
                <p className="text-[12px] text-[#444444] font-light">Use the form on the right to register your first product.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => {
                const isEditing = editingId === product._id;
                return (
                  <Card key={product._id} className="bg-[#0c0c0c] border-[#1e1e1e] hover:border-[#2e2e2e] transition-all flex flex-col overflow-hidden">
                    
                    {/* Product Image Preview Header */}
                    <div className="h-[160px] bg-[#121212] relative overflow-hidden flex items-center justify-center border-b border-[#181818]">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.title}
                          className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-[#333333]">
                          <ImageIcon className="h-7 w-7" />
                          <span className="text-[10px] uppercase tracking-wider font-['DM_Mono']">No Preview</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-[4px] border border-[#1e1e1e]">
                        <span className="text-[11px] font-['DM_Mono'] text-white">
                          {product.price?.currency || 'INR'} {product.price?.amount}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col justify-between">
                      {isEditing ? (
                        /* Edit Mode Form Inline */
                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                          <div className="space-y-1">
                            <Label htmlFor={`edit-title-${product._id}`} className="text-[11px] text-[#555555]">Title</Label>
                            <Input
                              id={`edit-title-${product._id}`}
                              name="title"
                              value={editFormData.title}
                              onChange={handleEditInputChange}
                              disabled={submitting}
                              className="h-[32px] text-[12px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`edit-desc-${product._id}`} className="text-[11px] text-[#555555]">Description</Label>
                            <textarea
                              id={`edit-desc-${product._id}`}
                              name="description"
                              value={editFormData.description}
                              onChange={handleEditInputChange}
                              disabled={submitting}
                              rows={2}
                              className="w-full rounded-[6px] border border-[#1e1e1e] bg-[#0c0c0c] px-3 py-2 text-[12px] text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#333333] placeholder:text-[#3a3a3a]"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label htmlFor={`edit-price-${product._id}`} className="text-[11px] text-[#555555]">Price</Label>
                              <Input
                                id={`edit-price-${product._id}`}
                                name="priceAmount"
                                type="number"
                                value={editFormData.priceAmount}
                                onChange={handleEditInputChange}
                                disabled={submitting}
                                className="h-[32px] text-[12px]"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`edit-currency-${product._id}`} className="text-[11px] text-[#555555]">Currency</Label>
                              <select
                                id={`edit-currency-${product._id}`}
                                name="priceCurrency"
                                value={editFormData.priceCurrency}
                                onChange={handleEditInputChange}
                                disabled={submitting}
                                className="w-full h-[32px] rounded-[6px] border border-[#1e1e1e] bg-[#0c0c0c] px-3 text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-[#333333]"
                              >
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="JPY">JPY</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-1 pb-1">
                            <Label className="text-[11px] text-[#555555]">Replace Images (Optional)</Label>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleEditFileChange}
                              disabled={submitting}
                              className="w-full text-[11px] text-[#555555] file:mr-2 file:py-1 file:px-2.5 file:rounded-[4px] file:border file:border-[#222222] file:bg-[#111111] file:text-white file:cursor-pointer"
                            />
                            {editFiles.length > 0 && (
                              <p className="text-[9px] text-[#888888] pt-1">{editFiles.length} file(s) selected</p>
                            )}
                          </div>
                          <div className="flex gap-2 pt-2 border-t border-[#1a1a1a]">
                            <Button
                              type="submit"
                              disabled={submitting}
                              className="h-[28px] text-[11px] px-3 bg-white text-[#111111] hover:bg-[#e0e0e0] flex-1"
                            >
                              {submitting ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                              type="button"
                              onClick={cancelEdit}
                              disabled={submitting}
                              className="h-[28px] text-[11px] px-3 bg-transparent border border-[#222222] text-[#888888] hover:text-white flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        /* Standard View Mode */
                        <div className="flex flex-col justify-between h-full flex-1">
                          <div className="space-y-2">
                            <h3 className="text-[15px] font-normal text-white truncate tracking-tight">{product.title}</h3>
                            <p className="text-[12px] text-[#555555] line-clamp-2 leading-relaxed font-light">{product.description}</p>
                          </div>

                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#161616]">
                            <span className="text-[11px] font-['DM_Mono'] text-[#444444]">
                              Updated {new Date(product.updatedAt).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => startEdit(product)}
                                className="h-7 w-7 rounded-[4px] border border-[#1e1e1e] bg-[#0c0c0c] hover:border-[#333] hover:text-white transition-colors flex items-center justify-center text-[#555555] cursor-pointer focus:outline-none"
                                title="Edit Item"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="h-7 w-7 rounded-[4px] border border-[#1e1e1e] bg-[#0c0c0c] hover:border-red-900/50 hover:text-red-400 transition-colors flex items-center justify-center text-[#555555] cursor-pointer focus:outline-none"
                                title="Delete Item"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Register Product Form */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-[20px] font-light text-white tracking-tight">List New Product</h2>
            <p className="text-[12px] text-[#555555]">Add a new entry to the snitch. collection.</p>
          </div>

          <Card className="bg-[#0c0c0c] border-[#1e1e1e] p-6 sticky top-24">
            <CardContent className="p-0">
              <form onSubmit={handleCreateSubmit} className="space-y-5">
                
                {/* Product Title */}
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-[11px] uppercase tracking-wider text-[#555555] font-semibold">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Minimalist Raw T-Shirt"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-[11px] uppercase tracking-wider text-[#555555] font-semibold">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Precision-cut silhouette from 240GSM combed cotton..."
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={submitting}
                    rows={4}
                    className="w-full rounded-[6px] border border-[#1e1e1e] bg-[#0c0c0c] px-3 py-2 text-[13px] text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#333333] placeholder:text-[#3a3a3a] transition-all"
                  />
                </div>

                {/* Price and Currency */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <Label htmlFor="priceAmount" className="text-[11px] uppercase tracking-wider text-[#555555] font-semibold">Amount</Label>
                    <Input
                      id="priceAmount"
                      name="priceAmount"
                      type="number"
                      placeholder="1499"
                      required
                      value={formData.priceAmount}
                      onChange={handleInputChange}
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="priceCurrency" className="text-[11px] uppercase tracking-wider text-[#555555] font-semibold">Currency</Label>
                    <select
                      id="priceCurrency"
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full h-[36px] rounded-[6px] border border-[#1e1e1e] bg-[#0c0c0c] px-3 text-[13px] text-white focus:outline-none focus:ring-1 focus:ring-[#333333]"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="JPY">JPY</option>
                    </select>
                  </div>
                </div>

                {/* Image Files Upload */}
                <div className="space-y-2">
                  <Label htmlFor="product-images" className="text-[11px] uppercase tracking-wider text-[#555555] font-semibold flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" /> Product Images
                  </Label>
                  
                  <div className="border border-[#1e1e1e] rounded-[6px] p-4 bg-[#080808] text-center hover:border-[#2e2e2e] transition-colors relative cursor-pointer">
                    <input
                      id="product-images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={submitting}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-1.5 pointer-events-none">
                      <Plus className="h-4 w-4 mx-auto text-[#444444]" />
                      <p className="text-[11px] text-[#666666]">Click or drag images to select</p>
                      <p className="text-[9px] text-[#444444]">Accepts PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  </div>

                  {/* Selected files listing */}
                  {files.length > 0 && (
                    <div className="border border-[#1c1c1c] rounded-[6px] p-2 bg-[#0c0c0c] space-y-1 max-h-[120px] overflow-y-auto">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[10px] text-[#888888] px-2 py-1 bg-[#111] rounded-[3px]">
                          <span className="truncate max-w-[200px]">{file.name}</span>
                          <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Publishing...
                    </span>
                  ) : (
                    'Publish Product'
                  )}
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
}
