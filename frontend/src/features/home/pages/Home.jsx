import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-primary flex flex-col font-['Geist']">
      {/* Header */}
      <header className="border-b border-[#1e1e1e] bg-[#0c0c0c]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-medium tracking-tight text-white select-none">snitch.</span>
            <span className="text-[10px] uppercase tracking-widest text-[#666666] border border-[#1e1e1e] px-1.5 py-0.5 rounded-[4px] bg-[#0f0f0f]">v1.0</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/login" className="text-[13px] text-[#666666] hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register">
              <Button className="h-[32px] px-3 text-[12px] bg-primary text-[#111111] hover:bg-[#f0f0f0]">
                Register
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 border border-[#1e1e1e] px-2.5 py-1 rounded-full bg-[#0f0f0f] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] text-[#666666] tracking-wider uppercase font-medium">Ecosystem Live</span>
          </div>
          
          <h1 className="text-[40px] md:text-[56px] font-light leading-none tracking-tight text-white mb-6">
            A secure protocol for premium trade.
          </h1>
          
          <p className="text-[15px] text-[#666666] leading-relaxed mb-8 max-w-lg font-light">
            Deploy your storefront, establish authenticated buyer connections, and experience developer-tool inspired commerce. Minimal, secure, and production-ready.
          </p>

          <div className="flex items-center gap-4">
            <Link to="/register">
              <Button className="h-[44px] px-6 text-[14px]">
                Create Account
              </Button>
            </Link>
            <Link to="/login" className="text-[14px] text-[#666666] hover:text-white transition-colors px-4 py-2">
              Sign in to your console
            </Link>
          </div>
        </div>

        {/* Dashboard Preview / Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <Card className="p-6">
            <CardContent className="p-0 space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-[#666666]">01 / Infrastructure</div>
              <h3 className="text-[18px] font-light text-white">Secure Protocols</h3>
              <p className="text-[13px] text-[#555555] leading-relaxed">
                Hardware-isolated credential storage with JWT session validation.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0 space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-[#666666]">02 / Performance</div>
              <h3 className="text-[18px] font-light text-white">Sub-millisecond Latency</h3>
              <p className="text-[13px] text-[#555555] leading-relaxed">
                Optimized endpoints designed to scale without connection overhead.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0 space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-[#666666]">03 / Dashboard</div>
              <h3 className="text-[18px] font-light text-white">Developer Console</h3>
              <p className="text-[13px] text-[#555555] leading-relaxed">
                A unified console for managing store keys, catalogs, and logs.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e1e] py-8 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-[#555555]">&copy; 2026 snitch. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[12px] text-[#555555] hover:text-white transition-colors">Documentation</a>
            <a href="#" className="text-[12px] text-[#555555] hover:text-white transition-colors">System Status</a>
            <a href="#" className="text-[12px] text-[#555555] hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
