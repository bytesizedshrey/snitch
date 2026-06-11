import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../state/cart.slice';
import { ShoppingBag, Check, X } from 'lucide-react';

export function CartToast() {
  const dispatch = useDispatch();
  const { toast } = useSelector((state) => state.cart);
  const [width, setWidth] = useState(100);

  useEffect(() => {
    if (!toast.show) return;

    setWidth(100);
    const startTime = Date.now();
    const duration = 3000; // 3 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setWidth(remaining);

      if (elapsed >= duration) {
        clearInterval(interval);
        dispatch(hideToast());
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [toast.show, dispatch]);

  if (!toast.show || !toast.product) return null;

  const { title, image, price, quantity } = toast.product;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-[320px] w-full bg-bento-card border border-bento-border rounded-[16px] shadow-bento p-4 flex flex-col gap-3 font-['Noto_Sans'] select-none animate-fade-in transition-all">
      {/* Physical Bevel Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-bento-border pointer-events-none" />
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {/* Sunken thumbnail frame */}
          <div className="h-12 w-12 rounded-[8px] bg-bento-card-sunken border border-bento-border-light shadow-bento-sunken overflow-hidden flex items-center justify-center shrink-0">
            {image ? (
              <img src={image} alt={title} className="h-full w-full object-cover" />
            ) : (
              <ShoppingBag className="h-5 w-5 text-bento-text-faint" />
            )}
          </div>

          {/* Details */}
          <div className="min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="h-3.5 w-3.5 rounded-full bg-[#10b981]/15 border border-[#10b981]/25 flex items-center justify-center text-[#10b981] shadow-bento-sunken">
                <Check className="h-2 w-2" strokeWidth={3} />
              </span>
              <span className="text-[9px] font-['DM_Mono'] text-[#10b981] font-bold uppercase tracking-wider">
                Added to Bag
              </span>
            </div>
            <h4 className="text-[12px] font-bold text-bento-text truncate leading-tight">
              {title}
            </h4>
            <p className="text-[9px] text-bento-text-muted font-['DM_Mono'] mt-0.5">
              Qty: {quantity} &bull; {price?.currency || 'INR'} {price?.amount}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => dispatch(hideToast())}
          className="h-6 w-6 rounded-[6px] border border-bento-border bg-bento-card hover:bg-bento-card-hover shadow-bento-btn active:translate-y-[1px] active:shadow-bento-btn-active flex items-center justify-center text-bento-text-faint hover:text-bento-text cursor-pointer focus:outline-none transition-all shrink-0"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      {/* Tactile Progress Indicator Tube */}
      <div className="w-full h-1 bg-bento-card-sunken border border-bento-border-light rounded-full overflow-hidden shadow-bento-sunken relative">
        <div 
          className="h-full bg-zinc-500 dark:bg-zinc-300 rounded-full transition-all duration-75"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
