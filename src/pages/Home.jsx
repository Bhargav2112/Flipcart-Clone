import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import BannerSlider from '../components/home/BannerSlider';
import CategoryStrip from '../components/home/CategoryStrip';
import ProductSection from '../components/home/ProductSection';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products-home'],
    queryFn: () => base44.entities.Product.filter({ status: 'approved' }, '-created_date', 300),
  });

  const deals = products.filter(p => p.is_deal).slice(0, 8);
  const featured = products.filter(p => p.is_featured).slice(0, 8);
  const bestsellers = products.filter(p => p.is_bestseller).slice(0, 8);
  const trending = products.filter(p => p.is_trending).slice(0, 8);

  const handleWishlistToggle = async (product) => {
    const authed = await base44.auth.isAuthenticated();
    if (!authed) {
      base44.auth.redirectToLogin();
      return;
    }
    const user = await base44.auth.me();
    const existing = await base44.entities.WishlistItem.filter({ user_email: user.email, product_id: product.id });
    if (existing.length > 0) {
      await base44.entities.WishlistItem.delete(existing[0].id);
      toast.success('Removed from wishlist');
    } else {
      await base44.entities.WishlistItem.create({
        product_id: product.id,
        product_name: product.name,
        product_thumbnail: product.thumbnail,
        product_price: product.price,
        product_original_price: product.original_price,
        user_email: user.email,
      });
      toast.success('Added to wishlist');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-[#2874F0]" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-2 md:px-4 py-3 space-y-3">
      <CategoryStrip />
      <BannerSlider />

      <ProductSection
        title="⚡ Deals of the Day"
        products={deals.length ? deals : products.slice(0, 8)}
        viewAllLink={createPageUrl('Products') + '?filter=deals'}
        onWishlistToggle={handleWishlistToggle}
      />

      <ProductSection
        title="Featured Products"
        products={featured.length ? featured : products.slice(0, 8)}
        viewAllLink={createPageUrl('Products') + '?filter=featured'}
        onWishlistToggle={handleWishlistToggle}
      />

      <ProductSection
        title="🏆 Best Sellers"
        products={bestsellers.length ? bestsellers : products.slice(0, 8)}
        viewAllLink={createPageUrl('Products') + '?filter=bestsellers'}
        onWishlistToggle={handleWishlistToggle}
      />

      <ProductSection
        title="🔥 Trending Now"
        products={trending.length ? trending : products.slice(0, 8)}
        viewAllLink={createPageUrl('Products') + '?filter=trending'}
        onWishlistToggle={handleWishlistToggle}
      />

      {/* Promo Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-sm p-6 text-white">
          <h3 className="text-xl font-bold mb-1">Become a Seller</h3>
          <p className="text-sm opacity-90 mb-3">Start selling on FlipKart and reach millions of customers</p>
          <button className="bg-white text-purple-700 px-4 py-1.5 rounded-sm text-sm font-semibold hover:bg-gray-100 transition-colors">Register Now</button>
        </div>
        <div className="bg-gradient-to-r from-[#FB641B] to-[#d14e0e] rounded-sm p-6 text-white">
          <h3 className="text-xl font-bold mb-1">FlipKart Plus</h3>
          <p className="text-sm opacity-90 mb-3">Free delivery, early access to sales & more benefits</p>
          <button className="bg-white text-orange-600 px-4 py-1.5 rounded-sm text-sm font-semibold hover:bg-gray-100 transition-colors">Know More</button>
        </div>
      </div>
    </div>
  );
}