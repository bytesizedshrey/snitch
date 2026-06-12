import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react';
import { Image as ImageIcon } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useCart } from '../hooks/useCart';

export function CartDrawer({ cartOpen, setCartOpen }) {
  const navigate = useNavigate();
  const { cartData, items, updateQuantity, removeItem, emptyCart } = useCart();

  const totalCartItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const cartSubtotalsByCurrency = items.reduce((acc, item) => {
    const currency = item.price?.currency || item.product.price?.currency || 'INR';
    const amount = parseFloat(item.price?.amount ?? item.product.price?.amount ?? 0) * item.quantity;
    if (!acc[currency]) {
      acc[currency] = 0;
    }
    acc[currency] += amount;
    return acc;
  }, {});

  const formatCartSubtotal = () => {
    const entries = Object.entries(cartSubtotalsByCurrency);
    if (entries.length === 0) return 'INR 0.00';
    return entries.map(([currency, amount]) => `${currency} ${amount.toFixed(2)}`).join(' + ');
  };

  const isCartCheckoutReady = items.every((item) => {
    const variant = item.product?.variants?.find(
      (v) => (v._id || v).toString() === (item.variant?._id || item.variant).toString()
    );
    const stock = variant ? variant.stock : (item.product?.variants?.length ? 0 : 100);
    return stock > 0 && item.quantity <= stock;
  });

  if (!cartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity animate-fade-in"
        onClick={() => setCartOpen(false)}
      />
      
      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-bento-card border-l border-bento-border p-6 shadow-bento flex flex-col justify-between select-none animate-fade-in font-['Noto_Sans']">
        <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-bento-border pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-bento-border-light pb-4 mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
            <h2 className="text-[18px] font-semibold text-bento-text tracking-tight">Shopping Bag</h2>
            <span className="text-[10px] font-['DM_Mono'] text-bento-text-faint bg-bento-card-sunken border border-bento-border-light px-2 py-0.5 rounded-[4px]">
              {totalCartItems} Items
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="h-7 w-7 rounded-[6px] border border-bento-border bg-bento-card hover:bg-bento-card-hover shadow-bento-btn active:translate-y-[1px] active:shadow-bento-btn-active flex items-center justify-center text-bento-text-muted hover:text-bento-text cursor-pointer focus:outline-none transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto pr-1 bg-bento-card-sunken/30 border border-bento-border-light rounded-[12px] p-4 shadow-bento-sunken space-y-4 mb-6 min-h-0">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-20 animate-fade-in">
              <ShoppingBag className="h-10 w-10 text-bento-text-faint" strokeWidth={1} />
              <div>
                <p className="text-[13px] text-bento-text-muted font-normal">Your shopping bag is empty</p>
                <p className="text-[11px] text-bento-text-faint font-light">Explore the collection to add items.</p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item._id || item.product._id}
                className="flex items-center justify-between p-3 bg-bento-card border border-bento-border rounded-[8px] shadow-bento gap-4"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-12 w-12 rounded-[6px] border border-bento-border-light overflow-hidden bg-bento-card-sunken shrink-0">
                    {item.product.images?.[0]?.url ? (
                      <img src={item.product.images[0].url} alt={item.product.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-bento-text-faint" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[12px] font-bold text-bento-text truncate leading-tight">
                      {item.product.title}
                    </h4>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-['DM_Mono'] font-bold">
                      {item.price?.currency || item.product.price?.currency || 'INR'} {item.price?.amount ?? item.product.price?.amount}
                    </p>
                    {(() => {
                      const variant = item.product?.variants?.find(
                        (v) => (v._id || v).toString() === (item.variant?._id || item.variant).toString()
                      );
                      const stock = variant ? variant.stock : (item.product?.variants?.length ? 0 : 100);
                      return (
                        <p className={`text-[9px] font-semibold font-['DM_Mono'] mt-0.5 uppercase ${stock <= 0 ? 'text-red-400' : 'text-zinc-400'}`}>
                          Stock: {stock <= 0 ? 'OUT OF STOCK' : `${stock} Available`}
                        </p>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center bg-bento-card-sunken border border-bento-border-light p-0.5 rounded-[6px] shadow-bento-sunken">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="h-5 w-5 rounded-[4px] bg-transparent hover:bg-bento-card text-bento-text flex items-center justify-center cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-2.5 w-2.5" />
                    </button>
                    <span className="text-[10px] font-bold font-['DM_Mono'] text-bento-text px-2 select-none">
                      {item.quantity}
                    </span>
                    {(() => {
                      const variant = item.product?.variants?.find(
                        (v) => (v._id || v).toString() === (item.variant?._id || item.variant).toString()
                      );
                      const stock = variant ? variant.stock : (item.product?.variants?.length ? 0 : 100);
                      return (
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={item.quantity >= stock}
                          className="h-5 w-5 rounded-[4px] bg-transparent hover:bg-bento-card text-bento-text flex items-center justify-center cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={item.quantity >= stock ? `Only ${stock} in stock` : 'Add one more'}
                        >
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                      );
                    })()}
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="h-6 w-6 rounded-[4px] border border-bento-border-light bg-bento-card hover:bg-bento-card-hover hover:text-red-400 shadow-bento-btn active:translate-y-[1px] active:shadow-bento-btn-active flex items-center justify-center text-bento-text-faint cursor-pointer transition-all"
                    title="Remove from bag"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-bento-border-light pt-4 space-y-4">
          <div className="space-y-1.5 font-['DM_Mono'] text-[12px] text-bento-text-muted">
            <div className="flex justify-between">
              <span>SUBTOTAL</span>
              <span className="text-bento-text font-bold">{formatCartSubtotal()}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span>SHIPPING & PROCESSING</span>
              <span className="text-zinc-400 dark:text-zinc-500 font-bold">COMPLIMENTARY</span>
            </div>
          </div>
          
          <Button
            disabled={items.length === 0 || !isCartCheckoutReady}
            onClick={() => {
              setCartOpen(false);
              navigate('/checkout');
            }}
            className="w-full h-11 text-[12px] uppercase font-semibold tracking-wider gap-2 shadow-bento-btn active:translate-y-[1px] active:shadow-bento-btn-active mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </Button>

          {!isCartCheckoutReady && items.length > 0 && (
            <p className="text-[9px] text-red-400 text-center font-medium mt-1 font-['DM_Mono'] uppercase">
              Adjust stock/quantity to proceed
            </p>
          )}
        </div>
      </div>
    </>
  );
}
