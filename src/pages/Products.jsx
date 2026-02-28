import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '../components/shared/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import { Loader2, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';

export default function Products() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const searchQ = urlParams.get('search') || '';
  const categoryQ = urlParams.get('category') || '';
  const filterQ = urlParams.get('filter') || '';

  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    categories: categoryQ ? [categoryQ] : [],
    brands: [],
    minRating: 0,
  });

  // Update filters when URL category changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      categories: categoryQ ? [categoryQ] : []
    }));
  }, [categoryQ]);
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid');
  const [visibleCount, setVisibleCount] = useState(24);

  // Reset pagination when filters, sort, or search change
  useEffect(() => {
    setVisibleCount(24);
  }, [searchQ, filterQ, filters, sortBy]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products-listing'],
    queryFn: () => base44.entities.Product.filter({ status: 'approved' }, '-created_date', 1000),
  });

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQ) {
      const q = searchQ.toLowerCase();
      result = result.filter(p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q));
    }

    // Special filters
    if (filterQ === 'deals') result = result.filter(p => p.is_deal);
    if (filterQ === 'featured') result = result.filter(p => p.is_featured);
    if (filterQ === 'bestsellers') result = result.filter(p => p.is_bestseller);
    if (filterQ === 'trending') result = result.filter(p => p.is_trending);

    // Price
    result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // Category
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // Brand
    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand));
    }

    // Rating
    if (filters.minRating > 0) {
      result = result.filter(p => (p.rating || 0) >= filters.minRating);
    }

    // Sort
    switch (sortBy) {
      case 'price_low': result.sort((a, b) => a.price - b.price); break;
      case 'price_high': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)); break;
      case 'rating': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: result.sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0)); break;
    }

    return result;
  }, [products, searchQ, filterQ, filters, sortBy]);

  const handleWishlistToggle = async (product) => {
    const authed = await base44.auth.isAuthenticated();
    if (!authed) { base44.auth.redirectToLogin(); return; }
    const user = await base44.auth.me();
    const existing = await base44.entities.WishlistItem.filter({ user_email: user.email, product_id: product.id });
    if (existing.length > 0) {
      await base44.entities.WishlistItem.delete(existing[0].id);
      toast.success('Removed from wishlist');
    } else {
      await base44.entities.WishlistItem.create({ product_id: product.id, product_name: product.name, product_thumbnail: product.thumbnail, product_price: product.price, product_original_price: product.original_price, user_email: user.email });
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-2 md:px-4 py-3">
      {/* Top Bar */}
      <div className="bg-white rounded-sm shadow-sm p-3 mb-3 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-base font-semibold text-gray-900">
            {searchQ ? `Results for "${searchQ}"` : filterQ ? filterQ.charAt(0).toUpperCase() + filterQ.slice(1) : 'All Products'}
          </h1>
          <p className="text-xs text-gray-500">{filteredProducts.length} products found</p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden gap-1.5">
                <SlidersHorizontal size={14} /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <ProductFilters filters={filters} setFilters={setFilters} />
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="rating">Customer Rating</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden sm:flex items-center border rounded overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-[#2874F0] text-white' : 'text-gray-400'}`}>
              <Grid3X3 size={16} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-[#2874F0] text-white' : 'text-gray-400'}`}>
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {/* Desktop Filters */}
        <div className="hidden lg:block w-[240px] flex-shrink-0">
          <div className="sticky top-[110px]">
            <ProductFilters filters={filters} setFilters={setFilters} />
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-[#2874F0]" size={36} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-sm shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2' : 'space-y-2'}>
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} onWishlistToggle={handleWishlistToggle} />
                ))}
              </div>
              
              {visibleCount < filteredProducts.length && (
                <div className="flex justify-center mt-6 pb-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setVisibleCount(v => v + 24)}
                    className="w-[200px] border-[#2874F0] text-[#2874F0] hover:bg-blue-50"
                  >
                    Load More Products
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}