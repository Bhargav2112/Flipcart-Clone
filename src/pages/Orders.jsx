import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Package, Truck, CheckCircle2, XCircle, Clock, RotateCcw, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const statusConfig = {
  placed: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Order Placed' },
  confirmed: { icon: CheckCircle2, color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
  shipped: { icon: Truck, color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
  out_for_delivery: { icon: Truck, color: 'bg-indigo-100 text-indigo-800', label: 'Out for Delivery' },
  delivered: { icon: CheckCircle2, color: 'bg-green-100 text-green-800', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Cancelled' },
  returned: { icon: RotateCcw, color: 'bg-gray-100 text-gray-800', label: 'Returned' },
};

export default function Orders() {
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

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.email],
    queryFn: () => base44.entities.Order.filter({ user_email: user.email }, '-created_date', 50),
    enabled: !!user,
  });

  const cancelOrder = async (order) => {
    await base44.entities.Order.update(order.id, { status: 'cancelled' });
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    toast.success('Order cancelled');
  };

  if (isLoading) return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin text-[#2874F0]" size={40} /></div>;

  return (
    <div className="max-w-[1000px] mx-auto px-2 md:px-4 py-4">
      <div className="bg-white rounded-sm shadow-sm p-4 mb-3">
        <h1 className="text-lg font-bold">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-sm shadow-sm p-12 text-center">
          <Package size={64} className="text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-medium text-gray-600">No orders yet</h2>
          <Link to={createPageUrl('Home')}><Button className="mt-4 bg-[#2874F0]">Start Shopping</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const sc = statusConfig[order.status] || statusConfig.placed;
            const Icon = sc.icon;
            return (
              <div key={order.id} className="bg-white rounded-sm shadow-sm p-4 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs text-gray-500">Order #{order.order_number}</span>
                    <p className="text-xs text-gray-400">{new Date(order.created_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <Badge className={`${sc.color} gap-1`}><Icon size={12} /> {sc.label}</Badge>
                </div>

                {order.items?.map((item, i) => (
                  <div key={i} className="flex gap-3 py-2 border-t">
                    <img src={item.product_thumbnail || ''} alt="" className="w-16 h-16 object-contain rounded" />
                    <div className="flex-1">
                      <Link to={createPageUrl('ProductDetail') + `?id=${item.product_id}`} className="text-sm font-medium hover:text-[#2874F0]">{item.product_name}</Link>
                      <p className="text-sm text-gray-600 mt-0.5">₹{item.price?.toLocaleString()} × {item.quantity}</p>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="font-bold">Total: ₹{order.total?.toLocaleString()}</span>
                  <div className="flex gap-2">
                    {['placed', 'confirmed'].includes(order.status) && (
                      <Button variant="outline" size="sm" onClick={() => cancelOrder(order)} className="text-red-600 border-red-200 hover:bg-red-50">Cancel</Button>
                    )}
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm" className="gap-1"><RotateCcw size={14} /> Return</Button>
                    )}
                  </div>
                </div>

                {/* Tracking */}
                {!['cancelled', 'returned'].includes(order.status) && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-1 overflow-x-auto">
                      {['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'].map((s, i, arr) => {
                        const active = arr.indexOf(order.status) >= i;
                        return (
                          <React.Fragment key={s}>
                            <div className={`w-4 h-4 rounded-full flex-shrink-0 ${active ? 'bg-[#2874F0]' : 'bg-gray-200'}`} />
                            {i < arr.length - 1 && <div className={`flex-1 h-0.5 min-w-[20px] ${active ? 'bg-[#2874F0]' : 'bg-gray-200'}`} />}
                          </React.Fragment>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {order.estimated_delivery && `Estimated delivery: ${new Date(order.estimated_delivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}