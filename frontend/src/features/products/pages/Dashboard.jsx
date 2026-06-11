import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hook/useAuth";
import { useProduct } from "../hook/useProduct";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  deleteProduct,
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
  Calendar,
  User,
} from "lucide-react";

export default function Dashboard() {
  const { user, handleLogout } = useAuth();
  const { handleGetSellerProduct } = useProduct();
  const navigate = useNavigate();
  
  const products = useSelector((state) => state.product.sellerProducts) || [];
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      await handleGetSellerProduct();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [handleGetSellerProduct]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "seller") {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => {
      fetchProducts();
    }, 0);
    return () => clearTimeout(timer);
  }, [user, navigate, fetchProducts]);

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

  return (
    <div className="h-screen overflow-hidden bg-bento-bg text-bento-text flex flex-col font-['Noto_Sans'] antialiased">
      {/* Header */}
      <header className="border-b border-bento-border bg-bento-card/80 backdrop-blur-md z-50 shadow-bento shrink-0">
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
            <span className="font-['DM_Mono'] text-[9px] uppercase tracking-widest text-bento-text-muted border border-bento-border-light px-1.5 py-0.5 rounded-[4px] bg-bento-card-sunken shadow-bento-btn">
              Seller Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={handleLogoutClick}
              className="text-[12px] text-bento-text flex items-center gap-1.5 cursor-pointer focus:outline-none bg-bento-card hover:bg-bento-card-hover px-3 py-1.5 border border-bento-border-light rounded-[6px] shadow-bento-btn active:translate-y-[1px] active:shadow-bento-btn-active transition-all font-medium"
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
            <div className="text-[13px] text-bento-text bg-bento-card-sunken/40 border border-bento-border-light p-4 rounded-[8px] shadow-bento-btn transition-all">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="text-[13px] text-[#ffb4ab] bg-[#93000a]/5 border border-[#93000a]/20 p-4 rounded-[8px] shadow-bento-btn transition-all">
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
                  <span className="text-bento-text-muted font-['DM_Mono'] tracking-normal text-[8px] bg-bento-card-sunken px-1.5 py-0.5 rounded border border-bento-border-light">
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
                  return (
                    <Card
                      key={product._id}
                      className="bg-bento-card border border-bento-border-light hover:border-[#262626] transition-all flex flex-col overflow-hidden rounded-[8px] shadow-bento group"
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
                        <div className="absolute top-3 right-3 bg-bento-card/80 backdrop-blur-md border border-bento-border-light px-2 py-0.5 rounded-[4px] shadow-bento">
                          <span className="text-[10px] font-['DM_Mono'] text-bento-text">
                            {product.price?.currency || "INR"}{" "}
                            {product.price?.amount}
                          </span>
                        </div>
                      </div>

                      <CardContent className="p-5 flex-1 flex flex-col justify-between">
                        {/* Standard View Card Details */}
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
                              {/* Edit Tactile button (Navigates to detail page) */}
                              <Link
                                to={`/seller/product/${product._id}`}
                                className="h-7 w-7 rounded-[6px] border border-bento-border-light bg-bento-card hover:bg-bento-card-hover shadow-bento-btn text-bento-text active:translate-y-[1px] active:shadow-bento-btn-active transition-all flex items-center justify-center cursor-pointer focus:outline-none"
                                title="Manage Details & Variants"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Link>

                              {/* Delete Tactile button */}
                                <button
                                  onClick={() => handleDelete(product._id)}
                                  className="h-7 w-7 rounded-[6px] border border-bento-border-light bg-bento-card hover:bg-bento-card-hover shadow-bento-btn text-red-400 hover:text-red-300 active:translate-y-[1px] active:shadow-bento-btn-active transition-all flex items-center justify-center cursor-pointer focus:outline-none"
                                  title="Delete Item"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
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
