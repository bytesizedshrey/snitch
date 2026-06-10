import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { useAuth } from '../../auth/hook/useAuth';
import { getAllProducts } from '../../products/service/product.api';
import { Sparkles, ArrowUpRight, Shield, Shirt, Layers, Package, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="h-screen bg-[#060606] text-white flex flex-col font-['Noto_Sans'] antialiased overflow-hidden">
      {/* Header */}
      <header className="border-b border-[#141414] bg-[#0c0c0c]/90 backdrop-blur-md sticky top-0 z-50 shadow-[0_2px_15px_rgba(0,0,0,0.6)] shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[16px] font-semibold tracking-tight text-white select-none">snitch.</span>
          </div>
          <nav className="flex items-center gap-6">
            {user ? (
              user.role === 'seller' ? (
                <Link to="/dashboard" className="text-[12px] text-emerald-500 hover:text-emerald-400 transition-colors tracking-wide font-medium flex items-center gap-1 cursor-pointer">
                  Console <ArrowUpRight className="h-3 w-3" />
                </Link>
              ) : (
                <span className="text-[12px] text-[#888888] tracking-wide font-light">
                  Hello, {user.fullname?.split(' ')[0]}
                </span>
              )
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-[12px] text-[#888888] hover:text-white transition-colors tracking-wide cursor-pointer">
                  Sign In
                </Link>
                <Link to="/register" className="text-[12px] text-[#888888] hover:text-white transition-colors tracking-wide cursor-pointer">
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Bento Grid Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-6 w-full flex flex-col gap-6 overflow-hidden h-[calc(100vh-4rem)]">
        
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 h-0 overflow-hidden pb-4">
          
          {/* Column 1: Info and Portal Cards */}
          <div className="flex flex-col gap-6 h-full justify-between">
            
            {/* Box 1: Brand Welcome Card (Embossed) */}
            <div className="bg-[#0c0c0c] border border-[#1b1b1b] rounded-[12px] p-6 shadow-[8px_8px_24px_rgba(0,0,0,0.85),-6px_-6px_24px_rgba(255,255,255,0.012)] relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 border border-[#1d1d1d] px-2.5 py-0.5 rounded-full bg-[#070707] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[8px] text-[#666] tracking-wider uppercase font-semibold">
                    Live System
                  </span>
                </div>
                <h2 className="text-[20px] font-light leading-snug text-white tracking-tight">
                  Product Catalog
                </h2>
                <p className="text-[12px] text-[#666] leading-relaxed font-light">
                  A premium collection of verified apparel. Fully integrated with secure user authentication and ImageKit media hosting.
                </p>
              </div>
            </div>

            {/* Box 2: Console Portal Card (Embossed) */}
            <div className="bg-[#0c0c0c] border border-[#1b1b1b] rounded-[12px] p-6 shadow-[8px_8px_24px_rgba(0,0,0,0.85),-6px_-6px_24px_rgba(255,255,255,0.012)] relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-wider text-[#666] font-semibold">Console Hub</span>
                  <Sparkles className="h-4 w-4 text-[#444]" />
                </div>
                <h3 className="text-[14px] font-normal text-white">
                  {user ? `Session Active: ${user.fullname?.split(' ')[0]}` : 'Console Access'}
                </h3>
                <p className="text-[12px] text-[#555] font-light leading-relaxed">
                  {user ? `Authenticated as a ${user.role}. Access catalog publishing controls.` : 'Log in or register to publish items and manage catalog metrics.'}
                </p>
              </div>

              <div className="mt-4">
                {user ? (
                  user.role === 'seller' ? (
                    <Link to="/dashboard" className="w-full block">
                      <Button className="w-full h-9 bg-gradient-to-b from-[#252525] to-[#121212] text-white border border-[#2e2e2e] hover:from-[#2a2a2a] hover:to-[#161616] shadow-[3px_3px_8px_rgba(0,0,0,0.5)] active:translate-y-[1px] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7)] transition-all cursor-pointer text-[12px] font-medium flex items-center justify-center gap-1.5">
                        Open Seller Hub <ArrowUpRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="text-center text-[11px] text-[#444] border border-[#1a1a1a] py-2 rounded bg-[#070707] font-['DM_Mono'] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]">
                      Standard Buyer Account
                    </div>
                  )
                ) : (
                  <Link to="/login" className="w-full block">
                    <Button className="w-full h-9 bg-gradient-to-b from-white to-[#e5e5e5] text-black font-semibold shadow-[3px_3px_8px_rgba(0,0,0,0.5)] active:translate-y-[1px] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2)] transition-all cursor-pointer text-[12px] flex items-center justify-center gap-1.5">
                      Sign In Now
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Box 3: Catalog Metrics Card (Embossed) */}
            <div className="bg-[#0c0c0c] border border-[#1b1b1b] rounded-[12px] p-6 shadow-[8px_8px_24px_rgba(0,0,0,0.85),-6px_-6px_24px_rgba(255,255,255,0.012)] relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
              
              <div className="space-y-3">
                <span className="text-[9px] uppercase tracking-wider text-[#666] font-semibold block">Catalog Records</span>
                
                {/* Sunken counter panel */}
                <div className="bg-[#070707] border border-[#181818] p-3 rounded-[6px] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),inset_-1px_-1px_3px_rgba(255,255,255,0.01)] text-center">
                  <span className="text-[9px] uppercase tracking-wider text-[#444] font-semibold block mb-0.5">Total Products</span>
                  <span className="text-[22px] font-light text-white font-['DM_Mono']">
                    {loading ? '...' : products.length}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Column 2 & 3: Scrollable Catalog Bento Box (Spans 2 columns, 1 row/full height) */}
          <div className="md:col-span-2 bg-[#0c0c0c] border border-[#1b1b1b] p-6 rounded-[12px] shadow-[8px_8px_24px_rgba(0,0,0,0.85),-6px_-6px_24px_rgba(255,255,255,0.012)] relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
            
            <h3 className="text-[13px] font-normal text-white mb-4 flex items-center gap-1.5 shrink-0 select-none">
              <Package className="h-4 w-4 text-[#444]" /> Catalog Listings
            </h3>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-[#444]" />
                <span className="text-[11px] text-[#555] tracking-wide">Syncing catalog items...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="flex-1 border border-[#181818] border-dashed rounded-[8px] p-6 text-center flex flex-col items-center justify-center gap-3 bg-[#070707]/30 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8)]">
                <Package className="h-8 w-8 text-[#222]" />
                <p className="text-[12px] text-[#555] font-light">No items have been listed in the database yet.</p>
              </div>
            ) : (
              /* Scrollable sub-grid of real products */
              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-2">
                {products.map((product) => (
                  <div 
                    key={product._id} 
                    className="bg-[#090909] border border-[#1a1a1a] rounded-[10px] overflow-hidden flex flex-col shadow-[4px_4px_16px_rgba(0,0,0,0.7)] hover:border-[#333333] transition-all duration-300 group"
                  >
                    {/* Image frame */}
                    <div className="relative aspect-[4/5] bg-black overflow-hidden flex items-center justify-center border-b border-[#141414] shadow-[inset_2px_2px_6px_rgba(0,0,0,0.9)]">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0].url} 
                          alt={product.title} 
                          className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500 ease-out" 
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-[#222]" />
                      )}
                      
                      {/* Price Tag Overlay */}
                      <div className="absolute bottom-3 left-3 bg-[#0a0a0a]/90 backdrop-blur-md border border-[#222] px-2.5 py-0.5 rounded-[4px] shadow-[2px_2px_6px_rgba(0,0,0,0.8)]">
                        <span className="text-[10px] font-semibold text-white/95 font-['DM_Mono']">
                          {product.price?.currency || 'INR'} {product.price?.amount}
                        </span>
                      </div>
                    </div>
                    
                    {/* Text Details */}
                    <div className="p-3.5 flex flex-col justify-between flex-1 gap-2">
                      <div className="space-y-1">
                        <h4 className="text-[12px] font-normal text-white group-hover:text-emerald-400 transition-colors truncate tracking-tight">
                          {product.title}
                        </h4>
                        <p className="text-[10px] text-[#555] line-clamp-2 font-light leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-[#141414] text-[9px] text-[#444] font-light">
                        <span className="uppercase tracking-wider font-semibold font-['DM_Mono'] text-[#333]">
                          Seller Profile
                        </span>
                        <span className="text-[#888] font-light">
                          {product.seller?.fullname?.split(' ')[0] || 'Store'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#141414] py-5 bg-[#0a0a0a] shrink-0">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <p className="font-['DM_Mono'] text-[10px] text-[#444] select-none">
            &copy; 2026 snitch. all rights reserved.
          </p>
          <div className="text-[10px] text-[#444] select-none font-['DM_Mono']">
            DEVELOPMENT MODE
          </div>
        </div>
      </footer>
    </div>
  );
}