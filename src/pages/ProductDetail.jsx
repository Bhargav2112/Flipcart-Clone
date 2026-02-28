import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Star, Heart, ShoppingCart, Zap, Truck, RotateCcw, ShieldCheck, ChevronRight, Loader2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StarRating from '../components/shared/StarRating';
import ProductSection from '../components/home/ProductSection';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => base44.entities.Product.filter({ id: productId }),
    select: (data) => data[0],
    enabled: !!productId,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => base44.entities.Review.filter({ product_id: productId }, '-created_date', 20),
    enabled: !!productId,
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?.category],
    queryFn: () => base44.entities.Product.filter({ category: product?.category, status: 'approved' }, '-rating', 8),
    enabled: !!product?.category,
  });

  const addToCart = async () => {
    const authed = await base44.auth.isAuthenticated();
    if (!authed) { base44.auth.redirectToLogin(); return; }
    const user = await base44.auth.me();
    const existing = await base44.entities.CartItem.filter({ user_email: user.email, product_id: product.id, saved_for_later: false });
    if (existing.length > 0) {
      await base44.entities.CartItem.update(existing[0].id, { quantity: (existing[0].quantity || 1) + 1 });
    } else {
      await base44.entities.CartItem.create({
        product_id: product.id, product_name: product.name, product_thumbnail: product.thumbnail || product.images?.[0],
        product_price: product.price, product_original_price: product.original_price, seller_name: product.seller_name,
        quantity: 1, user_email: user.email, saved_for_later: false,
      });
    }
    toast.success('Added to cart!');
  };

  const buyNow = async () => {
    await addToCart();
    window.location.href = createPageUrl('Cart');
  };

  const addToWishlist = async () => {
    const authed = await base44.auth.isAuthenticated();
    if (!authed) { base44.auth.redirectToLogin(); return; }
    const user = await base44.auth.me();
    await base44.entities.WishlistItem.create({
      product_id: product.id, product_name: product.name, product_thumbnail: product.thumbnail,
      product_price: product.price, product_original_price: product.original_price, user_email: user.email,
    });
    toast.success('Added to wishlist!');
  };

  const submitReview = async () => {
    const authed = await base44.auth.isAuthenticated();
    if (!authed) { base44.auth.redirectToLogin(); return; }
    const user = await base44.auth.me();
    await base44.entities.Review.create({
      product_id: product.id, user_email: user.email, user_name: user.full_name,
      rating: reviewRating, title: reviewTitle, comment: reviewComment, is_verified_purchase: true,
    });
    toast.success('Review submitted!');
    setReviewTitle(''); setReviewComment(''); setReviewRating(5);
  };

  if (isLoading) return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin text-[#2874F0]" size={40} /></div>;
  if (!product) return <div className="text-center py-20 text-gray-500">Product not found</div>;

  const images = product.images?.length ? product.images : [product.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'];
  const discountPercent = product.discount_percent || (product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0);
  const deliveryDate = new Date(Date.now() + (product.delivery_days || 5) * 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="max-w-[1400px] mx-auto px-2 md:px-4 py-3 space-y-3">
      <div className="bg-white rounded-sm shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6">
          {/* Images */}
          <div className="lg:w-[40%] lg:sticky lg:top-[110px] lg:self-start">
            <div className="flex gap-3">
              <div className="hidden sm:flex flex-col gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-14 h-14 border-2 rounded overflow-hidden flex-shrink-0 ${i === selectedImage ? 'border-[#2874F0]' : 'border-gray-200'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="flex-1 aspect-square flex items-center justify-center bg-white border rounded overflow-hidden relative">
                <img src={images[selectedImage]} alt={product.name} className="max-h-full max-w-full object-contain" />
                <button onClick={addToWishlist} className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:shadow-md">
                  <Heart size={20} className="text-gray-400 hover:text-red-500" />
                </button>
                <button className="absolute top-3 left-3 p-2 bg-white rounded-full shadow hover:shadow-md">
                  <Share2 size={18} className="text-gray-400" />
                </button>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={addToCart} className="flex-1 h-12 bg-[#FF9F00] hover:bg-[#e68f00] text-white font-bold rounded-sm text-base gap-2">
                <ShoppingCart size={20} /> ADD TO CART
              </Button>
              <Button onClick={buyNow} className="flex-1 h-12 bg-[#FB641B] hover:bg-[#e55a15] text-white font-bold rounded-sm text-base gap-2">
                <Zap size={20} /> BUY NOW
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="lg:w-[60%] space-y-4">
            <div>
              <p className="text-sm text-gray-500">{product.brand}</p>
              <h1 className="text-lg lg:text-xl font-medium text-gray-900 mt-1">{product.name}</h1>
              {product.rating > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 bg-green-700 text-white text-sm font-bold px-2 py-0.5 rounded">
                    {product.rating?.toFixed(1)} <Star size={12} fill="white" />
                  </span>
                  <span className="text-sm text-gray-500">({product.rating_count?.toLocaleString()} Ratings & {reviews.length} Reviews)</span>
                </div>
              )}
              <Badge variant="outline" className="mt-2 text-green-700 border-green-200 bg-green-50">Extra ₹{Math.round(product.price * 0.05)} off with bank offer</Badge>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
                {product.original_price > product.price && (
                  <>
                    <span className="text-base text-gray-500 line-through">₹{product.original_price?.toLocaleString()}</span>
                    <span className="text-base text-green-700 font-semibold">{discountPercent}% off</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
            </div>

            {/* Offers */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Available Offers</h3>
              {['Bank Offer: 10% off on HDFC Credit Card', 'Special Price: Extra ₹500 off on exchange', 'No cost EMI starting ₹{Math.round(product.price/6)}/month'].map((offer, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                  <Badge className="bg-green-700 text-white text-[10px] mt-0.5">Offer</Badge>
                  <span>{offer}</span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Delivery */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-sm">
                <Truck size={18} className="text-gray-500" />
                <span>Delivery by <strong>{deliveryDate}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw size={18} className="text-gray-500" />
                <span>7 day return policy</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck size={18} className="text-gray-500" />
                <span>1 Year Warranty</span>
              </div>
            </div>

            <Separator />

            {/* Seller */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Seller:</span>
              <span className="text-[#2874F0] font-medium">{product.seller_name || 'FlipKart Seller'}</span>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description || 'No description available.'}</p>
            </div>

            {/* Specifications */}
            {product.specifications?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Specifications</h3>
                <div className="bg-gray-50 rounded p-3">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="flex py-2 border-b last:border-0">
                      <span className="w-1/3 text-xs text-gray-500">{spec.key}</span>
                      <span className="text-xs text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Reviews */}
            <Tabs defaultValue="reviews">
              <TabsList>
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                <TabsTrigger value="write">Write a Review</TabsTrigger>
              </TabsList>
              <TabsContent value="reviews" className="space-y-3 mt-3">
                {reviews.length === 0 ? (
                  <p className="text-sm text-gray-500">No reviews yet. Be the first!</p>
                ) : reviews.map((r) => (
                  <div key={r.id} className="border-b pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-0.5 bg-green-700 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                        {r.rating} <Star size={10} fill="white" />
                      </span>
                      <span className="text-sm font-medium">{r.title}</span>
                    </div>
                    <p className="text-xs text-gray-600">{r.comment}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{r.user_name} · {new Date(r.created_date).toLocaleDateString()}</p>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="write" className="space-y-3 mt-3">
                <StarRating rating={reviewRating} interactive onChange={setReviewRating} />
                <input value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} placeholder="Review title" className="w-full border rounded px-3 py-2 text-sm" />
                <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Write your review..." className="w-full border rounded px-3 py-2 text-sm h-24" />
                <Button onClick={submitReview} className="bg-[#2874F0]">Submit Review</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <ProductSection title="Similar Products" products={relatedProducts.filter(p => p.id !== product?.id)} />
    </div>
  );
}