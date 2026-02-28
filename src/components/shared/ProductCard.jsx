import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Star, Heart } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ProductCard({ product, onWishlistToggle }) {
  const discountPercent = product.discount_percent || (product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onWishlistToggle) onWishlistToggle(product);
  };

  return (
    <Link to={createPageUrl('ProductDetail') + `?id=${product.id}`} className="block">
      <div className="product-card bg-white rounded-sm p-3 cursor-pointer group relative h-full flex flex-col">
        {/* Wishlist */}
        <button onClick={handleWishlist} className="absolute top-3 right-3 z-10 p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all">
          <Heart size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
        </button>

        {/* Image */}
        <div className="aspect-square flex items-center justify-center mb-3 overflow-hidden">
          <img
            src={product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-sm text-gray-800 font-medium line-clamp-2 mb-1 group-hover:text-[#2874F0] transition-colors">{product.name}</h3>
          
          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="inline-flex items-center gap-0.5 bg-green-700 text-white text-[11px] font-semibold px-1.5 py-0.5 rounded-sm">
                {product.rating?.toFixed(1)} <Star size={9} fill="white" />
              </span>
              <span className="text-xs text-gray-500">({product.rating_count || 0})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap mt-auto">
            <span className="text-base font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
            {product.original_price > product.price && (
              <>
                <span className="text-xs text-gray-500 line-through">₹{product.original_price?.toLocaleString()}</span>
                <span className="text-xs text-green-700 font-semibold">{discountPercent}% off</span>
              </>
            )}
          </div>

          {/* Delivery */}
          {product.delivery_days && (
            <p className="text-[11px] text-gray-500 mt-1.5">
              Free delivery by <span className="font-medium text-gray-700">{new Date(Date.now() + product.delivery_days * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </p>
          )}
        </div>

        {/* Badges */}
        {(product.is_deal || product.is_bestseller) && (
          <div className="absolute top-0 left-0">
            {product.is_deal && <span className="bg-[#FB641B] text-white text-[10px] font-bold px-2 py-0.5 rounded-br">DEAL</span>}
            {product.is_bestseller && !product.is_deal && <span className="bg-[#2874F0] text-white text-[10px] font-bold px-2 py-0.5 rounded-br">BESTSELLER</span>}
          </div>
        )}
      </div>
    </Link>
  );
}