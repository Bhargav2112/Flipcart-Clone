import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, X } from 'lucide-react';

const BRANDS = ['Samsung', 'Apple', 'Nike', 'Sony', 'LG', 'Adidas', 'Puma', 'HP', 'Dell', 'Xiaomi'];
const CATEGORIES = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Home & Furniture', value: 'home-furniture' },
  { label: 'Appliances', value: 'appliances' },
  { label: 'Mobiles', value: 'mobiles' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Grocery', value: 'grocery' },
  { label: 'Toys', value: 'toys' },
];

export default function ProductFilters({ filters, setFilters, onClose }) {
  return (
    <div className="bg-white rounded-sm shadow-sm p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Filters</h3>
        {onClose && <button onClick={onClose}><X size={18} /></button>}
        <button onClick={() => setFilters({ priceRange: [0, 100000], categories: [], brands: [], minRating: 0 })} className="text-xs text-[#2874F0] font-semibold">CLEAR ALL</button>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase mb-3">Price</h4>
        <Slider
          min={0}
          max={100000}
          step={500}
          value={filters.priceRange || [0, 100000]}
          onValueChange={(val) => setFilters({ ...filters, priceRange: val })}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>₹{(filters.priceRange?.[0] || 0).toLocaleString()}</span>
          <span>₹{(filters.priceRange?.[1] || 100000).toLocaleString()}</span>
        </div>
      </div>

      {/* Category */}
      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase mb-3">Category</h4>
        <div className="space-y-2.5 max-h-40 overflow-y-auto">
          {CATEGORIES.map((cat) => (
            <label key={cat.value} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={filters.categories?.includes(cat.value)}
                onCheckedChange={(checked) => {
                  const cats = filters.categories || [];
                  setFilters({
                    ...filters,
                    categories: checked ? [...cats, cat.value] : cats.filter(c => c !== cat.value)
                  });
                }}
              />
              {cat.label}
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase mb-3">Brand</h4>
        <div className="space-y-2.5 max-h-40 overflow-y-auto">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={filters.brands?.includes(brand)}
                onCheckedChange={(checked) => {
                  const brands = filters.brands || [];
                  setFilters({
                    ...filters,
                    brands: checked ? [...brands, brand] : brands.filter(b => b !== brand)
                  });
                }}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase mb-3">Customer Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={filters.minRating === r}
                onCheckedChange={(checked) => setFilters({ ...filters, minRating: checked ? r : 0 })}
              />
              <div className="flex items-center gap-1">
                {r}<Star size={12} className="text-yellow-500 fill-yellow-500" />& above
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}