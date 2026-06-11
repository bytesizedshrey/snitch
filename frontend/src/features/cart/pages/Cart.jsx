import { useEffect } from 'react';
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
  const { items, loading, error, loadCart, updateQuantity, removeItem, emptyCart } = useCart();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    loadCart();
  }, [user, navigate, loadCart]);

  const subtotal = items.reduce(
    (acc, item) => acc + parseFloat(item.price?.amount ?? item.product?.price?.amount ?? 0) * item.quantity,
    0
  );

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
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
            {/* Left: Items List */}
            <div className="flex-1 space-y-3">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-4 bg-bento-card border border-bento-border rounded-[14px] shadow-bento transition-all hover:shadow-bento-elevated"
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
                    <p className="text-[13px] font-bold text-bento-text font-['DM_Mono']">
                      {item.price?.currency || item.product?.price?.currency || 'INR'}{' '}
                      {parseFloat(item.price?.amount ?? item.product?.price?.amount ?? 0).toFixed(2)}
                    </p>
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
                        disabled={loading}
                        className="h-7 w-7 rounded-[6px] bg-transparent hover:bg-bento-card text-bento-text flex items-center justify-center cursor-pointer transition-all active:scale-90 disabled:opacity-40"
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
              ))}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:w-[320px] shrink-0">
              <div className="bg-bento-card border border-bento-border rounded-[14px] shadow-bento p-6 space-y-5 sticky top-24">
                <h2 className="text-[14px] font-semibold text-bento-text tracking-tight">Order Summary</h2>

                {/* Line items */}
                <div className="space-y-2 font-['DM_Mono'] text-[11px] text-bento-text-muted">
                  <div className="flex justify-between">
                    <span>SUBTOTAL ({totalItems} items)</span>
                    <span className="text-bento-text font-bold">INR {subtotal.toFixed(2)}</span>
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
                  <span className="text-[20px] font-bold text-bento-text font-['DM_Mono']">INR {subtotal.toFixed(2)}</span>
                </div>

                {/* CTA */}
                <Button
                  disabled={items.length === 0 || loading}
                  onClick={() => {
                    alert('Thank you for your order! Checkout coming soon.');
                    emptyCart();
                    navigate('/');
                  }}
                  className="w-full h-[44px] text-[12px] uppercase font-semibold tracking-wider gap-2 shadow-bento-btn mt-1"
                >
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Button>

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
