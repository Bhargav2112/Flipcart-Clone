import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User, Package, Heart, MapPin, CreditCard, LogOut, Loader2, ChevronRight, Phone, Mail, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const init = async () => {
      const authed = await base44.auth.isAuthenticated();
      if (!authed) { base44.auth.redirectToLogin(); return; }
      const me = await base44.auth.me();
      setUser(me);
      setPhone(me.phone || '');
    };
    init();
  }, []);

  const { data: orders = [] } = useQuery({
    queryKey: ['dash-orders', user?.email],
    queryFn: () => base44.entities.Order.filter({ user_email: user.email }, '-created_date', 5),
    enabled: !!user,
  });

  const { data: wishlistItems = [] } = useQuery({
    queryKey: ['dash-wishlist', user?.email],
    queryFn: () => base44.entities.WishlistItem.filter({ user_email: user.email }),
    enabled: !!user,
  });

  const saveProfile = async () => {
    await base44.auth.updateMe({ phone });
    toast.success('Profile updated');
    setEditing(false);
  };

  if (!user) return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin text-[#2874F0]" size={40} /></div>;

  const menuItems = [
    { icon: Package, label: 'My Orders', count: orders.length, page: 'Orders' },
    { icon: Heart, label: 'Wishlist', count: wishlistItems.length, page: 'Wishlist' },
    { icon: MapPin, label: 'Manage Addresses', page: 'Checkout' },
  ];

  return (
    <div className="max-w-[1000px] mx-auto px-2 md:px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="shadow-sm rounded-sm">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-[#2874F0] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl font-bold">{user.full_name?.[0]?.toUpperCase() || 'U'}</span>
              </div>
              <h2 className="text-lg font-bold">{user.full_name}</h2>
              <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-1">
                <Mail size={14} /> {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-1">
                  <Phone size={14} /> {user.phone}
                </div>
              )}

              <div className="mt-4 space-y-2">
                {menuItems.map((item) => (
                  <Link key={item.label} to={createPageUrl(item.page)} className="flex items-center justify-between p-3 rounded hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className="text-[#2874F0]" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.count > 0 && <span className="text-xs bg-blue-50 text-[#2874F0] font-semibold px-2 py-0.5 rounded">{item.count}</span>}
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4 text-red-600 border-red-200 hover:bg-red-50 gap-2" onClick={() => base44.auth.logout()}>
                <LogOut size={16} /> Logout
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-3">
          {/* Profile Info */}
          <Card className="shadow-sm rounded-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Personal Information</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)} className="text-[#2874F0] gap-1">
                <Edit2 size={14} /> Edit
              </Button>
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500">Phone</label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" />
                  </div>
                  <Button onClick={saveProfile} className="bg-[#2874F0]">Save</Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Full Name</p><p className="text-sm font-medium">{user.full_name}</p></div>
                  <div><p className="text-xs text-gray-500">Email</p><p className="text-sm font-medium">{user.email}</p></div>
                  <div><p className="text-xs text-gray-500">Phone</p><p className="text-sm font-medium">{user.phone || 'Not added'}</p></div>
                  <div><p className="text-xs text-gray-500">Member Since</p><p className="text-sm font-medium">{new Date(user.created_date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p></div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="shadow-sm rounded-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Orders</CardTitle>
              <Link to={createPageUrl('Orders')} className="text-sm text-[#2874F0] font-medium">View All</Link>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">#{order.order_number}</p>
                        <p className="text-xs text-gray-500">{new Date(order.created_date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">₹{order.total?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 capitalize">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}