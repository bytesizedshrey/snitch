import { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../auth/hook/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { useCart } from '../../cart/hooks/useCart';
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
  const { items, loadCart, addItem } = useCart();
  const { setCartOpen } = useOutletContext();

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

  // Load cart initially
  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user, loadCart]);

  // Handle Add to Cart
  const handleAddToCart = async (prod) => {
    if (!prod) return;
    if (!user) {
      alert("Please login to add items to bag.");
      return;
    }
    try {
      const variantId = prod.variants?.[0]?._id; 
      await addItem(prod._id, variantId || null, 1);
      setCartOpen(true);
    } catch (err) {
      alert(err || "Failed to add item to bag");
    }
  };

  const totalCartItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* Light Biomorphic Background */}
      <BiomorphicBackground />

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
                  <Button className="flex-1 shadow-bento-btn pointer-events-auto" onClick={() => handleAddToCart(product)}>
                  Add to Bag
                </Button>
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
                  onClick={() => handleAddToCart(product)}
                  className="w-full h-12 text-[12px] uppercase font-semibold tracking-wider gap-2 shadow-bento-btn active:translate-y-[1px]"
                >
                  <ShoppingBag className="h-4 w-4" /> Add to Shopping Bag
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}