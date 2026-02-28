import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const categories = [
  { name: 'Mobiles', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop', slug: 'mobiles' },
  { name: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop', slug: 'electronics' },
  { name: 'Fashion', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop', slug: 'fashion' },
  { name: 'Home', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop', slug: 'home-furniture' },
  { name: 'Appliances', img: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=100&h=100&fit=crop', slug: 'appliances' },
  { name: 'Beauty', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop', slug: 'beauty' },
  { name: 'Toys', img: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=100&h=100&fit=crop', slug: 'toys' },
  { name: 'Grocery', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop', slug: 'grocery' },
];

export default function CategoryStrip() {
  return (
    <div className="bg-white rounded-sm shadow-sm p-4">
      <div className="flex items-center justify-between overflow-x-auto gap-2 md:gap-0 scrollbar-hide">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={createPageUrl('Products') + `?category=${cat.slug}`}
            className="flex flex-col items-center gap-2 min-w-[80px] px-3 py-2 hover:text-[#2874F0] transition-colors group"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 group-hover:shadow-md transition-shadow">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-semibold text-center">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}