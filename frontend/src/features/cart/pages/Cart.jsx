import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../../auth/hook/useAuth';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { Button } from '../../../components/ui/button';
import {
  ShoppingBag,
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
  ArrowRight,
  Package,
} from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const { cartData, items, loading, error, loadCart, updateQuantity, removeItem, emptyCart } = useCart();
  const [activePriceChanges, setActivePriceChanges] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    loadCart();
  }, [user, navigate, loadCart]);

  useEffect(() => {
    if (cartData?.priceChanges && cartData.priceChanges.length > 0) {
      setActivePriceChanges(cartData.priceChanges);
    }
  }, [cartData]);

  const subtotalsByCurrency = items.reduce((acc, item) => {
    const currency = item.price?.currency || item.product?.price?.currency || 'INR';
    const amount = parseFloat(item.price?.amount ?? item.product?.price?.amount ?? 0) * item.quantity;
    if (!acc[currency]) {
      acc[currency] = 0;
    }
    acc[currency] += amount;
    return acc;
  }, {});

  const formatSubtotal = () => {
    const entries = Object.entries(subtotalsByCurrency);
    if (entries.length === 0) return 'INR 0.00';
    return entries.map(([currency, amount]) => `${currency} ${amount.toFixed(2)}`).join(' + ');
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const isCheckoutReady = items.every((item) => {
    const variant = item.product?.variants?.find(
      (v) => (v._id || v).toString() === (item.variant?._id || item.variant).toString()
    );
    const stock = variant ? variant.stock : (item.product?.variants?.length ? 0 : 100);
    return stock > 0 && item.quantity <= stock;
  });

  return (
    <>
      {/* Skeuomorphic Price Change Notice Popup */}
      {activePriceChanges.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
          <div className="relative w-full max-w-md bg-[#161618] border border-[#27272a] rounded-[18px] p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden font-['Noto_Sans']">
            
            {/* Top Metallic Bevel Strip */}
            <div className="absolute top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-800 border-b border-zinc-900" />
            
            {/* Warning LED panel */}
            <div className="flex items-center gap-3 mb-5 mt-2">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              </div>
              <h3 className="text-[11px] font-bold tracking-widest text-red-500 font-['DM_Mono'] uppercase">
                Attention: Catalog Price Update
              </h3>
            </div>

            <p className="text-[13px] text-zinc-300 font-light leading-relaxed mb-4">
              Some items in your shopping bag have been updated to reflect the latest store pricing:
            </p>

            {/* Inset Plate displaying price changes */}
            <div className="bg-[#0b0b0c] border border-[#1f1f22] rounded-[12px] p-4 shadow-inner space-y-3 mb-6 max-h-[180px] overflow-y-auto">
              {activePriceChanges.map((change, index) => (
                <div key={index} className="flex flex-col gap-1 border-b border-zinc-900/60 pb-3 last:border-0 last:pb-0">
                  <span className="text-[12px] font-semibold text-zinc-200 truncate block">
                    {change.title}
                  </span>
                  <div className="flex items-center gap-2 font-['DM_Mono'] text-[11px]">
                    <span className="text-red-400/80 line-through">
                      {change.oldPrice.currency} {parseFloat(change.oldPrice.amount).toFixed(2)}
                    </span>
                    <span className="text-zinc-500">→</span>
                    <span className="text-emerald-400 font-bold">
                      {change.newPrice.currency} {parseFloat(change.newPrice.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tactile Accept Button */}
            <button
              onClick={() => setActivePriceChanges([])}
              className="w-full h-11 rounded-[10px] bg-gradient-to-b from-[#2e2e33] to-[#1e1e22] hover:from-[#35353c] hover:to-[#222227] border border-[#3f3f46] text-zinc-100 font-semibold text-[12px] tracking-wider uppercase shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.1)] active:translate-y-[2px] active:shadow-inner active:border-zinc-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              Acknowledge & Sync
            </button>
          </div>
        </div>
      )}

      {/* Page Body */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-0.5">
            <h1 className="text-[28px] font-bold tracking-tight text-bento-text">Shopping Bag</h1>
            <p className="text-[12px] text-bento-text-muted font-['DM_Mono']">
              {loading ? 'Loading...' : `${totalItems} item${totalItems !== 1 ? 's' : ''}`}
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => emptyCart()}
              className="text-[11px] text-red-400 hover:text-red-300 transition-colors font-medium flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 px-3 py-1.5 rounded-[6px] cursor-pointer"
            >
              <Trash2 className="h-3 w-3" /> Clear All
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-32 bg-bento-card border border-bento-border rounded-[16px] shadow-bento">
            <Loader2 className="h-6 w-6 animate-spin text-bento-text-muted" />
            <span className="text-[12px] text-bento-text-muted">Fetching your bag...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-4 py-32 bg-bento-card border border-bento-border rounded-[16px] shadow-bento text-center">
            <Package className="h-10 w-10 text-bento-text-faint" strokeWidth={1} />
            <div>
              <p className="text-[14px] text-bento-text-muted">{typeof error === 'string' ? error : 'Failed to load cart.'}</p>
              <p className="text-[11px] text-bento-text-faint mt-1">Please check your connection or log in again.</p>
            </div>
            <Button onClick={() => loadCart()} className="text-[12px]">Retry</Button>
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center gap-6 py-32 bg-bento-card border border-bento-border rounded-[16px] shadow-bento text-center">
            <div className="h-16 w-16 rounded-[16px] bg-bento-card-sunken border border-bento-border-light shadow-bento-sunken flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-bento-text-faint" strokeWidth={1} />
            </div>
            <div className="space-y-1.5">
              <p className="text-[16px] font-semibold text-bento-text">Your bag is empty</p>
              <p className="text-[12px] text-bento-text-muted font-light">
                Explore the collection and add something you love.
              </p>
            </div>
            <Link to="/">
              <Button className="flex items-center gap-2 text-[12px]">
                Browse Collection <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        ) : (
          /* Cart Content — Two-column layout */
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-3">
              {items.map((item) => {
                const variant = item.product?.variants?.find(
                  (v) => (v._id || v).toString() === (item.variant?._id || item.variant).toString()
                );
                const stock = variant ? variant.stock : (item.product?.variants?.length ? 0 : 100);
                const isOutOfStock = stock <= 0;
                const isLowStock = stock > 0 && stock <= 5;
                const hasInsufficientStock = stock > 0 && item.quantity > stock;

                return (
                  <div
                    key={item._id}
                    className={`flex items-center gap-4 p-4 bg-bento-card border rounded-[14px] shadow-bento transition-all hover:shadow-bento-elevated ${
                      isOutOfStock
                        ? 'border-red-500/30 bg-red-500/5'
                        : hasInsufficientStock
                        ? 'border-amber-500/30 bg-amber-500/5'
                        : 'border-bento-border'
                    }`}
                  >
                  {/* Product Image */}
                  <div className="h-20 w-20 rounded-[10px] border border-bento-border-light overflow-hidden bg-bento-card-sunken shadow-bento-sunken shrink-0">
                    {item.product?.images?.[0]?.url ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-bento-text-faint" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      to={`/product/${item.product?._id}`}
                      className="text-[14px] font-semibold text-bento-text hover:underline underline-offset-4 line-clamp-1 leading-tight block"
                    >
                      {item.product?.title}
                    </Link>
                    {item.product?.brand && (
                      <p className="text-[11px] text-bento-text-faint font-['DM_Mono'] uppercase tracking-wider">
                        {item.product.brand}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <p className="text-[13px] font-bold text-bento-text font-['DM_Mono']">
                        {item.price?.currency || item.product?.price?.currency || 'INR'}{' '}
                        {parseFloat(item.price?.amount ?? item.product?.price?.amount ?? 0).toFixed(2)}
                      </p>
                      
                      {/* Stock Badge */}
                      {isOutOfStock ? (
                        <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-[4px] font-['DM_Mono'] uppercase tracking-wider">
                          Out of Stock
                        </span>
                      ) : hasInsufficientStock ? (
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-[4px] font-['DM_Mono'] uppercase tracking-wider">
                          Only {stock} available
                        </span>
                      ) : isLowStock ? (
                        <span className="text-[10px] font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-[4px] font-['DM_Mono'] uppercase tracking-wider">
                          Only {stock} Left
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-zinc-400 bg-zinc-500/10 border border-zinc-500/20 px-2 py-0.5 rounded-[4px] font-['DM_Mono'] uppercase tracking-wider">
                          In Stock ({stock} Available)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center bg-bento-card-sunken border border-bento-border-light p-0.5 rounded-[8px] shadow-bento-sunken">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || loading}
                        className="h-7 w-7 rounded-[6px] bg-transparent hover:bg-bento-card text-bento-text flex items-center justify-center cursor-pointer transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-[12px] font-bold font-['DM_Mono'] text-bento-text px-3 select-none min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={loading || item.quantity >= stock}
                        className="h-7 w-7 rounded-[6px] bg-transparent hover:bg-bento-card text-bento-text flex items-center justify-center cursor-pointer transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                        title={item.quantity >= stock ? `Only ${stock} items in stock` : 'Add one more'}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="text-[12px] font-bold text-bento-text font-['DM_Mono'] hidden sm:block min-w-[70px] text-right">
                      {item.price?.currency || item.product?.price?.currency || 'INR'}{' '}
                      {(parseFloat(item.price?.amount ?? item.product?.price?.amount ?? 0) * item.quantity).toFixed(2)}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item._id)}
                      disabled={loading}
                      className="h-8 w-8 rounded-[8px] border border-bento-border-light bg-bento-card hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 shadow-bento-btn active:translate-y-[1px] active:shadow-bento-btn-active flex items-center justify-center text-bento-text-faint cursor-pointer transition-all disabled:opacity-40"
                      title="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:w-[320px] shrink-0">
              <div className="bg-bento-card border border-bento-border rounded-[14px] shadow-bento p-6 space-y-5 sticky top-24">
                <h2 className="text-[14px] font-semibold text-bento-text tracking-tight">Order Summary</h2>

                {/* Line items */}
                <div className="space-y-2 font-['DM_Mono'] text-[11px] text-bento-text-muted">
                  <div className="flex justify-between">
                    <span>SUBTOTAL ({totalItems} items)</span>
                    <span className="text-bento-text font-bold">{formatSubtotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SHIPPING</span>
                    <span className="text-bento-text-faint font-bold">COMPLIMENTARY</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TAXES</span>
                    <span className="text-bento-text-faint font-bold">INCL.</span>
                  </div>
                </div>

                <div className="h-px bg-bento-border-light" />

                {/* Total */}
                <div className="flex justify-between items-baseline">
                  <span className="text-[12px] font-semibold text-bento-text-muted font-['DM_Mono'] uppercase tracking-wider">Total</span>
                  <span className="text-[20px] font-bold text-bento-text font-['DM_Mono']">{formatSubtotal()}</span>
                </div>

                {/* CTA */}
                <Button
                  disabled={items.length === 0 || loading || !isCheckoutReady}
                  onClick={() => navigate('/checkout')}
                  className="w-full h-[44px] text-[12px] uppercase font-semibold tracking-wider gap-2 shadow-bento-btn mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Button>

                {!isCheckoutReady && (
                  <p className="text-[10px] text-red-400 text-center font-medium mt-1 font-['DM_Mono']">
                    ADJUST QUANTITY OR REMOVE OUT OF STOCK ITEMS TO PROCEED
                  </p>
                )}

                <Link to="/" className="block text-center text-[11px] text-bento-text-faint hover:text-bento-text transition-colors font-['DM_Mono'] tracking-wider uppercase">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
