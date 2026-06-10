import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { useAuth } from '../../auth/hook/useAuth';
import { Sparkles, ArrowUpRight, Shield, Shirt, Layers, HelpCircle } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#060606] text-white flex flex-col font-['Noto_Sans'] antialiased">
      {/* Header */}
      <header className="border-b border-[#141414] bg-[#0c0c0c]/90 backdrop-blur-md sticky top-0 z-50 shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[16px] font-semibold tracking-tight text-white select-none">snitch.</span>
            <span className="font-['DM_Mono'] text-[9px] uppercase tracking-widest text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded-[4px] bg-emerald-500/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              ss · 26
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/collections" className="text-[12px] text-[#888888] hover:text-white transition-colors tracking-wide">
              Collections
            </Link>
            <Link to="/lookbook" className="text-[12px] text-[#888888] hover:text-white transition-colors tracking-wide">
              Lookbook
            </Link>
            {user ? (
              user.role === 'seller' ? (
                <Link to="/dashboard" className="text-[12px] text-emerald-500 hover:text-emerald-400 transition-colors tracking-wide font-medium flex items-center gap-1">
                  Console <ArrowUpRight className="h-3 w-3" />
                </Link>
              ) : (
                <span className="text-[12px] text-[#888888] tracking-wide font-light">
                  Hello, {user.fullname?.split(' ')[0]}
                </span>
              )
            ) : (
              <Link to="/login" className="text-[12px] text-[#888888] hover:text-white transition-colors tracking-wide">
                Sign In
              </Link>
            )}
            <Link to="/shop">
              <Button className="h-[32px] px-4 text-[11px] bg-white text-black hover:bg-[#e0e0e0] font-semibold shadow-[2px_2px_6px_rgba(0,0,0,0.5)] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer">
                Shop Now
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Bento Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full space-y-6">
        
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px]">
          
          {/* Box 1: Hero Card (spans 2 columns, 2 rows) */}
          <div className="md:col-span-2 md:row-span-2 bg-[#0c0c0c] border border-[#1b1b1b] rounded-[12px] p-8 shadow-[8px_8px_24px_rgba(0,0,0,0.8),-4px_-4px_16px_rgba(255,255,255,0.01)] flex flex-col justify-between relative overflow-hidden group">
            {/* Top Light reflection */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 border border-[#1d1d1d] px-3 py-1 rounded-full bg-[#070707] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),inset_-1px_-1px_3px_rgba(255,255,255,0.01)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] text-[#666666] tracking-wider uppercase font-semibold">
                  New Drop Live
                </span>
              </div>
              <h1 className="text-[36px] sm:text-[46px] font-light leading-none tracking-tight text-white max-w-md">
                Minimal cuts. <span className="text-[#555555]">Maximum signal.</span>
              </h1>
              <p className="text-[13px] text-[#666666] leading-relaxed max-w-[400px] font-light">
                Precision-crafted pieces for the intentional wardrobe. No noise, no excess — just clean silhouettes built to last and designed to say something.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Link to="/shop">
                <Button className="h-11 px-6 bg-white text-black hover:bg-[#e0e0e0] font-semibold shadow-[4px_4px_10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-[1px] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2)] transition-all cursor-pointer">
                  Explore the Drop
                </Button>
              </Link>
              <Link
                to="/lookbook"
                className="h-10 px-5 text-[12px] text-[#888888] hover:text-white transition-colors bg-gradient-to-b from-[#1b1b1b] to-[#0f0f0f] border border-[#262626] shadow-[3px_3px_8px_rgba(0,0,0,0.5)] active:translate-y-[1px] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7)] rounded-[6px] flex items-center gap-1"
              >
                View Lookbook
              </Link>
            </div>
          </div>

          {/* Box 2: Active console or user profile CTA (1 col, 1 row) */}
          <div className="bg-[#0c0c0c] border border-[#1b1b1b] rounded-[12px] p-6 shadow-[8px_8px_24px_rgba(0,0,0,0.8),-4px_-4px_16px_rgba(255,255,255,0.01)] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-[#666666] font-semibold">User Console</span>
                <Sparkles className="h-4 w-4 text-[#444444]" />
              </div>
              <h3 className="text-[16px] font-normal text-white">
                {user ? `Welcome back, ${user.fullname?.split(' ')[0]}` : 'Access your console'}
              </h3>
              <p className="text-[12px] text-[#555555] font-light leading-relaxed">
                {user ? `Role: ${user.role === 'seller' ? 'Seller Hub' : 'Buyer Console'}` : 'Sign in to access your inventory and orders.'}
              </p>
            </div>

            <div>
              {user ? (
                user.role === 'seller' ? (
                  <Link to="/dashboard" className="w-full">
                    <Button className="w-full h-9 bg-gradient-to-b from-[#252525] to-[#121212] text-white border border-[#2e2e2e] hover:from-[#2a2a2a] hover:to-[#161616] shadow-[3px_3px_8px_rgba(0,0,0,0.5)] active:translate-y-[1px] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7)] transition-all cursor-pointer text-[12px] font-medium flex items-center justify-center gap-1.5">
                      Go to Dashboard <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/shop" className="w-full">
                    <Button className="w-full h-9 bg-gradient-to-b from-[#252525] to-[#121212] text-white border border-[#2e2e2e] hover:from-[#2a2a2a] hover:to-[#161616] shadow-[3px_3px_8px_rgba(0,0,0,0.5)] active:translate-y-[1px] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7)] transition-all cursor-pointer text-[12px] font-medium flex items-center justify-center gap-1.5">
                      Browse Shop
                    </Button>
                  </Link>
                )
              ) : (
                <Link to="/login" className="w-full">
                  <Button className="w-full h-9 bg-gradient-to-b from-white to-[#e5e5e5] text-black font-semibold shadow-[3px_3px_8px_rgba(0,0,0,0.5)] active:translate-y-[1px] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2)] transition-all cursor-pointer text-[12px] flex items-center justify-center gap-1.5">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Box 3: Quick lookbook promotion (1 col, 1 row) */}
          <div className="bg-[#0c0c0c] border border-[#1b1b1b] rounded-[12px] p-6 shadow-[8px_8px_24px_rgba(0,0,0,0.8),-4px_-4px_16px_rgba(255,255,255,0.01)] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
            
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#666666] font-semibold">Seasonal Look</span>
              <h3 className="text-[15px] font-normal text-white">Summer Collection</h3>
              <p className="text-[12px] text-[#555555] leading-relaxed font-light">
                Discover clean, structural aesthetics in lightweight linens and structured poplin.
              </p>
            </div>

            <Link to="/lookbook" className="text-[11px] text-white/70 hover:text-white transition-colors flex items-center gap-1 select-none font-semibold cursor-pointer">
              Explore looks <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

        </div>

        {/* Ticker Strip (tactile sunken design) */}
        <div className="border border-[#181818] rounded-[8px] bg-[#070707] py-3.5 overflow-hidden relative shadow-[inset_3px_3px_8px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(255,255,255,0.01)]">
          <div className="flex gap-0 whitespace-nowrap animate-[ticker_22s_linear_infinite]">
            {[
              'Free shipping on orders above ₹999',
              'SS26 collection now live',
              '30-day returns · zero questions',
              'Organic cotton · responsible supply chain',
              'New: oversized silhouette series',
            ].concat([
              'Free shipping on orders above ₹999',
              'SS26 collection now live',
              '30-day returns · zero questions',
              'Organic cotton · responsible supply chain',
              'New: oversized silhouette series',
            ]).map((item, i) => (
              <span
                key={i}
                className="font-['DM_Mono'] text-[9px] uppercase tracking-[0.15em] text-[#555555] px-7"
              >
                <span className="text-[#3f3f3f] mr-2.5">—</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Feature Bento Grid (Grid of 3 columns, equal heights) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Sourcing */}
          <div className="bg-[#0c0c0c] border border-[#1b1b1b] rounded-[12px] p-6 shadow-[8px_8px_24px_rgba(0,0,0,0.8),-4px_-4px_16px_rgba(255,255,255,0.01)] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-['DM_Mono'] text-[9px] uppercase tracking-[0.15em] text-[#555555]">
                  01 / Sourcing
                </span>
                <Shirt className="h-4 w-4 text-[#444444]" />
              </div>
              <h3 className="text-[16px] font-normal text-white tracking-tight">
                Responsible Fabrics
              </h3>
              <p className="text-[12px] text-[#666666] leading-relaxed font-light">
                Organic cotton, recycled threads. Every piece traced back to its origin — because what it's made from matters as much as how it looks.
              </p>
            </div>
            <div className="pt-4">
              <span className="inline-block font-['DM_Mono'] text-[9px] uppercase tracking-[0.1em] text-[#555555] border border-[#1b1b1b] px-2 py-1 rounded-[3px] bg-[#070707] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]">
                GOTS Certified
              </span>
            </div>
          </div>

          {/* Card 2: Construction */}
          <div className="bg-[#0c0c0c] border border-[#1b1b1b] rounded-[12px] p-6 shadow-[8px_8px_24px_rgba(0,0,0,0.8),-4px_-4px_16px_rgba(255,255,255,0.01)] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-['DM_Mono'] text-[9px] uppercase tracking-[0.15em] text-[#555555]">
                  02 / Construction
                </span>
                <Layers className="h-4 w-4 text-[#444444]" />
              </div>
              <h3 className="text-[16px] font-normal text-white tracking-tight">
                Built Different
              </h3>
              <p className="text-[12px] text-[#666666] leading-relaxed font-light">
                Double-stitched seams, pre-washed for shape retention. Engineered to hold structure wash after wash, season after season.
              </p>
            </div>
            <div className="pt-4">
              <span className="inline-block font-['DM_Mono'] text-[9px] uppercase tracking-[0.1em] text-[#555555] border border-[#1b1b1b] px-2 py-1 rounded-[3px] bg-[#070707] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]">
                100+ wash tested
              </span>
            </div>
          </div>

          {/* Card 3: Sizing */}
          <div className="bg-[#0c0c0c] border border-[#1b1b1b] rounded-[12px] p-6 shadow-[8px_8px_24px_rgba(0,0,0,0.8),-4px_-4px_16px_rgba(255,255,255,0.01)] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-['DM_Mono'] text-[9px] uppercase tracking-[0.15em] text-[#555555]">
                  03 / Sizing
                </span>
                <Shield className="h-4 w-4 text-[#444444]" />
              </div>
              <h3 className="text-[16px] font-normal text-white tracking-tight">
                Inclusive Fit Range
              </h3>
              <p className="text-[12px] text-[#666666] leading-relaxed font-light">
                XS to 4XL across all categories. No gatekeeping — the full range ships at the same price, same quality, same speed.
              </p>
            </div>
            <div className="pt-4">
              <span className="inline-block font-['DM_Mono'] text-[9px] uppercase tracking-[0.1em] text-[#555555] border border-[#1b1b1b] px-2 py-1 rounded-[3px] bg-[#070707] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]">
                XS – 4XL
              </span>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#141414] py-8 bg-[#0a0a0a] mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-['DM_Mono'] text-[11px] text-[#555555] select-none">
            &copy; 2026 snitch. all rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[11px] text-[#555555] hover:text-white transition-colors">
              Size Guide
            </a>
            <a href="#" className="text-[11px] text-[#555555] hover:text-white transition-colors">
              Sustainability
            </a>
            <a href="#" className="text-[11px] text-[#555555] hover:text-white transition-colors">
              Returns Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}