import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from '../features/shared/components/Nav';
import { CartDrawer } from '../features/cart/components/CartDrawer';

export default function AppLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isInnerPage = location.pathname.startsWith('/product/') || location.pathname === '/cart';

  return (
    <div className="min-h-screen bg-bento-bg text-bento-text flex flex-col font-['Noto_Sans'] antialiased relative">
      <Nav
        showCategories={isHome}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        showSearch={isHome}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showBackToStore={isInnerPage}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
      />
      
      <Outlet context={{ searchQuery, selectedCategory, setSearchQuery, setSelectedCategory, setCartOpen }} />
      
      <CartDrawer cartOpen={cartOpen} setCartOpen={setCartOpen} />
    </div>
  );
}
