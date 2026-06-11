import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/hook/useAuth";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  getProductDetails,
  updateProduct,
  addProductVariant,
  updateProductVariant,
  deleteProductVariant
} from "../service/product.api";
import {
  ArrowLeft,
  Loader2,
  Package,
  Plus,
  Trash2,
  Save,
  Image as ImageIcon
} from "lucide-react";

export default function SellerProductDetails() {
  const { productId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Main Details State
  const [editingMain, setEditingMain] = useState(false);
  const [mainFormData, setMainFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [mainFiles, setMainFiles] = useState([]);

  // Variant Add State
  const [addingVariant, setAddingVariant] = useState(false);
  const [variantFormData, setVariantFormData] = useState({
    size: "",
    color: "",
    stock: "0",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [variantFiles, setVariantFiles] = useState([]);

  // Variant Edit State
  const [editingVariantId, setEditingVariantId] = useState(null);
  const [editVariantData, setEditVariantData] = useState({});
  const [editVariantFiles, setEditVariantFiles] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "seller") {
      navigate("/");
      return;
    }
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, user]);

  async function fetchProduct() {
    setLoading(true);
    try {
      const data = await getProductDetails(productId);
      if (data.seller?._id !== user._id && data.seller !== user._id) {
        navigate("/seller/dashboard");
        return;
      }
      setProduct(data);
      setMainFormData({
        title: data.title,
        description: data.description,
        priceAmount: data.price?.amount || "",
        priceCurrency: data.price?.currency || "INR",
      });
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load product details");
    } finally {
      setLoading(false);
    }
  }

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 3000);
  };

  // --- Main Product Handlers ---
  const handleMainUpdate = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("title", mainFormData.title);
      fd.append("description", mainFormData.description);
      fd.append("priceAmount", mainFormData.priceAmount);
      fd.append("priceCurrency", mainFormData.priceCurrency);
      mainFiles.forEach(f => fd.append("images", f));

      await updateProduct(productId, fd);
      showSuccess("Product details updated successfully");
      setEditingMain(false);
      fetchProduct();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update product");
    }
  };

  // --- Variant Add Handlers ---
  const handleAddVariant = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("size", variantFormData.size);
      fd.append("color", variantFormData.color);
      fd.append("stock", variantFormData.stock);
      if (variantFormData.priceAmount) fd.append("priceAmount", variantFormData.priceAmount);
      fd.append("priceCurrency", variantFormData.priceCurrency);
      variantFiles.forEach(f => fd.append("images", f));

      await addProductVariant(productId, fd);
      showSuccess("Variant added successfully");
      setAddingVariant(false);
      setVariantFormData({ size: "", color: "", stock: "0", priceAmount: "", priceCurrency: "INR" });
      setVariantFiles([]);
      fetchProduct();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to add variant");
    }
  };

  // --- Variant Edit/Delete Handlers ---
  const startEditVariant = (variant) => {
    setEditingVariantId(variant._id);
    setEditVariantData({
      size: variant.size || "",
      color: variant.color || "",
      stock: variant.stock?.toString() || "0",
      priceAmount: variant.price?.amount || "",
      priceCurrency: variant.price?.currency || "INR",
    });
    setEditVariantFiles([]);
  };

  const handleUpdateVariant = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("size", editVariantData.size);
      fd.append("color", editVariantData.color);
      fd.append("stock", editVariantData.stock);
      if (editVariantData.priceAmount) fd.append("priceAmount", editVariantData.priceAmount);
      fd.append("priceCurrency", editVariantData.priceCurrency);
      editVariantFiles.forEach(f => fd.append("images", f));

      await updateProductVariant(productId, editingVariantId, fd);
      showSuccess("Variant updated successfully");
      setEditingVariantId(null);
      fetchProduct();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update variant");
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm("Are you sure you want to delete this variant?")) return;
    try {
      await deleteProductVariant(productId, variantId);
      showSuccess("Variant deleted successfully");
      fetchProduct();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete variant");
    }
  };

  const handleQuickStockUpdate = async (variantId, currentVariant, newStock) => {
    if (newStock < 0) return;
    try {
      const fd = new FormData();
      fd.append("size", currentVariant.size || "");
      fd.append("color", currentVariant.color || "");
      fd.append("stock", newStock.toString());
      if (currentVariant.price?.amount) {
        fd.append("priceAmount", currentVariant.price.amount.toString());
      }
      fd.append("priceCurrency", currentVariant.price?.currency || "INR");

      await updateProductVariant(productId, variantId, fd);
      showSuccess("Stock updated successfully");
      fetchProduct();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update stock");
    }
  };

  const handleToggleAvailability = async (variantId, currentVariant) => {
    const newStock = currentVariant.stock > 0 ? 0 : 10;
    await handleQuickStockUpdate(variantId, currentVariant, newStock);
  };

  if (loading) {
    return (
      <div className="h-screen bg-bento-bg flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-bento-text-muted" />
        <p className="text-bento-text mt-4">Loading details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen bg-bento-bg flex flex-col items-center justify-center">
        <p className="text-bento-text">Product not found.</p>
        <Link to="/seller/dashboard" className="text-bento-text-faint hover:underline mt-2">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bento-bg text-bento-text flex flex-col font-['Noto_Sans'] antialiased">
      {/* Header */}
      <header className="border-b border-bento-border bg-bento-card/80 backdrop-blur-md sticky top-0 z-50 shadow-bento">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/seller/dashboard" className="text-[12px] text-bento-text-faint hover:text-bento-text transition-colors flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <span className="text-bento-text-muted">/</span>
            <span className="text-[14px] font-medium tracking-tight text-bento-text truncate max-w-[200px] md:max-w-md">
              {product.title}
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 w-full space-y-6">
        {/* Messages */}
        {successMsg && (
          <div className="text-[13px] text-bento-text bg-bento-card-sunken/40 border border-bento-border-light p-4 rounded-[8px] shadow-bento-sunken">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="text-[13px] text-[#ffb4ab] bg-[#93000a]/5 border border-[#93000a]/20 p-4 rounded-[8px] shadow-bento-sunken">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details Panel */}
          <div className="lg:col-span-1 bg-bento-card border border-bento-border p-6 rounded-[12px] shadow-bento space-y-6 self-start">
            <div className="flex items-center justify-between border-b border-bento-border pb-4">
              <h2 className="text-[16px] font-semibold text-bento-text">Main Details</h2>
              <Button variant="outline" size="sm" onClick={() => setEditingMain(!editingMain)} className="h-7 text-[10px]">
                {editingMain ? "Cancel" : "Edit"}
              </Button>
            </div>

            {editingMain ? (
              <form onSubmit={handleMainUpdate} className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-[10px] text-bento-text-muted uppercase">Title</Label>
                  <Input 
                    value={mainFormData.title} 
                    onChange={e => setMainFormData({...mainFormData, title: e.target.value})} 
                    className="h-8 text-[12px] bg-bento-card-sunken"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-bento-text-muted uppercase">Description</Label>
                  <textarea 
                    value={mainFormData.description} 
                    onChange={e => setMainFormData({...mainFormData, description: e.target.value})} 
                    className="w-full min-h-[80px] p-2 rounded-[6px] border border-bento-border bg-bento-card-sunken text-bento-text text-[12px] outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-bento-text-muted uppercase">Price</Label>
                    <Input 
                      type="number"
                      value={mainFormData.priceAmount} 
                      onChange={e => setMainFormData({...mainFormData, priceAmount: e.target.value})} 
                      className="h-8 text-[12px] bg-bento-card-sunken"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-bento-text-muted uppercase">Currency</Label>
                    <Input 
                      value={mainFormData.priceCurrency} 
                      onChange={e => setMainFormData({...mainFormData, priceCurrency: e.target.value})} 
                      className="h-8 text-[12px] bg-bento-card-sunken"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-bento-text-muted uppercase">Replace Images</Label>
                  <Input 
                    type="file" multiple accept="image/*"
                    onChange={e => setMainFiles(Array.from(e.target.files))} 
                    className="text-[11px]"
                  />
                </div>
                <Button type="submit" className="w-full h-8 text-[11px]">Save Changes</Button>
              </form>
            ) : (
              <div className="space-y-4">
                {product.images?.[0] && (
                  <div className="aspect-[4/3] rounded-[8px] overflow-hidden bg-bento-card-sunken border border-bento-border shadow-bento-sunken">
                    <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h3 className="text-[18px] font-medium text-bento-text mb-1">{product.title}</h3>
                  <p className="text-[14px] font-['DM_Mono'] text-bento-text-muted">
                    {product.price?.currency || "INR"} {product.price?.amount}
                  </p>
                </div>
                <p className="text-[12px] text-bento-text-faint font-light leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* Variants Management Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header / Add Button */}
            <div className="bg-bento-card border border-bento-border p-6 rounded-[12px] shadow-bento flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-medium text-bento-text">Product Variants</h2>
                <p className="text-[12px] text-bento-text-muted">Manage sizes, colors, and stock inventory.</p>
              </div>
              <Button onClick={() => setAddingVariant(!addingVariant)} className="gap-2">
                {addingVariant ? "Cancel" : <><Plus className="h-4 w-4"/> Add Variant</>}
              </Button>
            </div>

            {/* Add Variant Form */}
            {addingVariant && (
              <div className="bg-bento-card-sunken border border-bento-border-light p-6 rounded-[12px] shadow-bento-sunken animate-in fade-in slide-in-from-top-4">
                <form onSubmit={handleAddVariant} className="space-y-4">
                  <h3 className="text-[14px] font-medium text-bento-text mb-4 border-b border-bento-border pb-2">New Variant Profile</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-bento-text-muted uppercase">Size</Label>
                      <Input value={variantFormData.size} onChange={e => setVariantFormData({...variantFormData, size: e.target.value})} className="h-8 text-[12px] bg-bento-card" placeholder="e.g. M, L, XL" required />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-bento-text-muted uppercase">Color</Label>
                      <Input value={variantFormData.color} onChange={e => setVariantFormData({...variantFormData, color: e.target.value})} className="h-8 text-[12px] bg-bento-card" placeholder="e.g. Matte Black" required />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-bento-text-muted uppercase">Stock</Label>
                      <Input type="number" value={variantFormData.stock} onChange={e => setVariantFormData({...variantFormData, stock: e.target.value})} className="h-8 text-[12px] bg-bento-card" required />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-bento-text-muted uppercase">Price Override</Label>
                      <Input type="number" value={variantFormData.priceAmount} onChange={e => setVariantFormData({...variantFormData, priceAmount: e.target.value})} className="h-8 text-[12px] bg-bento-card" placeholder="Optional" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-bento-text-muted uppercase">Variant Images</Label>
                    <Input type="file" multiple accept="image/*" onChange={e => setVariantFiles(Array.from(e.target.files))} className="text-[11px] bg-bento-card" />
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Button type="submit" className="h-8 px-6 text-[11px]">Save Variant</Button>
                  </div>
                </form>
              </div>
            )}

            {/* Existing Variants List */}
            <div className="space-y-4">
              {!product.variants || product.variants.length === 0 ? (
                <div className="bg-bento-card border border-bento-border border-dashed p-10 rounded-[12px] text-center flex flex-col items-center">
                  <Package className="h-8 w-8 text-bento-text-muted mb-2" />
                  <p className="text-[13px] text-bento-text-faint">No variants found.</p>
                </div>
              ) : (
                product.variants.map((v) => (
                  <div key={v._id} className="bg-bento-card border border-bento-border rounded-[10px] p-5 shadow-bento transition-all hover:border-bento-border-light group">
                    {editingVariantId === v._id ? (
                      <form onSubmit={handleUpdateVariant} className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <Label className="text-[9px] uppercase text-bento-text-muted">Size</Label>
                            <Input value={editVariantData.size} onChange={e => setEditVariantData({...editVariantData, size: e.target.value})} className="h-7 text-[11px] bg-bento-card-sunken" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[9px] uppercase text-bento-text-muted">Color</Label>
                            <Input value={editVariantData.color} onChange={e => setEditVariantData({...editVariantData, color: e.target.value})} className="h-7 text-[11px] bg-bento-card-sunken" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[9px] uppercase text-bento-text-muted">Stock</Label>
                            <Input type="number" value={editVariantData.stock} onChange={e => setEditVariantData({...editVariantData, stock: e.target.value})} className="h-7 text-[11px] bg-bento-card-sunken" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[9px] uppercase text-bento-text-muted">Price</Label>
                            <Input type="number" value={editVariantData.priceAmount} onChange={e => setEditVariantData({...editVariantData, priceAmount: e.target.value})} className="h-7 text-[11px] bg-bento-card-sunken" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-bento-border">
                          <Input type="file" multiple accept="image/*" onChange={e => setEditVariantFiles(Array.from(e.target.files))} className="text-[10px] w-64 bg-bento-card-sunken" />
                          <div className="flex items-center gap-2">
                            <Button type="button" variant="ghost" onClick={() => setEditingVariantId(null)} className="h-7 text-[10px]">Cancel</Button>
                            <Button type="submit" className="h-7 text-[10px] gap-1"><Save className="h-3 w-3"/> Save</Button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-bento-card-sunken border border-bento-border rounded-[6px] shadow-bento-sunken overflow-hidden flex items-center justify-center shrink-0">
                            {v.images?.[0] ? (
                              <img src={v.images[0].url} alt={v.size} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-bento-text-muted" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[14px] font-semibold text-bento-text">{v.color}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-bento-card-sunken border border-bento-border-light text-bento-text font-['DM_Mono']">
                                {v.size}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] font-['DM_Mono'] text-bento-text-muted mt-1.5">
                              {/* Stock Increment/Decrement */}
                              <div className="flex items-center gap-1.5 bg-bento-card-sunken border border-bento-border-light p-0.5 rounded-[6px] shadow-bento-sunken">
                                <span className="text-[8px] text-bento-text-faint px-1">STOCK</span>
                                <button
                                  type="button"
                                  onClick={() => handleQuickStockUpdate(v._id, v, v.stock - 1)}
                                  disabled={v.stock <= 0}
                                  className="h-5 w-5 rounded-[4px] bg-bento-card border border-bento-border hover:bg-bento-card-hover shadow-bento-btn active:translate-y-[1px] active:shadow-bento-btn-active disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-bento-text-muted cursor-pointer transition-all"
                                >
                                  -
                                </button>
                                <span className={`text-[10px] font-bold px-1 min-w-[16px] text-center ${v.stock > 0 ? "text-bento-text" : "text-[#ffb4ab]"}`}>
                                  {v.stock}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleQuickStockUpdate(v._id, v, v.stock + 1)}
                                  className="h-5 w-5 rounded-[4px] bg-bento-card border border-bento-border hover:bg-bento-card-hover shadow-bento-btn active:translate-y-[1px] active:shadow-bento-btn-active flex items-center justify-center text-bento-text-muted cursor-pointer transition-all"
                                >
                                  +
                                </button>
                              </div>

                              {/* Availability Status Button */}
                              <div className="flex items-center gap-1 bg-bento-card-sunken border border-bento-border-light p-0.5 rounded-[6px] shadow-bento-sunken">
                                <span className="text-[8px] text-bento-text-faint px-1">STATUS</span>
                                <button
                                  type="button"
                                  onClick={() => handleToggleAvailability(v._id, v)}
                                  className={`text-[8px] px-1.5 py-0.5 rounded-[4px] border font-bold font-sans transition-all cursor-pointer ${
                                    v.stock > 0
                                      ? "bg-zinc-800 dark:bg-zinc-200 text-bento-bg border-transparent shadow-bento-btn shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)]"
                                      : "bg-transparent text-[#ffb4ab] border-transparent hover:text-red-400"
                                  }`}
                                >
                                  {v.stock > 0 ? "AVAILABLE" : "OUT OF STOCK"}
                                </button>
                              </div>

                              {v.price?.amount && (
                                <span className="ml-1">{v.price.currency} {v.price.amount}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="outline" size="sm" onClick={() => startEditVariant(v)} className="h-7 text-[10px]">Edit</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteVariant(v._id)} className="h-7 w-7 p-0 bg-[#93000a]/20 text-[#ffb4ab] border border-[#93000a]/30 hover:bg-[#93000a]/40">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
