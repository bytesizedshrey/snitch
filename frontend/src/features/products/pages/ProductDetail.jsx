import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../auth/hook/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart as addToCartAction, removeFromCart as removeFromCartAction, updateCartQuantity, clearCart, syncSingleProductInCart } from '../../products/state/product.slice';
import { getProductDetails } from '../service/product.api';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { BiomorphicBackground } from '../../../components/BiomorphicBackground';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Image as ImageIcon, 
  Loader2, 
  Minus, 
  Plus, 
  Trash2, 
  X,
  ArrowUpRight
} from 'lucide-react';

export default function ProductDetail() {
  const { productId } = useParams();
  const { user, handleLogout } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Interactive Showcase States
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.product.cart);
  const [cartOpen, setCartOpen] = useState(false);

  // Fetch product on load
  useEffect(() => {
    let active = true;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getProductDetails(productId);
        if (active) {
          const resolvedProduct = data.product || data;
          setProduct(resolvedProduct);
          dispatch(syncSingleProductInCart(resolvedProduct));
          setError(null);
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
        if (active) {
          setError('Product not found or failed to load details.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    if (productId) {
      fetchDetail();
    }
    return () => {
      active = false;
    };
  }, [productId, dispatch]);

  // Cart helper functions
  const addToCart = (prod) => {
    if (!prod) return;
    dispatch(addToCartAction(prod));
    setCartOpen(true);
  };

  const removeFromCart = (id) => {
    dispatch(removeFromCartAction(id));
  };

  const updateQuantity = (id, amount) => {
    dispatch(updateCartQuantity({ productId: id, amount }));
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  const cartSubtotal = cart.reduce(
    (total, item) => total + parseFloat(item.product.price?.amount || 0) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-bento-bg text-bento-text flex flex-col font-['Noto_Sans'] antialiased relative">
      {/* Light Biomorphic Background */}
      <BiomorphicBackground />

      {/* Header */}
      <header className="border-b border-bento-border bg-bento-card/80 backdrop-blur-md sticky top-0 z-50 shadow-bento">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-[12px] text-bento-text-faint hover:text-bento-text transition-colors flex items-center gap-1.5 cursor-pointer">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Store
            </Link>
          </div>
          
          <nav className="flex items-center gap-4">
            <ThemeToggle />

            {/* Shopping Bag Button with Cart Count Badge */}
            <button
              onClick={() => setCartOpen(true)}
              className={`h-8 w-8 rounded-[6px] border transition-all cursor-pointer flex items-center justify-center text-bento-text relative ${
                cartOpen
                  ? 'bg-bento-card-sunken border-bento-border-light shadow-bento-btn-active translate-y-[1px]'
                  : 'border-bento-border bg-bento-card hover:bg-bento-card-hover shadow-bento-btn active:translate-y-[1px] active:shadow-bento-btn-active'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-bento-text border border-bento-border flex items-center justify-center text-[9px] font-bold text-bento-bg font-['DM_Mono'] shadow-bento">
                  {totalCartItems}
                </span>
              )}
            </button>

            {user ? (
              user.role === 'seller' ? (
                <Link to="/seller/dashboard" className="text-[12px] text-bento-text hover:text-bento-text-muted transition-colors tracking-wide font-medium flex items-center gap-1.5 cursor-pointer bg-bento-card-sunken px-2.5 py-1 rounded-[4px] border border-bento-border-light ml-2">
                  Console <ArrowUpRight className="h-3 w-3" />
                </Link>
              ) : (
                <div className="flex items-center gap-3 ml-2">
                  <span className="text-[12px] text-bento-text-muted tracking-wide font-light">
                    Hello, {user.fullname?.split(' ')[0]}
                  </span>
                  <button
                    onClick={async () => {
                      await handleLogout();
                    }}
                    className="text-[11px] text-red-500 hover:text-red-400 font-medium transition-colors cursor-pointer bg-red-500/10 px-2 py-1 rounded-[4px] border border-red-500/20"
                  >
                    Sign Out
                  </button>
                </div>
              )
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link to="/login" className="text-[12px] text-bento-text-muted hover:text-bento-text transition-colors tracking-wide cursor-pointer font-medium">
                  Sign In
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full flex flex-col justify-center z-10">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 bg-bento-card border border-bento-border rounded-[12px] shadow-bento">
            <Loader2 className="h-6 w-6 animate-spin text-bento-text-muted" />
            <span className="text-[12px] text-bento-text-muted font-medium">Loading product details...</span>
          </div>
        ) : error || !product ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 bg-bento-card border border-bento-border rounded-[12px] shadow-bento text-center">
            <ImageIcon className="h-10 w-10 text-bento-text-faint" />
            <p className="text-[14px] text-bento-text-muted font-normal">{error || 'Product details not available.'}</p>
            <Link to="/">
              <Button className="text-[12px]">Return to Homepage</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-bento-card border border-bento-border rounded-[16px] p-6 md:p-8 shadow-bento overflow-hidden flex flex-col md:flex-row gap-8 relative">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-bento-border pointer-events-none" />
            
            {/* Left Column: Skeuomorphic Image frame with zoom factor controls */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="aspect-square bg-bento-card-sunken border border-bento-border-light rounded-[12px] shadow-bento-sunken overflow-hidden relative flex items-center justify-center">
                {product.images?.[0]?.url ? (
                  <img 
                    src={product.images[0].url} 
                    alt={product.title} 
                    style={{ transform: `scale(${zoomLevel})` }}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out origin-center" 
                  />
                ) : (
                  <ImageIcon className="h-12 w-12 text-bento-text-faint" />
                )}
                
                <div className="absolute bottom-4 right-4 bg-bento-card/90 backdrop-blur-md border border-bento-border px-3 py-1 rounded-[6px] shadow-bento">
                  <span className="text-[13px] font-bold text-bento-text font-['DM_Mono']">
                    {product.price?.currency || 'INR'} {product.price?.amount}
                  </span>
                </div>
              </div>

              {/* Image zoom controller */}
              <div className="flex items-center justify-between bg-bento-card-sunken border border-bento-border-light p-1.5 rounded-[8px] shadow-bento-sunken shrink-0">
                <span className="text-[10px] text-bento-text-faint font-semibold uppercase tracking-wider font-['DM_Mono'] ml-1.5">
                  Viewer Zoom Level
                </span>
                <div className="flex items-center gap-1.5">
                  {[1, 1.2, 1.5].map((z) => {
                    const isActive = zoomLevel === z;
                    return (
                      <button
                        key={z}
                        onClick={() => setZoomLevel(z)}
                        className={`text-[10px] font-bold font-['DM_Mono'] px-2 py-0.5 rounded-[4px] border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-bento-card text-bento-text border-bento-border shadow-bento-btn'
                            : 'bg-transparent text-bento-text-faint border-transparent hover:text-bento-text'
                        }`}
                      >
                        {z}x
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: details panel */}
            <div className="w-full md:w-1/2 flex flex-col justify-between py-2 text-left">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-['DM_Mono']">
                    {product.category || 'COLLECTION ITEM'}
                  </span>
                  <h1 className="text-[24px] font-bold text-bento-text tracking-tight mt-1 leading-tight">
                    {product.title}
                  </h1>
                </div>

                {/* Info and specs tabs */}
                <div>
                  <div className="flex border-b border-bento-border-light pb-1.5 mb-4">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`text-[11px] font-bold tracking-wider uppercase pb-1 mr-4 border-b-2 transition-all cursor-pointer ${
                        activeTab === 'details'
                          ? 'text-bento-text border-bento-text'
                          : 'text-bento-text-faint border-transparent hover:text-bento-text-muted'
                      }`}
                    >
                      Description
                    </button>
                    <button
                      onClick={() => setActiveTab('specs')}
                      className={`text-[11px] font-bold tracking-wider uppercase pb-1 border-b-2 transition-all cursor-pointer ${
                        activeTab === 'specs'
                          ? 'text-bento-text border-bento-text'
                          : 'text-bento-text-faint border-transparent hover:text-bento-text-muted'
                      }`}
                    >
                      Specifications
                    </button>
                  </div>

                  {/* Tab content */}
                  {activeTab === 'details' ? (
                    <p className="text-[13px] text-bento-text-muted leading-relaxed font-light">
                      {product.description}
                    </p>
                  ) : (
                    <div className="bg-bento-card-sunken border border-bento-border-light p-4 rounded-[10px] shadow-bento-sunken space-y-2.5 font-['DM_Mono'] text-[11px] text-bento-text-muted">
                      <div className="flex justify-between border-b border-bento-border-light/40 pb-1.5">
                        <span className="text-bento-text-faint">MATERIAL</span>
                        <span className="text-bento-text">{product.specs?.material || 'Premium Canvas Cotton Blend'}</span>
                      </div>
                      <div className="flex justify-between border-b border-bento-border-light/40 pb-1.5">
                        <span className="text-bento-text-faint">FABRIC WEIGHT</span>
                        <span className="text-bento-text">{product.specs?.weight || '380 GSM Heavyweight'}</span>
                      </div>
                      <div className="flex justify-between border-b border-bento-border-light/40 pb-1.5">
                        <span className="text-bento-text-faint">SILHOUETTE</span>
                        <span className="text-bento-text">{product.specs?.fit || 'Regular / Boxy Fit'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-bento-text-faint">ORIGIN</span>
                        <span className="text-bento-text">{product.specs?.origin || 'Imported'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Add to bag action */}
              <div className="pt-8 border-t border-bento-border-light mt-8">
                <Button
                  onClick={() => addToCart(product)}
                  className="w-full h-12 text-[12px] uppercase font-semibold tracking-wider gap-2 shadow-bento-btn active:translate-y-[1px]"
                >
                  <ShoppingBag className="h-4 w-4" /> Add to Shopping Bag
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Cart Side Drawer */}
      {cartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity animate-fade-in"
            onClick={() => setCartOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-bento-card border-l border-bento-border p-6 shadow-bento flex flex-col justify-between select-none animate-fade-in">
            <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-bento-border pointer-events-none" />
            
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

            <div className="flex-1 overflow-y-auto pr-1 bg-bento-card-sunken/30 border border-bento-border-light rounded-[12px] p-4 shadow-bento-sunken space-y-4 mb-6 min-h-0">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-20 animate-fade-in">
                  <ShoppingBag className="h-10 w-10 text-bento-text-faint" strokeWidth={1} />
                  <div>
                    <p className="text-[13px] text-bento-text-muted font-normal">Your shopping bag is empty</p>
                    <p className="text-[11px] text-bento-text-faint font-light">Explore the collection to add items.</p>
                  </div>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product._id}
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
                          {item.product.price?.currency || 'INR'} {item.product.price?.amount}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center bg-bento-card-sunken border border-bento-border-light p-0.5 rounded-[6px] shadow-bento-sunken">
                        <button
                          onClick={() => updateQuantity(item.product._id, -1)}
                          className="h-5 w-5 rounded-[4px] bg-transparent hover:bg-bento-card text-bento-text flex items-center justify-center cursor-pointer transition-all active:scale-95"
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span className="text-[10px] font-bold font-['DM_Mono'] text-bento-text px-2 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, 1)}
                          className="h-5 w-5 rounded-[4px] bg-transparent hover:bg-bento-card text-bento-text flex items-center justify-center cursor-pointer transition-all active:scale-95"
                        >
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
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

            <div className="border-t border-bento-border-light pt-4 space-y-4">
              <div className="space-y-1.5 font-['DM_Mono'] text-[12px] text-bento-text-muted">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span className="text-bento-text font-bold">INR {cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>SHIPPING & PROCESSING</span>
                  <span className="text-zinc-400 dark:text-zinc-500 font-bold">COMPLIMENTARY</span>
                </div>
              </div>
              
              <Button
                disabled={cart.length === 0}
                onClick={() => {
                  alert('Thank you for your order! Checkout simulated successfully.');
                  dispatch(clearCart());
                  setCartOpen(false);
                }}
                className="w-full h-11 text-[12px] uppercase font-semibold tracking-wider gap-2 shadow-bento-btn mt-2"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}