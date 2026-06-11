import { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../auth/hook/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { useCart } from '../../cart/hooks/useCart';
import { CartDrawer } from '../../cart/components/CartDrawer';
import { getAllProducts } from '../../products/service/product.api';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { BiomorphicBackground } from '../../../components/BiomorphicBackground';
import { BentoGrid, BentoCard } from '../../../components/magicui/bento-grid';
import { 
  ArrowUpRight, 
  ShoppingBag, 
  Search, 
  Sparkles, 
  Image as ImageIcon, 
  Loader2, 
  Minus, 
  Plus, 
  Trash2, 
  X 
} from 'lucide-react';

const defaultFeatured = {
  _id: "default-featured-tech-shell",
  title: "Aero-Weave Tech Shell",
  description: "A precision-engineered outerwear piece featuring a high-density tactile weave, windproof lining, and water-repellent shell.",
  price: { currency: "INR", amount: "8999" },
  images: [{ url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80" }],
  specs: {
    material: "85% Cordura Nylon, 15% Elastane",
    weight: "340g Heavyweight",
    fit: "Athletic / Semi-structured",
    origin: "Tokyo, Japan"
  }
};

export default function Home() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Interactive Showcase States
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  const dispatch = useDispatch();
  const { items, loadCart, addItem } = useCart();
  const { searchQuery, selectedCategory, setSearchQuery, setSelectedCategory, setCartOpen } = useOutletContext();

  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        if (active) {
          setProducts(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load products for homepage:', err);
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchProducts();
    return () => {
      active = false;
    };
  }, [dispatch]);

  // Load cart initially
  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user, loadCart]);

  // Handle Add to Cart
  const handleAddToCart = async (product) => {
    if (!user) {
      alert("Please login to add items to bag.");
      return navigate('/login');
    }
    try {
      const variantId = product.variants?.[0]?._id; 
      // For showcase default product, or real products
      await addItem(product._id, variantId || null, 1);
      setCartOpen(true);
    } catch (err) {
      alert(err || "Failed to add item to bag");
    }
  };

  const totalCartItems = items.reduce((total, item) => total + item.quantity, 0);

  // Search and Category filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery
      ? product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCategory = selectedCategory
      ? product.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        product.title.toLowerCase().includes(selectedCategory.toLowerCase().slice(0, -2))
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Light Biomorphic Background (Storefront scope only) */}
      <BiomorphicBackground />

      {/* Main E-commerce Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full flex flex-col gap-8 z-10">
        
        {/* Promotional Hero Banner (Embossed) */}
        <div className="w-full bg-bento-card border border-bento-border rounded-[16px] p-8 md:p-12 shadow-bento relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-bento-border pointer-events-none" />
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-zinc-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4 max-w-lg relative z-10">
            <div className="inline-flex items-center gap-2 border border-bento-border-light px-3 py-1 rounded-full bg-bento-card-sunken shadow-bento-sunken">
              <Sparkles className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
              <span className="text-[10px] text-bento-text-muted tracking-widest uppercase font-bold">
                Buy & Sell, Simplified
              </span>
            </div>
            <h1 className="text-[32px] md:text-[48px] font-bold leading-[1.1] text-bento-text tracking-tight">
              Anything you want.<br/>All in one place.
            </h1>
            <p className="text-[14px] text-bento-text-muted leading-relaxed font-light max-w-md">
              Browse products from independent sellers or set up your own store in minutes. snitch connects buyers and sellers, simply.
            </p>
            <div className="pt-2">
              <Button
                onClick={() => {
                  document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-10 px-6 text-[12px] gap-2 cursor-pointer"
              >
                Explore Catalog
              </Button>
            </div>
          </div>
          
          {/* Spotlight Widget */}
          {(() => {
            const featuredProduct = products[0] || defaultFeatured;
            const featuredSpecs = featuredProduct.specs || defaultFeatured.specs;
            return (
              <div className="hidden md:flex flex-col z-10 w-full max-w-sm h-64 bg-bento-card border border-bento-border rounded-[12px] shadow-bento overflow-hidden p-4 justify-between">
                <div className="flex items-center justify-between border-b border-bento-border-light pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500 shadow-bento"></span>
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-bento-text-muted font-['DM_Mono']">
                      Spotlight Interactive
                    </span>
                  </div>
                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1.5 bg-bento-card-sunken border border-bento-border-light p-0.5 rounded-[6px] shadow-bento-sunken">
                    <span className="text-[9px] text-bento-text-faint px-1 font-['DM_Mono']">ZOOM</span>
                    {[1, 1.2, 1.5].map((z) => {
                      const isActive = zoomLevel === z;
                      return (
                        <button
                          key={z}
                          onClick={() => setZoomLevel(z)}
                          className={`text-[9px] font-bold font-['DM_Mono'] px-1.5 py-0.5 rounded-[4px] border transition-all cursor-pointer ${
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

                <div className="flex-1 flex gap-3 min-h-0">
                  {/* Image Bezel */}
                  <div 
                    onClick={() => navigate(`/product/${featuredProduct._id}`)}
                    className="w-1/3 aspect-[3/4] bg-bento-card-sunken border border-bento-border-light rounded-[8px] shadow-bento-sunken overflow-hidden relative group cursor-pointer"
                  >
                    <img
                      src={featuredProduct.images?.[0]?.url || defaultFeatured.images[0].url}
                      alt={featuredProduct.title}
                      style={{ transform: `scale(${zoomLevel})` }}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out origin-center"
                    />
                  </div>

                  {/* Info Frame */}
                  <div className="flex-1 flex flex-col justify-between min-h-0">
                    {/* Tabs */}
                    <div className="flex border-b border-bento-border-light pb-1 mb-2">
                      <button
                        onClick={() => setActiveTab('details')}
                        className={`text-[10px] font-bold tracking-wider uppercase pb-0.5 mr-3 border-b transition-all cursor-pointer ${
                          activeTab === 'details'
                            ? 'text-bento-text border-bento-text'
                            : 'text-bento-text-faint border-transparent hover:text-bento-text-muted'
                        }`}
                      >
                        Details
                      </button>
                      <button
                        onClick={() => setActiveTab('specs')}
                        className={`text-[10px] font-bold tracking-wider uppercase pb-0.5 border-b transition-all cursor-pointer ${
                          activeTab === 'specs'
                            ? 'text-bento-text border-bento-text'
                            : 'text-bento-text-faint border-transparent hover:text-bento-text-muted'
                        }`}
                      >
                        Specs
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto pr-1 text-left min-h-0 select-none">
                      {activeTab === 'details' ? (
                        <div className="space-y-1">
                          <h4 className="text-[12px] font-bold text-bento-text leading-tight truncate">
                            {featuredProduct.title}
                          </h4>
                          <p className="text-[10px] text-bento-text-muted font-light leading-snug line-clamp-3">
                            {featuredProduct.description}
                          </p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 font-['DM_Mono']">
                              {featuredProduct.price?.currency || 'INR'} {featuredProduct.price?.amount}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(featuredProduct);
                              }}
                              className="text-[9px] font-bold font-['DM_Mono'] border border-bento-border bg-bento-card hover:bg-bento-card-hover px-2 py-0.5 rounded-[4px] shadow-bento-btn active:translate-y-[0.5px] active:shadow-bento-btn-active text-bento-text cursor-pointer transition-all"
                            >
                              Add to Bag
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1 font-['DM_Mono'] text-[9px] text-bento-text-muted">
                          <div className="flex justify-between border-b border-bento-border-light/40 py-0.5">
                            <span className="text-bento-text-faint">MAT</span>
                            <span className="text-right truncate max-w-[100px]">{featuredSpecs.material}</span>
                          </div>
                          <div className="flex justify-between border-b border-bento-border-light/40 py-0.5">
                            <span className="text-bento-text-faint">WGT</span>
                            <span>{featuredSpecs.weight}</span>
                          </div>
                          <div className="flex justify-between border-b border-bento-border-light/40 py-0.5">
                            <span className="text-bento-text-faint">FIT</span>
                            <span>{featuredSpecs.fit}</span>
                          </div>
                          <div className="flex justify-between py-0.5">
                            <span className="text-bento-text-faint">LOC</span>
                            <span>{featuredSpecs.origin}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Micro tactile footer bar in card */}
                <div className="border-t border-bento-border-light pt-2 mt-2 flex items-center justify-between text-[9px] text-bento-text-faint font-['DM_Mono']">
                  <span>REF: 0x9F82</span>
                  <span>TACTILE SYS v1.02</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Bento Grid Product Showcase */}
        <div id="catalog-grid">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-semibold text-bento-text tracking-tight">
              {selectedCategory ? `${selectedCategory} Collection` : 'Trending Now'}
            </h2>
            {(selectedCategory || searchQuery) && (
              <div
                onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                className="text-[12px] font-medium text-bento-text hover:text-bento-text-muted cursor-pointer transition-colors flex items-center gap-1 font-['DM_Mono']"
              >
                Reset Filters <X className="h-3 w-3" />
              </div>
            )}
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 bg-bento-card border border-bento-border rounded-[12px] shadow-bento">
              <Loader2 className="h-6 w-6 animate-spin text-bento-text-muted" />
              <span className="text-[12px] text-bento-text-muted font-medium">Loading catalog...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 bg-bento-card border border-bento-border rounded-[12px] shadow-bento">
              <ShoppingBag className="h-8 w-8 text-bento-text-faint" />
              <span className="text-[13px] text-bento-text-muted font-medium">No products available at the moment.</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 bg-bento-card border border-bento-border rounded-[12px] shadow-bento text-center animate-fade-in">
              <ShoppingBag className="h-8 w-8 text-bento-text-faint" />
              <div>
                <p className="text-[13px] text-bento-text-muted font-medium">No products match your filters</p>
                <p className="text-[11px] text-bento-text-faint font-light mt-0.5">Try searching for something else or reset your filter query.</p>
              </div>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                className="mt-2 text-[11px] text-bento-text font-bold font-['DM_Mono'] border border-bento-border-light px-3 py-1 rounded-[6px] bg-bento-card-sunken shadow-bento hover:bg-bento-card-hover active:scale-95 transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <BentoGrid>
              {filteredProducts.map((product, index) => {
                // Make the first item take up 2 columns and 2 rows for a true bento feel
                const isHero = index === 0 && !selectedCategory && !searchQuery;
                
                return (
                  <BentoCard
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className={isHero ? 'md:col-span-2 md:row-span-2' : 'col-span-1'}
                    name={product.title}
                    description={product.description}
                    background={
                      <div className="relative w-full h-full bg-bento-card-sunken overflow-hidden shadow-bento-sunken">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0].url} 
                            alt={product.title} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100" 
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-bento-text-faint" />
                          </div>
                        )}
                        {/* Gradient overlay for better text readability on images */}
                        <div className="absolute inset-0 bg-gradient-to-t from-bento-card/90 via-bento-card/20 to-transparent pointer-events-none" />
                      </div>
                    }
                  >
                    {/* Add to Cart Actions & Price - Pass as children */}
                    <div className="flex items-center justify-between w-full gap-4">
                      <div className="bg-bento-card/90 backdrop-blur-md border border-bento-border px-3 py-1.5 rounded-[6px] shadow-bento">
                        <span className="text-[14px] font-bold text-bento-text font-['DM_Mono']">
                          {product.price?.currency || 'INR'} {product.price?.amount}
                        </span>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="flex-1 h-[36px] text-[12px] shadow-bento-btn pointer-events-auto"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </BentoCard>
                );
              })}
            </BentoGrid>
          )}
        </div>
      </main>

      {/* E-commerce Footer */}
      <footer className="border-t border-bento-border bg-bento-card py-8 shrink-0 mt-8 z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-[16px] font-bold tracking-tight text-bento-text select-none block mb-4">snitch.</span>
            <p className="text-[11px] text-bento-text-muted leading-relaxed font-light">
              Elevating everyday essentials through precision engineering and minimalist design philosophies.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-[12px] font-semibold text-bento-text uppercase tracking-wider">Shop</h4>
            <div className="flex flex-col gap-2 text-[12px] text-bento-text-muted">
              <span className="hover:text-bento-text cursor-pointer">Men</span>
              <span className="hover:text-bento-text cursor-pointer">Women</span>
              <span className="hover:text-bento-text cursor-pointer">New Arrivals</span>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-[12px] font-semibold text-bento-text uppercase tracking-wider">Support</h4>
            <div className="flex flex-col gap-2 text-[12px] text-bento-text-muted">
              <span className="hover:text-bento-text cursor-pointer">Contact Us</span>
              <span className="hover:text-bento-text cursor-pointer">Shipping & Returns</span>
              <span className="hover:text-bento-text cursor-pointer">Size Guide</span>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-[12px] font-semibold text-bento-text uppercase tracking-wider">Legal</h4>
            <div className="flex flex-col gap-2 text-[12px] text-bento-text-muted">
              <span className="hover:text-bento-text cursor-pointer">Privacy Policy</span>
              <span className="hover:text-bento-text cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-bento-border-light flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-['DM_Mono'] text-[10px] text-bento-text-faint select-none">
            &copy; 2026 snitch. all rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}