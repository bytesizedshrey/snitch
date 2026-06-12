import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId || "REF-XXXXXXXX";

  return (
    <div className="min-h-screen bg-bento-bg flex flex-col font-['Noto_Sans'] antialiased relative overflow-hidden">
      {/* Background depth layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-bento-border" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[140px] animate-drift" />
      </div>

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.018] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(var(--bento-border) 1px, transparent 1px), linear-gradient(90deg, var(--bento-border) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 pt-6 relative z-10 shrink-0">
        <span className="text-[20px] font-bold tracking-tight text-bento-text select-none">snitch.</span>
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-[420px] animate-slide-up-fade">
          
          <div className="bg-bento-card border border-bento-border rounded-[22px] shadow-bento p-8 relative overflow-hidden text-center">
            <div className="absolute top-0 left-4 right-4 h-[1px] bg-bento-border pointer-events-none" />
            
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                <div className="h-20 w-20 bg-bento-card-sunken border border-emerald-500/30 rounded-[16px] shadow-bento-sunken flex items-center justify-center relative z-10">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <div className="inline-flex items-center gap-1.5 border border-emerald-500/20 px-3 py-1 rounded-full bg-emerald-500/5 shadow-bento-sunken mb-2">
                <span className="text-[9px] text-emerald-500 tracking-widest uppercase font-bold font-['DM_Mono']">
                  Payment Verified
                </span>
              </div>
              <h2 className="text-[28px] font-bold tracking-tight text-bento-text leading-tight">
                Order Successful
              </h2>
              <p className="text-[13px] text-bento-text-muted font-light">
                Your order has been placed and is being processed.
              </p>
            </div>

            <div className="bg-bento-card-sunken border border-bento-border-light rounded-[12px] p-4 shadow-inner mb-8 text-left">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-[10px] text-bento-text-faint font-['DM_Mono'] uppercase tracking-wider">Order ID</span>
                <span className="text-[12px] text-bento-text font-bold font-['DM_Mono']">{orderId}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] text-bento-text-faint font-['DM_Mono'] uppercase tracking-wider">Status</span>
                <span className="text-[12px] text-emerald-400 font-bold font-['DM_Mono']">CONFIRMED</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="relative w-full h-[50px] rounded-[14px] bg-bento-text text-bento-bg text-[14px] font-bold tracking-wide overflow-hidden shadow-bento hover:opacity-95 active:translate-y-[2px] active:shadow-bento-btn-active transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
