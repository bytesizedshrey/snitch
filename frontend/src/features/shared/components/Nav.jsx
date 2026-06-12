import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hook/useAuth';
import { useCart } from '../../cart/hooks/useCart';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { ShoppingBag, Search, ArrowUpRight, ArrowLeft, X } from 'lucide-react';

export default function Nav({
  // Home page specific
  showCategories = false,
  selectedCategory = null,
  setSelectedCategory = () => {},
  showSearch = false,
  searchQuery = '',
  setSearchQuery = () => {},
  // Product details / other pages specific
  showBackToStore = false,
  // Cart toggle
  cartOpen,
  setCartOpen
}) {
  const { user, handleLogout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  const totalCartItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="border-b border-bento-border bg-bento-card/80 backdrop-blur-md sticky top-0 z-50 shadow-bento">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {showBackToStore ? (
            <div className="flex items-center gap-3">
              <Link to="/" className="text-[12px] text-bento-text-faint hover:text-bento-text transition-colors flex items-center gap-1.5 cursor-pointer">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Store
              </Link>
            </div>
          ) : (
            <span className="text-[18px] font-bold tracking-tight text-bento-text select-none">snitch.</span>
          )}
          
          {/* Interactive Category Navigation (Home only) */}
          {showCategories && (
            <div className="hidden md:flex items-center gap-4 text-[12px] font-medium text-bento-text-muted">
              {['Men', 'Women', 'Accessories', 'New Arrivals'].map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <span
                    key={cat}
                    onClick={() => setSelectedCategory(isActive ? null : cat)}
                    className={`hover:text-bento-text cursor-pointer px-2 py-0.5 rounded-[4px] border transition-all ${
                      isActive
                        ? 'bg-bento-card-sunken border-bento-border-light text-bento-text shadow-bento-sunken'
                        : 'border-transparent'
                    }`}
                  >
                    {cat}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        
        <nav className="flex items-center gap-4">
          {/* Search Toggle */}
          {showSearch && (
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
          )}

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
                    const res = await handleLogout();
                    if (res.success) {
                      navigate('/login');
                    }
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

      {/* Sliding Skeuomorphic Search Input */}
      {showSearch && searchOpen && (
        <div className="absolute top-16 left-0 right-0 border-b border-bento-border bg-bento-card/90 backdrop-blur-md px-6 py-3 shadow-bento z-40 transition-all flex items-center gap-3 animate-slide-up-fade">
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
  );
}
