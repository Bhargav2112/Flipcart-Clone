import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  {
    title: 'Big Billion Days',
    subtitle: 'Up to 80% Off on Electronics',
    bg: 'from-[#2874F0] to-[#1a4fc0]',
    img: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop'
  },
  {
    title: 'Fashion Sale',
    subtitle: 'Min 50% Off on Top Brands',
    bg: 'from-[#FB641B] to-[#d14e0e]',
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop'
  },
  {
    title: 'Home Makeover',
    subtitle: 'Furniture & Decor from ₹199',
    bg: 'from-[#388E3C] to-[#2d7230]',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop'
  },
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-sm shadow-sm">
      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {banners.map((b, i) => (
          <div key={i} className={`min-w-full bg-gradient-to-r ${b.bg} flex items-center`}>
            <div className="flex items-center justify-between w-full px-6 md:px-16 py-8 md:py-14">
              <div className="text-white max-w-md">
                <h2 className="text-2xl md:text-4xl font-bold mb-2">{b.title}</h2>
                <p className="text-base md:text-lg opacity-90">{b.subtitle}</p>
                <button className="mt-4 bg-white text-gray-900 px-6 py-2 rounded-sm font-semibold text-sm hover:bg-gray-100 transition-colors">
                  Shop Now
                </button>
              </div>
              <img src={b.img} alt={b.title} className="hidden md:block h-40 lg:h-52 rounded-lg object-cover shadow-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button onClick={() => setCurrent(p => (p - 1 + banners.length) % banners.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-colors">
        <ChevronLeft size={20} />
      </button>
      <button onClick={() => setCurrent(p => (p + 1) % banners.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-colors">
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-5' : 'bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
}