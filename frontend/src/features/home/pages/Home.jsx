import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-primary flex flex-col font-['DM_Sans']">
      {/* Header */}
      <header className="border-b border-[#1e1e1e] bg-[#0c0c0c]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-medium tracking-tight text-white select-none">snitch.</span>
            <span className="font-['DM_Mono'] text-[9px] uppercase tracking-widest text-[#555555] border border-[#1e1e1e] px-1.5 py-0.5 rounded-[4px] bg-[#0f0f0f]">
              ss · 26
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/collections" className="text-[12px] text-[#555555] hover:text-white transition-colors tracking-wide">
              Collections
            </Link>
            <Link to="/lookbook" className="text-[12px] text-[#555555] hover:text-white transition-colors tracking-wide">
              Lookbook
            </Link>
            <Link to="/login" className="text-[12px] text-[#555555] hover:text-white transition-colors tracking-wide">
              Sign In
            </Link>
            <Link to="/shop">
              <Button className="h-[30px] px-3 text-[11px] bg-primary text-[#111111] hover:bg-[#e0e0e0]">
                Shop Now
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full flex flex-col justify-center">
        <div className="max-w-[560px]">
          <div className="inline-flex items-center gap-2 border border-[#1e1e1e] px-2.5 py-1 rounded-full bg-[#0f0f0f] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-['DM_Mono'] text-[10px] text-[#555555] tracking-wider uppercase font-medium">
              New Drop Live
            </span>
          </div>

          <h1 className="text-[40px] md:text-[52px] font-light leading-none tracking-tight text-white mb-6">
            Minimal cuts.{' '}
            <span className="text-[#444444]">Maximum signal.</span>
          </h1>

          <p className="text-[14px] text-[#555555] leading-relaxed mb-8 max-w-[420px] font-light">
            Precision-crafted pieces for the intentional wardrobe. No noise, no excess — just clean silhouettes built to last and designed to say something.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <Link to="/shop">
              <Button className="h-[42px] px-6 text-[13px]">
                Explore the Drop
              </Button>
            </Link>
            <Link
              to="/lookbook"
              className="h-[40px] px-5 text-[13px] text-[#666666] hover:text-white transition-colors border border-[#2a2a2a] hover:border-[#444444] rounded-[5px] flex items-center"
            >
              View Lookbook
            </Link>
          </div>
        </div>

        {/* Ticker Strip */}
        <div className="border-t border-b border-[#1a1a1a] py-2.5 mt-12 overflow-hidden relative">
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
                className="font-['DM_Mono'] text-[10px] uppercase tracking-[0.12em] text-[#333333] px-7"
              >
                <span className="text-[#3f3f3f] mr-2.5">—</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
          <Card className="p-6 bg-[#0d0d0d] border-[#1a1a1a] hover:border-[#2e2e2e] transition-colors">
            <CardContent className="p-0 space-y-3">
              <div className="font-['DM_Mono'] text-[9px] uppercase tracking-[0.15em] text-[#3a3a3a]">
                01 / Sourcing
              </div>
              <h3 className="text-[16px] font-light text-[#e0e0e0] tracking-tight">
                Responsible Fabrics
              </h3>
              <p className="text-[12px] text-[#444444] leading-relaxed">
                Organic cotton, recycled threads. Every piece traced back to its origin — because what it's made from matters as much as how it looks.
              </p>
              <span className="inline-block font-['DM_Mono'] text-[9px] uppercase tracking-[0.1em] text-[#2d2d2d] border border-[#1e1e1e] px-2 py-1 rounded-[3px]">
                GOTS Certified
              </span>
            </CardContent>
          </Card>

          <Card className="p-6 bg-[#0d0d0d] border-[#1a1a1a] hover:border-[#2e2e2e] transition-colors">
            <CardContent className="p-0 space-y-3">
              <div className="font-['DM_Mono'] text-[9px] uppercase tracking-[0.15em] text-[#3a3a3a]">
                02 / Construction
              </div>
              <h3 className="text-[16px] font-light text-[#e0e0e0] tracking-tight">
                Built Different
              </h3>
              <p className="text-[12px] text-[#444444] leading-relaxed">
                Double-stitched seams, pre-washed for shape retention. Engineered to hold structure wash after wash, season after season.
              </p>
              <span className="inline-block font-['DM_Mono'] text-[9px] uppercase tracking-[0.1em] text-[#2d2d2d] border border-[#1e1e1e] px-2 py-1 rounded-[3px]">
                100+ wash tested
              </span>
            </CardContent>
          </Card>

          <Card className="p-6 bg-[#0d0d0d] border-[#1a1a1a] hover:border-[#2e2e2e] transition-colors">
            <CardContent className="p-0 space-y-3">
              <div className="font-['DM_Mono'] text-[9px] uppercase tracking-[0.15em] text-[#3a3a3a]">
                03 / Sizing
              </div>
              <h3 className="text-[16px] font-light text-[#e0e0e0] tracking-tight">
                Inclusive Fit Range
              </h3>
              <p className="text-[12px] text-[#444444] leading-relaxed">
                XS to 4XL across all categories. No gatekeeping — the full range ships at the same price, same quality, same speed.
              </p>
              <span className="inline-block font-['DM_Mono'] text-[9px] uppercase tracking-[0.1em] text-[#2d2d2d] border border-[#1e1e1e] px-2 py-1 rounded-[3px]">
                XS – 4XL
              </span>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-7 bg-[#0a0a0a] mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-['DM_Mono'] text-[11px] text-[#333333]">
            &copy; 2026 snitch. all rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[11px] text-[#333333] hover:text-[#aaaaaa] transition-colors">
              Size Guide
            </a>
            <a href="#" className="text-[11px] text-[#333333] hover:text-[#aaaaaa] transition-colors">
              Sustainability
            </a>
            <a href="#" className="text-[11px] text-[#333333] hover:text-[#aaaaaa] transition-colors">
              Returns Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}