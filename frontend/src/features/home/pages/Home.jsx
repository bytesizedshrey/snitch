import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../auth/hook/useAuth';
import { getAllProducts } from '../../products/service/product.api';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { ArrowUpRight, ShoppingBag, Search, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';

const defaultFeatured = {
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products for homepage:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bento-bg text-bento-text flex flex-col font-['Noto_Sans'] antialiased">
      {/* E-commerce Header */}
      <header className="border-b border-bento-border bg-bento-card/80 backdrop-blur-md sticky top-0 z-50 shadow-[0_2px_15px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-[18px] font-bold tracking-tight text-bento-text select-none">snitch.</span>
            <div className="hidden md:flex items-center gap-4 text-[12px] font-medium text-bento-text-muted">
              <span className="hover:text-bento-text cursor-pointer transition-colors">Men</span>
              <span className="hover:text-bento-text cursor-pointer transition-colors">Women</span>
              <span className="hover:text-bento-text cursor-pointer transition-colors">Accessories</span>
              <span className="hover:text-bento-text cursor-pointer transition-colors">New Arrivals</span>
            </div>
          </div>
          
          <nav className="flex items-center gap-4">
            <button className="h-8 w-8 rounded-[6px] border border-bento-border bg-bento-card hover:bg-bento-card-hover shadow-bento-btn active:translate-y-[1px] active:shadow-bento-btn-active flex items-center justify-center text-bento-text transition-all cursor-pointer hidden md:flex">
              <Search className="h-4 w-4" />
            </button>
            <ThemeToggle />
            <button className="h-8 w-8 rounded-[6px] border border-bento-border bg-bento-card hover:bg-bento-card-hover shadow-bento-btn active:translate-y-[1px] active:shadow-bento-btn-active flex items-center justify-center text-bento-text transition-all cursor-pointer relative">
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border border-bento-border" />
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
      </header>

      {/* Main E-commerce Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full flex flex-col gap-8">
        
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
              <Button className="h-10 px-6 text-[12px] gap-2">
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
                  <div className="w-1/3 aspect-[3/4] bg-bento-card-sunken border border-bento-border-light rounded-[8px] shadow-bento-sunken overflow-hidden relative group">
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
                          <div className="pt-1 text-[11px] font-bold text-emerald-500 font-['DM_Mono']">
                            {featuredProduct.price?.currency || 'INR'} {featuredProduct.price?.amount}
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
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-semibold text-bento-text tracking-tight">Trending Now</h2>
            <div className="text-[12px] font-medium text-bento-text-muted hover:text-bento-text cursor-pointer transition-colors flex items-center gap-1">
              View All <ArrowUpRight className="h-3 w-3" />
            </div>
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => {
                // Make the first item take up 2 columns and 2 rows for a true bento feel
                const isHero = index === 0;
                
                return (
                  <div 
                    key={product._id} 
                    className={`bg-bento-card border border-bento-border rounded-[12px] overflow-hidden shadow-bento flex flex-col transition-all duration-300 group hover:-translate-y-1 hover:shadow-[12px_12px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[12px_12px_30px_rgba(0,0,0,0.9)] ${
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
                      
                      <Button variant="secondary" className="w-full h-[36px] text-[12px] shadow-bento-btn">
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
      <footer className="border-t border-bento-border bg-bento-card py-8 shrink-0 mt-8">
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
    </div>
  );
}