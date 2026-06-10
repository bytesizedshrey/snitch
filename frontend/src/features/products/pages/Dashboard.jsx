import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/hook/useAuth';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { getAllProducts, deleteProduct, updateProduct } from '../service/product.api';
import { Plus, Trash2, Edit2, LogOut, ArrowLeft, Image as ImageIcon, Loader2, Package, Tag, Coins, X, Calendar, User, Eye } from 'lucide-react';

export default function Dashboard() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
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
    <div className="min-h-screen bg-[#060606] text-white flex flex-col font-['Noto_Sans'] antialiased">
      {/* Header */}
      <header className="border-b border-[#141414] bg-[#0c0c0c]/80 backdrop-blur-md sticky top-0 z-50 shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-[12px] text-[#888888] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>
            <span className="text-[#333]">/</span>
            <span className="text-[14px] font-medium tracking-tight text-white select-none">snitch. console</span>
            <span className="font-['DM_Mono'] text-[9px] uppercase tracking-widest text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded-[4px] bg-emerald-500/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              Seller Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogoutClick}
              className="text-[12px] text-[#888888] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer focus:outline-none bg-gradient-to-b from-[#161616] to-[#0d0d0d] px-3 py-1.5 border border-[#222] rounded-[4px] shadow-[2px_2px_5px_rgba(0,0,0,0.4)] active:translate-y-[1px] active:shadow-none"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Bento Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full space-y-6">
        
        {/* Success / Error Messages (skeuomorphic notification) */}
        {successMsg && (
          <div className="text-[13px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-[8px] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5)] transition-all">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="text-[13px] text-[#ffb4ab] bg-[#93000a]/5 border border-[#93000a]/20 p-4 rounded-[8px] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5)] transition-all">
            {errorMsg}
          </div>
        )}

        {/* Bento Grid Top Section: 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Box 1: Seller Profile Card */}
          <div className="bg-[#0c0c0c] border border-[#1b1b1b] p-6 rounded-[12px] shadow-[8px_8px_24px_rgba(0,0,0,0.85),-6px_-6px_24px_rgba(255,255,255,0.012)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#666] font-semibold">
                <User className="h-3.5 w-3.5" /> Account Details
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[#070707] border border-[#181818] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),inset_-1px_-1px_3px_rgba(255,255,255,0.01)] flex items-center justify-center text-white text-[16px] font-medium select-none">
                  {user?.fullname?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-[15px] font-normal text-white">{user?.fullname}</h3>
                  <p className="text-[11px] text-[#555] font-['DM_Mono']">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Inventory Statistics Card */}
          <div className="bg-[#0c0c0c] border border-[#1b1b1b] p-6 rounded-[12px] shadow-[8px_8px_24px_rgba(0,0,0,0.85),-6px_-6px_24px_rgba(255,255,255,0.012)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#666] font-semibold">
                <span className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> Metrics</span>
                <span className="text-emerald-500 font-['DM_Mono'] tracking-normal text-[8px] bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">Active</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Total Items (Sunken panel) */}
                <div className="bg-[#070707] border border-[#181818] p-3 rounded-[6px] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),inset_-1px_-1px_3px_rgba(255,255,255,0.01)] text-center">
                  <span className="text-[9px] uppercase tracking-wider text-[#444] font-semibold select-none block mb-1">Total Items</span>
                  <span className="text-[20px] font-light text-white font-['DM_Mono']">{products.length}</span>
                </div>

                {/* Last update */}
                <div className="bg-[#070707] border border-[#181818] p-3 rounded-[6px] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),inset_-1px_-1px_3px_rgba(255,255,255,0.01)] text-center flex flex-col justify-center">
                  <span className="text-[9px] uppercase tracking-wider text-[#444] font-semibold select-none block mb-1">Status</span>
                  <span className="text-[12px] font-normal text-white flex items-center justify-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-[#555]" /> Live
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Box 3: Publisher Card (Raised skeuomorphic CTA) */}
          <div className="bg-[#0c0c0c] border border-[#1b1b1b] p-6 rounded-[12px] shadow-[8px_8px_24px_rgba(0,0,0,0.85),-6px_-6px_24px_rgba(255,255,255,0.012)] relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#666] font-semibold">Quick Actions</span>
              <Plus className="h-4 w-4 text-[#444]" />
            </div>

            <p className="text-[12px] text-[#666] leading-relaxed font-light mt-1">
              Add a new collection piece with up to 7 images and customized pricing.
            </p>

            <Link to="/create-product" className="w-full mt-3 block">
              <Button className="w-full h-10 bg-white text-black hover:bg-[#e0e0e0] shadow-[3px_3px_8px_rgba(0,0,0,0.5)] font-semibold active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[12px]">
                <Plus className="h-4 w-4" /> Add New Product
              </Button>
            </Link>
          </div>

        </div>

        {/* Bento Grid Bottom Section: Large Catalog Container (spans full width) */}
        <div className="bg-[#0c0c0c] border border-[#1b1b1b] p-8 rounded-[12px] shadow-[8px_8px_24px_rgba(0,0,0,0.85),-4px_-4px_16px_rgba(255,255,255,0.012)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[18px] font-light text-white tracking-tight">Product Catalog</h2>
              <p className="text-[12px] text-[#555] font-light">Inspect, modify, and manage your inventory listings.</p>
            </div>
            <span className="text-[10px] font-['DM_Mono'] text-[#444] border border-[#181818] px-2 py-1 rounded-[4px] bg-[#070707] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]">
              Items: {products.length}
            </span>
          </div>

          {/* Catalog Listings */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 text-[#444] animate-spin" />
              <span className="text-[12px] text-[#555] tracking-wide">Syncing catalog...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="border border-[#181818] border-dashed rounded-[8px] p-20 text-center flex flex-col items-center justify-center gap-4 bg-[#070707]/30 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8)]">
              <Package className="h-10 w-10 text-[#2a2a2a]" strokeWidth={1} />
              <div className="space-y-1">
                <p className="text-[13px] text-[#666] font-light">Your inventory is empty</p>
                <p className="text-[11px] text-[#444] font-light">Click the Add New Product button above to register items.</p>
              </div>
            </div>
          ) : (
            /* Bento Sub-grid of products (3 cols on desktop) */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => {
                const isEditing = editingId === product._id;
                return (
                  <Card key={product._id} className="bg-[#0b0b0b] border border-[#181818] hover:border-[#262626] transition-all flex flex-col overflow-hidden rounded-[8px] shadow-[4px_4px_12px_rgba(0,0,0,0.6)]">
                    
                    {/* Image Preview Container (Sunken visual frame) */}
                    <div className="h-[150px] bg-[#070707] relative overflow-hidden flex items-center justify-center border-b border-[#141414] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8)]">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.title}
                          className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-[#333]">
                          <ImageIcon className="h-7 w-7" />
                          <span className="text-[9px] uppercase tracking-wider font-['DM_Mono'] text-[#444]">No Image</span>
                        </div>
                      )}
                      
                      {/* Floating tactile badge */}
                      <div className="absolute top-3 right-3 bg-black/75 border border-[#1d1d1d] px-2 py-0.5 rounded-[4px] shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
                        <span className="text-[10px] font-['DM_Mono'] text-white">
                          {product.price?.currency || 'INR'} {product.price?.amount}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col justify-between">
                      {isEditing ? (
                        /* Edit Form (Inset sunken form panels) */
                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                          <div className="space-y-1">
                            <Label htmlFor={`edit-title-${product._id}`} className="text-[10px] text-[#555] uppercase tracking-wider">Title</Label>
                            <Input
                              id={`edit-title-${product._id}`}
                              name="title"
                              value={editFormData.title}
                              onChange={handleEditInputChange}
                              disabled={submitting}
                              className="h-[34px] text-[12px] bg-[#070707] border-[#161616] text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8)] focus:border-[#333]"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor={`edit-desc-${product._id}`} className="text-[10px] text-[#555] uppercase tracking-wider">Description</Label>
                            <textarea
                              id={`edit-desc-${product._id}`}
                              name="description"
                              value={editFormData.description}
                              onChange={handleEditInputChange}
                              disabled={submitting}
                              rows={2.5}
                              className="w-full rounded-[6px] border border-[#161616] bg-[#070707] px-3 py-2 text-[12px] text-white focus:border-[#333] focus:outline-none placeholder:text-[#3a3a3a] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8)]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label htmlFor={`edit-price-${product._id}`} className="text-[10px] text-[#555] uppercase tracking-wider">Price</Label>
                              <Input
                                id={`edit-price-${product._id}`}
                                name="priceAmount"
                                type="number"
                                value={editFormData.priceAmount}
                                onChange={handleEditInputChange}
                                disabled={submitting}
                                className="h-[34px] text-[12px] bg-[#070707] border-[#161616] text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8)] focus:border-[#333]"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`edit-currency-${product._id}`} className="text-[10px] text-[#555] uppercase tracking-wider">Currency</Label>
                              <select
                                id={`edit-currency-${product._id}`}
                                name="priceCurrency"
                                value={editFormData.priceCurrency}
                                onChange={handleEditInputChange}
                                disabled={submitting}
                                className="w-full h-[34px] rounded-[6px] border border-[#161616] bg-[#070707] px-3 text-[12px] text-white focus:border-[#333] focus:outline-none shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8)] appearance-none cursor-pointer"
                              >
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="JPY">JPY</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1.5 pb-1">
                            <Label className="text-[10px] text-[#555] uppercase tracking-wider">Replace Images</Label>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleEditFileChange}
                              disabled={submitting}
                              className="w-full text-[10px] text-[#555] file:mr-2 file:py-1 file:px-2 file:rounded-[4px] file:border file:border-[#222] file:bg-[#111] file:text-white file:cursor-pointer"
                            />
                            {editFiles.length > 0 && (
                              <p className="text-[9px] text-[#888] pt-1">{editFiles.length} file(s) selected</p>
                            )}
                          </div>

                          {/* Tactile push action triggers */}
                          <div className="flex gap-2 pt-2 border-t border-[#141414]">
                            <Button
                              type="submit"
                              disabled={submitting}
                              className="h-[30px] text-[11px] px-3 bg-white text-black hover:bg-[#e0e0e0] shadow-[2px_2px_5px_rgba(0,0,0,0.4)] active:translate-y-[1px] active:shadow-none flex-1 font-semibold cursor-pointer"
                            >
                              {submitting ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                              type="button"
                              onClick={cancelEdit}
                              disabled={submitting}
                              className="h-[30px] text-[11px] px-3 bg-gradient-to-b from-[#1b1b1b] to-[#0f0f0f] border border-[#222] text-[#888] hover:text-white shadow-[2px_2px_5px_rgba(0,0,0,0.4)] active:translate-y-[1px] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7)] flex-1 cursor-pointer"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        /* Standard View Card Details */
                        <div className="flex flex-col justify-between h-full flex-1">
                          <div className="space-y-2">
                            <h3 className="text-[15px] font-normal text-white truncate tracking-tight">{product.title}</h3>
                            <p className="text-[12px] text-[#666] line-clamp-2 leading-relaxed font-light">{product.description}</p>
                          </div>

                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#141414]">
                            <span className="text-[10px] font-['DM_Mono'] text-[#444]">
                              Updated {new Date(product.updatedAt).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {/* Edit Tactile button */}
                              <button
                                onClick={() => startEdit(product)}
                                className="h-7 w-7 rounded-[4px] border border-[#1b1b1b] bg-gradient-to-b from-[#1b1b1b] to-[#0f0f0f] shadow-[2px_2px_5px_rgba(0,0,0,0.5)] hover:border-[#333] hover:text-white active:translate-y-[1px] active:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.7)] transition-all flex items-center justify-center text-[#555] cursor-pointer focus:outline-none"
                                title="Edit Item"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              
                              {/* Delete Tactile button */}
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="h-7 w-7 rounded-[4px] border border-[#1b1b1b] bg-gradient-to-b from-[#1b1b1b] to-[#0f0f0f] shadow-[2px_2px_5px_rgba(0,0,0,0.5)] hover:border-red-900/50 hover:text-red-400 active:translate-y-[1px] active:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.7)] transition-all flex items-center justify-center text-[#555] cursor-pointer focus:outline-none"
                                title="Delete Item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
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

      </main>
    </div>
  );
}
