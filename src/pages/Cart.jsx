import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Minus, Plus, Trash2, Tag, ShoppingBag, Loader2, ArrowRight, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function Cart() {
  const [user, setUser] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const init = async () => {
      const authed = await base44.auth.isAuthenticated();
      if (!authed) { base44.auth.redirectToLogin(); return; }
      setUser(await base44.auth.me());
    };
    init();
  }, []);

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart', user?.email],
    queryFn: () => base44.entities.CartItem.filter({ user_email: user.email, saved_for_later: false }),
    enabled: !!user,
  });

  const { data: savedItems = [] } = useQuery({
    queryKey: ['saved', user?.email],
    queryFn: () => base44.entities.CartItem.filter({ user_email: user.email, saved_for_later: true }),
    enabled: !!user,
  });

  const updateQuantity = async (item, delta) => {
    const newQty = (item.quantity || 1) + delta;
    if (newQty < 1) return;
    await base44.entities.CartItem.update(item.id, { quantity: newQty });
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  };

  const removeItem = async (item) => {
    await base44.entities.CartItem.delete(item.id);
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    toast.success('Item removed');
  };

  const saveForLater = async (item) => {
    await base44.entities.CartItem.update(item.id, { saved_for_later: true });
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    queryClient.invalidateQueries({ queryKey: ['saved'] });
    toast.success('Saved for later');
  };

  const moveToCart = async (item) => {
    await base44.entities.CartItem.update(item.id, { saved_for_later: false });
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    queryClient.invalidateQueries({ queryKey: ['saved'] });
    toast.success('Moved to cart');
  };

  const applyCoupon = async () => {
    const coupons = await base44.entities.Coupon.filter({ code: couponCode.toUpperCase(), is_active: true });
    if (coupons.length > 0 && subtotal >= (coupons[0].min_order_value || 0)) {
      setAppliedCoupon(coupons[0]);
      toast.success(`Coupon applied! ${coupons[0].discount_percent}% off`);
    } else {
      toast.error('Invalid or inapplicable coupon');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product_price || 0) * (item.quantity || 1), 0);
  const originalTotal = cartItems.reduce((sum, item) => sum + (item.product_original_price || item.product_price || 0) * (item.quantity || 1), 0);
  const discount = originalTotal - subtotal;
  const couponDiscount = appliedCoupon ? Math.min(subtotal * appliedCoupon.discount_percent / 100, appliedCoupon.max_discount || Infinity) : 0;
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal - couponDiscount + deliveryFee;

  if (isLoading) return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin text-[#2874F0]" size={40} /></div>;

  return (
    <div className="max-w-[1100px] mx-auto px-2 md:px-4 py-4">
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-sm shadow-sm p-12 text-center">
          <ShoppingBag size={80} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">Your cart is empty!</h2>
          <p className="text-sm text-gray-500 mb-4">Add items to it now.</p>
          <Link to={createPageUrl('Home')}>
            <Button className="bg-[#2874F0]">Shop Now</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Cart Items */}
          <div className="flex-1 space-y-3">
            <div className="bg-white rounded-sm shadow-sm p-4">
              <h2 className="font-semibold text-lg">My Cart ({cartItems.length})</h2>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-sm shadow-sm p-4 animate-fade-in">
                <div className="flex gap-4">
                  <Link to={createPageUrl('ProductDetail') + `?id=${item.product_id}`}>
                    <img src={item.product_thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120'} alt={item.product_name} className="w-24 h-24 object-contain rounded" />
                  </Link>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-800">{item.product_name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Seller: {item.seller_name || 'FlipKart'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold">₹{item.product_price?.toLocaleString()}</span>
                      {item.product_original_price > item.product_price && (
                        <span className="text-xs text-gray-500 line-through">₹{item.product_original_price?.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border rounded">
                        <button onClick={() => updateQuantity(item, -1)} className="p-1.5 hover:bg-gray-50"><Minus size={14} /></button>
                        <span className="px-3 text-sm font-medium border-x">{item.quantity || 1}</span>
                        <button onClick={() => updateQuantity(item, 1)} className="p-1.5 hover:bg-gray-50"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => saveForLater(item)} className="text-xs font-semibold text-[#2874F0] hover:underline">SAVE FOR LATER</button>
                      <button onClick={() => removeItem(item)} className="text-xs font-semibold text-gray-500 hover:text-red-600">REMOVE</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link to={createPageUrl('Checkout')} className="block">
              <Button className="w-full bg-[#FB641B] hover:bg-[#e55a15] h-12 text-base font-bold rounded-sm gap-2">
                PLACE ORDER <ArrowRight size={18} />
              </Button>
            </Link>
          </div>

          {/* Price Summary */}
          <div className="lg:w-[340px]">
            <div className="bg-white rounded-sm shadow-sm p-4 sticky top-[110px]">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Price Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Price ({cartItems.length} items)</span><span>₹{originalTotal.toLocaleString()}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>-₹{discount.toLocaleString()}</span></div>}
                {couponDiscount > 0 && <div className="flex justify-between text-green-700"><span>Coupon ({appliedCoupon.code})</span><span>-₹{couponDiscount.toLocaleString()}</span></div>}
                <div className="flex justify-between"><span>Delivery Charges</span><span className={deliveryFee === 0 ? 'text-green-700' : ''}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-base"><span>Total Amount</span><span>₹{total.toLocaleString()}</span></div>
                {discount > 0 && <p className="text-green-700 text-xs font-semibold">You will save ₹{(discount + couponDiscount).toLocaleString()} on this order</p>}
              </div>

              {/* Coupon */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter coupon code" className="h-8 text-xs" />
                  <Button onClick={applyCoupon} size="sm" variant="outline" className="text-[#2874F0] border-[#2874F0] text-xs">APPLY</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved For Later */}
      {savedItems.length > 0 && (
        <div className="mt-6 bg-white rounded-sm shadow-sm p-4">
          <h3 className="font-semibold mb-4">Saved For Later ({savedItems.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedItems.map((item) => (
              <div key={item.id} className="border rounded p-3 flex gap-3">
                <img src={item.product_thumbnail || ''} alt="" className="w-16 h-16 object-contain" />
                <div className="flex-1">
                  <h4 className="text-xs font-medium line-clamp-2">{item.product_name}</h4>
                  <p className="text-sm font-bold mt-1">₹{item.product_price?.toLocaleString()}</p>
                  <button onClick={() => moveToCart(item)} className="text-xs text-[#2874F0] font-semibold mt-1">MOVE TO CART</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}