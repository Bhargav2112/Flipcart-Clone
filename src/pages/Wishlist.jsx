import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Wishlist() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const init = async () => {
      const authed = await base44.auth.isAuthenticated();
      if (!authed) { base44.auth.redirectToLogin(); return; }
      setUser(await base44.auth.me());
    };
    init();
  }, []);

  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ['wishlist', user?.email],
    queryFn: () => base44.entities.WishlistItem.filter({ user_email: user.email }),
    enabled: !!user,
  });

  const removeItem = async (item) => {
    await base44.entities.WishlistItem.delete(item.id);
    queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    toast.success('Removed from wishlist');
  };

  const moveToCart = async (item) => {
    await base44.entities.CartItem.create({
      product_id: item.product_id, product_name: item.product_name, product_thumbnail: item.product_thumbnail,
      product_price: item.product_price, product_original_price: item.product_original_price,
      quantity: 1, user_email: user.email, saved_for_later: false,
    });
    await base44.entities.WishlistItem.delete(item.id);
    queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    toast.success('Moved to cart!');
  };

  if (isLoading) return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin text-[#2874F0]" size={40} /></div>;

  return (
    <div className="max-w-[1000px] mx-auto px-2 md:px-4 py-4">
      <div className="bg-white rounded-sm shadow-sm p-4 mb-3">
        <h1 className="text-lg font-bold">My Wishlist ({wishlistItems.length})</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-sm shadow-sm p-12 text-center">
          <Heart size={64} className="text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-medium text-gray-600">Your wishlist is empty</h2>
          <p className="text-sm text-gray-400 mt-1">Save items you love to your wishlist</p>
          <Link to={createPageUrl('Home')}><Button className="mt-4 bg-[#2874F0]">Explore</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-sm shadow-sm p-4 animate-fade-in">
              <Link to={createPageUrl('ProductDetail') + `?id=${item.product_id}`}>
                <img src={item.product_thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'} alt={item.product_name} className="w-full h-40 object-contain mb-3" />
              </Link>
              <h3 className="text-sm font-medium line-clamp-2 mb-2">{item.product_name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold">₹{item.product_price?.toLocaleString()}</span>
                {item.product_original_price > item.product_price && (
                  <span className="text-xs text-gray-500 line-through">₹{item.product_original_price?.toLocaleString()}</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => moveToCart(item)} className="flex-1 bg-[#FF9F00] hover:bg-[#e68f00] gap-1" size="sm">
                  <ShoppingCart size={14} /> Move to Cart
                </Button>
                <Button onClick={() => removeItem(item)} variant="outline" size="sm">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}