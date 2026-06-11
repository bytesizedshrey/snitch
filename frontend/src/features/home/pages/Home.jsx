import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../auth/hook/useAuth';
import { getAllProducts } from '../../products/service/product.api';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { BiomorphicBackground } from '../../../components/BiomorphicBackground';
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
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Interactive Showcase States
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  // E-commerce States
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
  }, []);

  // Cart helper functions
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product._id === productId) {
            const nextQty = item.quantity + amount;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  const cartSubtotal = cart.reduce(
    (total, item) => total + parseFloat(item.product.price?.amount || 0) * item.quantity,
    0
  );

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
    <div className="min-h-screen bg-bento-bg text-bento-text flex flex-col font-['Noto_Sans'] antialiased relative">
      {/* Light Biomorphic Background (Storefront scope only) */}
      <BiomorphicBackground />

      {/* E-commerce Header */}
      <header className="border-b border-bento-border bg-bento-card/80 backdrop-blur-md sticky top-0 z-50 shadow-[0_2px_15px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-[18px] font-bold tracking-tight text-bento-text select-none">snitch.</span>
            
            {/* Interactive Category Navigation */}
            <div className="hidden md:flex items-center gap-4 text-[12px] font-medium text-bento-text-muted">
              {['Men', 'Women', 'Accessories', 'New Arrivals'].map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <span
                    key={cat}
                    onClick={() => setSelectedCategory(isActive ? null : cat)}
                    className={`hover:text-bento-text cursor-pointer px-2 py-0.5 rounded-[4px] border transition-all ${
                      isActive
                        ? 'bg-bento-card-sunken border-bento-border-light text-emerald-500 shadow-bento-sunken'
                        : 'border-transparent'
                    }`}
                  >
                    {cat}
                  </span>
                );
              })}
            </div>
          </div>
          
          <nav className="flex items-center gap-4">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`h-8 w-8 rounded-[6px] border transition-all cursor-pointer hidden md:flex items-center justify-center text-bento-text ${
                searchOpen
                  ? 'bg-bento-card-sunken border-bento-border-light shadow-bento-btn-active translate-y-[1px]'
                  : 'border-bento-border bg-bento-card hover:bg-bento-card-hover shadow-bento-btn active:translate-y-[1px] active:shadow-bento-btn-active'
              }`}
            >
              <Search className="h-4 w-4" />
            </button>

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
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-emerald-500 border border-bento-border flex items-center justify-center text-[9px] font-bold text-white font-['DM_Mono'] shadow-bento">
                  {totalCartItems}
                </span>
              )}
            </button>

            {user ? (
              user.role === 'seller' ? (
                <Link to="/seller/dashboard" className="text-[12px] text-emerald-500 hover:text-emerald-400 transition-colors tracking-wide font-medium flex items-center gap-1 cursor-pointer bg-emerald-500/10 px-2 py-1 rounded-[4px] border border-emerald-500/20 ml-2">
                  Console <ArrowUpRight className="h-3 w-3" />
                </Link>
              ) : (
                <span className="text-[12px] text-bento-text-muted tracking-wide font-light ml-2">
                  Hello, {user.fullname?.split(' ')[0]}
                </span>
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

        {/* Sliding Skeuomorphic Search Input */}
        {searchOpen && (
          <div className="absolute top-16 left-0 right-0 border-b border-bento-border bg-bento-card/90 backdrop-blur-md px-6 py-3 shadow-bento z-40 transition-all flex items-center gap-3 animate-fade-in">
            <Search className="h-4 w-4 text-bento-text-faint" />
            <input
              type="text"
              placeholder="Search catalog by title, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[12px] text-bento-text placeholder:text-bento-text-faint"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-bento-text-faint hover:text-bento-text cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            )}
            <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-[11px] font-semibold text-bento-text-faint hover:text-bento-text uppercase font-['DM_Mono'] cursor-pointer">
              Close
            </button>
          </div>
        )}
      </header>

      {/* Main E-commerce Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full flex flex-col gap-8 z-10">
        
        {/* Promotional Hero Banner (Embossed) */}
        <div className="w-full bg-bento-card border border-bento-border rounded-[16px] p-8 md:p-12 shadow-bento relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-bento-border pointer-events-none" />
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4 max-w-lg relative z-10">
            <div className="inline-flex items-center gap-2 border border-bento-border-light px-3 py-1 rounded-full bg-bento-card-sunken shadow-bento-sunken">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-[10px] text-bento-text-muted tracking-widest uppercase font-bold">
                Summer Collection 2026
              </span>
            </div>
            <h1 className="text-[32px] md:text-[48px] font-bold leading-[1.1] text-bento-text tracking-tight">
              Minimalist forms.<br/>Maximum utility.
            </h1>
            <p className="text-[14px] text-bento-text-muted leading-relaxed font-light max-w-md">
              Discover our curated selection of premium apparel. Engineered for everyday comfort without compromising on structural integrity.
            </p>
            <div className="pt-2">
              <Button
                onClick={() => {
                  document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-10 px-6 text-[12px] gap-2 cursor-pointer"
              >
                Shop Collection
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
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
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
                              ? 'bg-bento-card text-emerald-500 border-bento-border shadow-bento-btn'
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
                    onClick={() => setSelectedProduct(featuredProduct)}
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
                            <span className="text-[11px] font-bold text-emerald-500 font-['DM_Mono']">
                              {featuredProduct.price?.currency || 'INR'} {featuredProduct.price?.amount}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(featuredProduct);
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
                className="text-[12px] font-medium text-emerald-500 hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-1 font-['DM_Mono']"
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
                className="mt-2 text-[11px] text-emerald-500 font-bold font-['DM_Mono'] border border-emerald-500/20 px-3 py-1 rounded-[6px] bg-emerald-500/5 shadow-bento hover:bg-emerald-500/10 active:scale-95 transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => {
                // Make the first item take up 2 columns and 2 rows for a true bento feel
                const isHero = index === 0 && !selectedCategory && !searchQuery;
                
                return (
                  <div 
                    key={product._id} 
                    onClick={() => setSelectedProduct(product)}
                    className={`bg-bento-card border border-bento-border rounded-[12px] overflow-hidden shadow-bento flex flex-col transition-all duration-300 group hover:-translate-y-1 hover:shadow-[12px_12px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[12px_12px_30px_rgba(0,0,0,0.9)] cursor-pointer ${
                      isHero ? 'md:col-span-2 md:row-span-2' : 'col-span-1'
                    }`}
                  >
                    {/* Image container (Sunken) */}
                    <div className={`relative bg-bento-card-sunken overflow-hidden border-b border-bento-border shadow-bento-sunken ${
                      isHero ? 'aspect-[4/3] md:aspect-auto md:flex-1' : 'aspect-square'
                    }`}>
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0].url} 
                          alt={product.title} 
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-bento-text-faint" />
                        </div>
                      )}
                      
                      {/* Price Tag Overlay */}
                      <div className="absolute top-4 right-4 bg-bento-card/90 backdrop-blur-md border border-bento-border px-3 py-1 rounded-[6px] shadow-bento">
                        <span className="text-[12px] font-bold text-bento-text font-['DM_Mono']">
                          {product.price?.currency || 'INR'} {product.price?.amount}
                        </span>
                      </div>
                    </div>
                    
                    {/* Details and Action */}
                    <div className="p-5 flex flex-col justify-between gap-4 bg-bento-card">
                      <div>
                        <h3 className={`font-semibold text-bento-text tracking-tight ${isHero ? 'text-[20px] mb-2' : 'text-[14px] mb-1 truncate'}`}>
                          {product.title}
                        </h3>
                        <p className={`text-bento-text-muted font-light leading-relaxed ${isHero ? 'text-[13px] line-clamp-3' : 'text-[11px] line-clamp-2'}`}>
                          {product.description}
                        </p>
                      </div>
                      
                      <Button
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="w-full h-[36px] text-[12px] shadow-bento-btn"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
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

      {/* Skeuomorphic Cart Side Drawer */}
      {cartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity animate-fade-in"
            onClick={() => setCartOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-bento-card border-l border-bento-border p-6 shadow-[-10px_0_30px_rgba(0,0,0,0.25)] flex flex-col justify-between select-none animate-fade-in">
            <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-bento-border pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-bento-border-light pb-4 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-emerald-500" />
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
                        <p className="text-[10px] text-emerald-500 font-['DM_Mono'] font-bold">
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
                  <span className="text-emerald-500 font-bold">COMPLIMENTARY</span>
                </div>
              </div>
              
              <Button
                disabled={cart.length === 0}
                onClick={() => {
                  alert('Thank you for your order! Checkout simulated successfully.');
                  setCart([]);
                  setCartOpen(false);
                }}
                className="w-full h-11 text-[12px] uppercase font-semibold tracking-wider gap-2 shadow-bento-btn active:translate-y-[1px] active:shadow-bento-btn-active mt-2"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity animate-fade-in"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-bento-card border border-bento-border rounded-[16px] p-6 shadow-bento overflow-hidden flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-bento-border pointer-events-none" />
            
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 h-7 w-7 rounded-[6px] border border-bento-border bg-bento-card hover:bg-bento-card-hover shadow-bento-btn active:translate-y-[1px] active:shadow-bento-btn-active flex items-center justify-center text-bento-text-muted hover:text-bento-text cursor-pointer focus:outline-none transition-all z-20"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="w-full md:w-1/2 aspect-square bg-bento-card-sunken border border-bento-border-light rounded-[12px] shadow-bento-sunken overflow-hidden relative flex items-center justify-center">
              {selectedProduct.images?.[0]?.url ? (
                <img src={selectedProduct.images[0].url} alt={selectedProduct.title} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="h-12 w-12 text-bento-text-faint" />
              )}
              <div className="absolute bottom-4 right-4 bg-bento-card/90 backdrop-blur-md border border-bento-border px-3 py-1 rounded-[6px] shadow-bento">
                <span className="text-[13px] font-bold text-bento-text font-['DM_Mono']">
                  {selectedProduct.price?.currency || 'INR'} {selectedProduct.price?.amount}
                </span>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between py-2 text-left">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-widest font-['DM_Mono']">
                    {selectedProduct.category || 'IN STOCK'}
                  </span>
                  <h3 className="text-[20px] font-bold text-bento-text tracking-tight mt-1 leading-tight">
                    {selectedProduct.title}
                  </h3>
                </div>

                <p className="text-[12px] text-bento-text-muted leading-relaxed font-light">
                  {selectedProduct.description}
                </p>

                <div className="bg-bento-card-sunken border border-bento-border-light p-3 rounded-[8px] shadow-bento-sunken space-y-1.5 font-['DM_Mono'] text-[9px] text-bento-text-muted">
                  <div className="flex justify-between border-b border-bento-border-light/40 pb-1">
                    <span>MATERIAL</span>
                    <span className="text-bento-text">{selectedProduct.specs?.material || 'Premium Fabric Blend'}</span>
                  </div>
                  <div className="flex justify-between border-b border-bento-border-light/40 pb-1">
                    <span>WEIGHT</span>
                    <span className="text-bento-text">{selectedProduct.specs?.weight || 'Heavyweight Combed'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FIT</span>
                    <span className="text-bento-text">{selectedProduct.specs?.fit || 'Structured Fit'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-bento-border-light mt-6 flex gap-3">
                <Button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 h-11 text-[12px] uppercase font-semibold tracking-wider gap-2 shadow-bento-btn"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}