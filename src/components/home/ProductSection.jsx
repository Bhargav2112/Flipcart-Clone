import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ProductCard from '../shared/ProductCard';

export default function ProductSection({ title, products, viewAllLink, onWishlistToggle }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 260, behavior: 'smooth' });
    }
  };

  if (!products?.length) return null;

  return (
    <div className="bg-white rounded-sm shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {viewAllLink && (
          <Link to={viewAllLink} className="bg-[#2874F0] text-white text-sm font-medium px-5 py-1.5 rounded-sm hover:bg-[#1a5dc8] transition-colors">
            VIEW ALL
          </Link>
        )}
      </div>

      <div className="relative group">
        <button onClick={() => scroll(-1)} className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50">
          <ChevronLeft size={20} />
        </button>

        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {products.map((product) => (
            <div key={product.id} className="min-w-[180px] max-w-[200px] flex-shrink-0">
              <ProductCard product={product} onWishlistToggle={onWishlistToggle} />
            </div>
          ))}
        </div>

        <button onClick={() => scroll(1)} className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}