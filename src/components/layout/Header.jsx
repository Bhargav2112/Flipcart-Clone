import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Search, ShoppingCart, Heart, User, ChevronDown, Menu, X, Package, LogOut, LayoutDashboard, Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const init = async () => {
      const authed = await base44.auth.isAuthenticated();
      setIsAuthenticated(authed);
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
        const cartItems = await base44.entities.CartItem.filter({ user_email: me.email, saved_for_later: false });
        setCartCount(cartItems.length);
        const wishItems = await base44.entities.WishlistItem.filter({ user_email: me.email });
        setWishlistCount(wishItems.length);
      }
    };
    init();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = createPageUrl('Products') + `?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home & Furniture', slug: 'home-furniture' },
    { name: 'Appliances', slug: 'appliances' },
    { name: 'Mobiles', slug: 'mobiles' },
    { name: 'Beauty', slug: 'beauty' },
    { name: 'Grocery', slug: 'grocery' },
    { name: 'Toys', slug: 'toys' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#2874F0] shadow-md">
      {/* Main Header */}
      <div className="max-w-[1400px] mx-auto px-4 py-2.5">
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex-shrink-0">
            <div className="flex flex-col items-center">
              <span className="text-white text-xl font-bold italic tracking-tight">FlipKart</span>
              <span className="text-[10px] text-yellow-300 italic -mt-1 flex items-center gap-0.5">
                Explore <span className="text-yellow-400 font-semibold">Plus</span> ✦
              </span>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-[560px]">
            <div className="flex w-full bg-white rounded-sm overflow-hidden">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 text-sm text-gray-700 outline-none"
              />
              <button type="submit" className="px-4 text-[#2874F0] hover:bg-blue-50 transition-colors">
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Auth */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-white/10 gap-2 font-medium text-sm">
                    <User size={18} />
                    <span className="hidden sm:inline max-w-[100px] truncate">{user.full_name || 'Account'}</span>
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2">
                      <User size={16} /> My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl('Orders')} className="flex items-center gap-2">
                      <Package size={16} /> Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl('Wishlist')} className="flex items-center gap-2">
                      <Heart size={16} /> Wishlist
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'seller' && (
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('SellerDashboard')} className="flex items-center gap-2">
                        <Store size={16} /> Seller Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('AdminPanel')} className="flex items-center gap-2">
                        <LayoutDashboard size={16} /> Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => base44.auth.logout()} className="text-red-600">
                    <LogOut size={16} className="mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => base44.auth.redirectToLogin()}
                className="bg-white text-[#2874F0] hover:bg-gray-100 font-semibold text-sm h-8 px-8 rounded-sm"
              >
                Login
              </Button>
            )}

            {/* Cart */}
            <Link to={createPageUrl('Cart')} className="relative text-white hover:bg-white/10 p-2 rounded transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#FF6161] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="hidden sm:block text-xs font-medium mt-0.5">Cart</span>
            </Link>

            {/* Wishlist (desktop) */}
            <Link to={createPageUrl('Wishlist')} className="hidden md:flex relative text-white hover:bg-white/10 p-2 rounded transition-colors flex-col items-center">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#FF6161] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden mt-2">
          <div className="flex w-full bg-white rounded-sm overflow-hidden">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 text-sm text-gray-700 outline-none"
            />
            <button type="submit" className="px-3 text-[#2874F0]">
              <Search size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Categories Bar */}
      <div className="hidden lg:block bg-[#2874F0] border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center gap-8 py-1.5 overflow-x-auto">
            <Link
              to={createPageUrl('Home')}
              className="text-white text-xs font-bold uppercase whitespace-nowrap hover:text-yellow-300 transition-colors py-1"
            >
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={createPageUrl('Products') + `?category=${cat.slug}`}
                className="text-white text-xs font-medium whitespace-nowrap hover:text-yellow-300 transition-colors py-1"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white absolute w-full shadow-lg animate-fade-in max-h-[70vh] overflow-y-auto">
          <div className="p-4 space-y-1">
            <Link
              to={createPageUrl('Home')}
              className="block px-3 py-2.5 text-sm font-bold text-[#2874F0] hover:bg-blue-50 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={createPageUrl('Products') + `?category=${cat.slug}`}
                className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <div className="border-t my-2 pt-2">
              <Link to={createPageUrl('Contact')} className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
              <Link to={createPageUrl('About')} className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              <Link to={createPageUrl('Help')} className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded" onClick={() => setMobileMenuOpen(false)}>Help & Support</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}