import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hook/useAuth";
import { useProduct } from "../hook/useProduct";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import {
  deleteProduct,
  updateProduct,
} from "../service/product.api";
import {
  Plus,
  Trash2,
  Edit2,
  LogOut,
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Package,
  Tag,
  Coins,
  X,
  Calendar,
  User,
  Eye,
} from "lucide-react";

export default function Dashboard() {
  const { user, handleLogout } = useAuth();
  const { handleGetSellerProduct } = useProduct();
  const navigate = useNavigate();
  
  const products = useSelector((state) => state.product.sellerProducts) || [];
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [editFiles, setEditFiles] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "seller") {
      navigate("/");
      return;
    }
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      await handleGetSellerProduct();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleEditFileChange = (e) => {
    setEditFiles(Array.from(e.target.files));
  };

  const handleLogoutClick = async () => {
    const res = await handleLogout();
    if (res.success) {
      navigate("/login");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await deleteProduct(id);
      setSuccessMsg("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to delete product");
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditFormData({
      title: product.title,
      description: product.description,
      priceAmount: product.price?.amount || "",
      priceCurrency: product.price?.currency || "INR",
    });
    setEditFiles([]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFiles([]);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      const uploadData = new FormData();
      uploadData.append("title", editFormData.title);
      uploadData.append("description", editFormData.description);
      uploadData.append("priceAmount", editFormData.priceAmount);
      uploadData.append("priceCurrency", editFormData.priceCurrency);

      editFiles.forEach((file) => {
        uploadData.append("images", file);
      });

      await updateProduct(editingId, uploadData);
      setSuccessMsg("Product updated successfully");
      setEditingId(null);
      setEditFiles([]);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-bento-bg text-bento-text flex flex-col font-['Noto_Sans'] antialiased">
      {/* Header */}
      <header className="border-b border-bento-border bg-bento-card/80 backdrop-blur-md z-50 shadow-[0_2px_15px_rgba(0,0,0,0.6)] shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-[12px] text-bento-text-faint hover:text-bento-text transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>
            <span className="text-bento-text-muted">/</span>
            <span className="text-[14px] font-medium tracking-tight text-bento-text select-none">
              snitch. console
            </span>
            <span className="font-['DM_Mono'] text-[9px] uppercase tracking-widest text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded-[4px] bg-emerald-500/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              Seller Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={handleLogoutClick}
              className="text-[12px] text-bento-text flex items-center gap-1.5 cursor-pointer focus:outline-none bg-bento-card hover:bg-[#252525] px-3 py-1.5 border border-bento-border-light rounded-[6px] shadow-[3px_3px_8px_rgba(0,0,0,0.8),-1px_-1px_4px_rgba(255,255,255,0.03),inset_1px_1px_2px_rgba(255,255,255,0.1),inset_-1px_-1px_2px_rgba(0,0,0,0.6)] active:translate-y-[1px] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5)] transition-all font-medium"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Main Bento Grid */}
        <main className="max-w-7xl mx-auto px-6 py-10 w-full space-y-6">
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
            <div className="bg-bento-card border border-bento-border p-6 rounded-[12px] shadow-bento relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-bento-border pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-bento-text-muted font-semibold">
                  <User className="h-3.5 w-3.5" /> Account Details
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-bento-card-sunken border border-bento-border-light shadow-bento-sunken flex items-center justify-center text-bento-text text-[16px] font-medium select-none">
                    {user?.fullname?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-normal text-bento-text">
                      {user?.fullname}
                    </h3>
                    <p className="text-[11px] text-bento-text-muted font-['DM_Mono']">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Inventory Statistics Card */}
            <div className="bg-bento-card border border-bento-border p-6 rounded-[12px] shadow-bento relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-bento-border pointer-events-none" />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-bento-text-muted font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5" /> Metrics
                  </span>
                  <span className="text-emerald-500 font-['DM_Mono'] tracking-normal text-[8px] bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Total Items (Sunken panel) */}
                  <div className="bg-bento-card-sunken border border-bento-border-light p-3 rounded-[6px] shadow-bento-sunken text-center">
                    <span className="text-[9px] uppercase tracking-wider text-bento-text-faint font-semibold select-none block mb-1">
                      Total Items
                    </span>
                    <span className="text-[20px] font-light text-bento-text font-['DM_Mono']">
                      {products.length}
                    </span>
                  </div>

                  {/* Last update */}
                  <div className="bg-bento-card-sunken border border-bento-border-light p-3 rounded-[6px] shadow-bento-sunken text-center flex flex-col justify-center">
                    <span className="text-[9px] uppercase tracking-wider text-bento-text-faint font-semibold select-none block mb-1">
                      Status
                    </span>
                    <span className="text-[12px] font-normal text-bento-text flex items-center justify-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-bento-text-muted" /> Live
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 3: Publisher Card (Raised skeuomorphic CTA) */}
            <div className="bg-bento-card border border-bento-border p-6 rounded-[12px] shadow-bento relative overflow-hidden group flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-bento-border pointer-events-none" />

              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-bento-text-muted font-semibold">
                  Quick Actions
                </span>
                <Plus className="h-4 w-4 text-bento-text-faint" />
              </div>

              <p className="text-[12px] text-bento-text-muted leading-relaxed font-light mt-1">
                Add a new collection piece with up to 7 images and customized
                pricing.
              </p>

              <Link to="/seller/create-product" className="w-full mt-3 block">
                <Button className="w-full h-10 gap-1.5 text-[12px]">
                  <Plus className="h-4 w-4" /> Add New Product
                </Button>
              </Link>
            </div>
          </div>

          {/* Bento Grid Bottom Section: Large Catalog Container (spans full width) */}
          <div className="bg-bento-card border border-bento-border p-8 rounded-[12px] shadow-bento relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-bento-border pointer-events-none" />

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[18px] font-light text-bento-text tracking-tight">
                  Product Catalog
                </h2>
                <p className="text-[12px] text-bento-text-muted font-light">
                  Inspect, modify, and manage your inventory listings.
                </p>
              </div>
              <span className="text-[10px] font-['DM_Mono'] text-bento-text-faint border border-bento-border-light px-2 py-1 rounded-[4px] bg-bento-card-sunken shadow-bento-sunken">
                Items: {products.length}
              </span>
            </div>

            {/* Catalog Listings */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 text-bento-text-faint animate-spin" />
                <span className="text-[12px] text-bento-text-muted tracking-wide">
                  Syncing catalog...
                </span>
              </div>
            ) : products.length === 0 ? (
              <div className="border border-bento-border-light border-dashed rounded-[8px] p-20 text-center flex flex-col items-center justify-center gap-4 bg-bento-card-sunken/30 shadow-bento-sunken">
                <Package className="h-10 w-10 text-[#2a2a2a]" strokeWidth={1} />
                <div className="space-y-1">
                  <p className="text-[13px] text-bento-text-muted font-light">
                    Your inventory is empty
                  </p>
                  <p className="text-[11px] text-bento-text-faint font-light">
                    Click the Add New Product button above to register items.
                  </p>
                </div>
              </div>
            ) : (
              /* Bento Sub-grid of products (3 cols on desktop) */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => {
                  const isEditing = editingId === product._id;
                  return (
                    <Card
                      key={product._id}
                      className="bg-[#0b0b0b] border border-bento-border-light hover:border-[#262626] transition-all flex flex-col overflow-hidden rounded-[8px] shadow-[4px_4px_12px_rgba(0,0,0,0.6)] group"
                    >
                      {/* Image Preview Container (Sunken visual frame) */}
                      <div className="aspect-[4/5] bg-bento-card-sunken relative overflow-hidden flex items-center justify-center border-b border-bento-border shadow-bento-sunken">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500 ease-out"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-bento-text-muted">
                            <ImageIcon className="h-7 w-7" />
                            <span className="text-[9px] uppercase tracking-wider font-['DM_Mono'] text-bento-text-faint">
                              No Image
                            </span>
                          </div>
                        )}

                        {/* Floating tactile badge */}
                        <div className="absolute top-3 right-3 bg-black/75 border border-[#1d1d1d] px-2 py-0.5 rounded-[4px] shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
                          <span className="text-[10px] font-['DM_Mono'] text-bento-text">
                            {product.price?.currency || "INR"}{" "}
                            {product.price?.amount}
                          </span>
                        </div>
                      </div>

                      <CardContent className="p-5 flex-1 flex flex-col justify-between">
                        {isEditing ? (
                          /* Edit Form (Inset sunken form panels) */
                          <form
                            onSubmit={handleUpdateSubmit}
                            className="space-y-4"
                          >
                            <div className="space-y-1">
                              <Label
                                htmlFor={`edit-title-${product._id}`}
                                className="text-[10px] text-bento-text-muted uppercase tracking-wider"
                              >
                                Title
                              </Label>
                              <Input
                                id={`edit-title-${product._id}`}
                                name="title"
                                value={editFormData.title}
                                onChange={handleEditInputChange}
                                disabled={submitting}
                                className="h-[34px] text-[12px] bg-bento-card-sunken border-bento-border-light text-bento-text shadow-bento-sunken focus:border-[#333]"
                              />
                            </div>

                            <div className="space-y-1">
                              <Label
                                htmlFor={`edit-desc-${product._id}`}
                                className="text-[10px] text-bento-text-muted uppercase tracking-wider"
                              >
                                Description
                              </Label>
                              <textarea
                                id={`edit-desc-${product._id}`}
                                name="description"
                                value={editFormData.description}
                                onChange={handleEditInputChange}
                                disabled={submitting}
                                rows={2.5}
                                className="w-full rounded-[6px] border border-bento-border-light bg-bento-card-sunken px-3 py-2 text-[12px] text-bento-text focus:border-[#333] focus:outline-none placeholder:text-[#3a3a3a] shadow-bento-sunken"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label
                                  htmlFor={`edit-price-${product._id}`}
                                  className="text-[10px] text-bento-text-muted uppercase tracking-wider"
                                >
                                  Price
                                </Label>
                                <Input
                                  id={`edit-price-${product._id}`}
                                  name="priceAmount"
                                  type="number"
                                  value={editFormData.priceAmount}
                                  onChange={handleEditInputChange}
                                  disabled={submitting}
                                  className="h-[34px] text-[12px] bg-bento-card-sunken border-bento-border-light text-bento-text shadow-bento-sunken focus:border-[#333]"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label
                                  htmlFor={`edit-currency-${product._id}`}
                                  className="text-[10px] text-bento-text-muted uppercase tracking-wider"
                                >
                                  Currency
                                </Label>
                                <select
                                  id={`edit-currency-${product._id}`}
                                  name="priceCurrency"
                                  value={editFormData.priceCurrency}
                                  onChange={handleEditInputChange}
                                  disabled={submitting}
                                  className="w-full h-[34px] rounded-[6px] border border-bento-border-light bg-bento-card-sunken px-3 text-[12px] text-bento-text focus:border-[#333] focus:outline-none shadow-bento-sunken appearance-none cursor-pointer"
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
                              <Label className="text-[10px] text-bento-text-muted uppercase tracking-wider">
                                Replace Images
                              </Label>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleEditFileChange}
                                disabled={submitting}
                                className="w-full text-[10px] text-bento-text-muted file:mr-2 file:py-1 file:px-2 file:rounded-[4px] file:border file:border-bento-border-light file:bg-[#111] file:text-bento-text file:cursor-pointer"
                              />
                              {editFiles.length > 0 && (
                                <p className="text-[9px] text-bento-text-faint pt-1">
                                  {editFiles.length} file(s) selected
                                </p>
                              )}
                            </div>

                            {/* Tactile push action triggers */}
                            <div className="flex gap-2 pt-2 border-t border-bento-border">
                              <Button
                                type="submit"
                                disabled={submitting}
                                className="h-[34px] text-[11px]"
                              >
                                {submitting ? "Saving..." : "Save"}
                              </Button>
                              <Button
                                type="button"
                                onClick={cancelEdit}
                                disabled={submitting}
                                variant="secondary"
                                className="h-[34px] text-[11px]"
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        ) : (
                          /* Standard View Card Details */
                          <div className="flex flex-col justify-between h-full flex-1">
                            <div className="space-y-2">
                              <h3 className="text-[15px] font-normal text-bento-text truncate tracking-tight">
                                {product.title}
                              </h3>
                              <p className="text-[12px] text-bento-text-muted line-clamp-2 leading-relaxed font-light">
                                {product.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-bento-border">
                              <span className="text-[10px] font-['DM_Mono'] text-bento-text-faint">
                                Updated{" "}
                                {new Date(
                                  product.updatedAt,
                                ).toLocaleDateString()}
                              </span>
                              <div className="flex items-center gap-1.5">
                                {/* Edit Tactile button */}
                                <button
                                  onClick={() => startEdit(product)}
                                  className="h-7 w-7 rounded-[6px] border border-bento-border-light bg-bento-card hover:bg-[#252525] shadow-[2px_2px_6px_rgba(0,0,0,0.8),-1px_-1px_3px_rgba(255,255,255,0.03),inset_1px_1px_2px_rgba(255,255,255,0.1),inset_-1px_-1px_2px_rgba(0,0,0,0.6)] text-bento-text active:translate-y-[1px] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)] transition-all flex items-center justify-center cursor-pointer focus:outline-none"
                                  title="Edit Item"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>

                                {/* Delete Tactile button */}
                                <button
                                  onClick={() => handleDelete(product._id)}
                                  className="h-7 w-7 rounded-[6px] border border-bento-border-light bg-bento-card hover:bg-[#252525] shadow-[2px_2px_6px_rgba(0,0,0,0.8),-1px_-1px_3px_rgba(255,255,255,0.03),inset_1px_1px_2px_rgba(255,255,255,0.1),inset_-1px_-1px_2px_rgba(0,0,0,0.6)] text-red-400 hover:text-red-300 active:translate-y-[1px] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)] transition-all flex items-center justify-center cursor-pointer focus:outline-none"
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
    </div>
  );
}
