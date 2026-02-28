import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Home, CheckCircle2, XCircle, Loader2, BarChart3, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#2874F0', '#FB641B', '#388E3C', '#FF9F00', '#FF6161', '#9B59B6'];

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const init = async () => {
      const authed = await base44.auth.isAuthenticated();
      if (!authed) { base44.auth.redirectToLogin(); return; }
      const me = await base44.auth.me();
      if (me.role !== 'admin') { window.location.href = createPageUrl('Home'); return; }
      setUser(me);
    };
    init();
  }, []);

  const { data: users = [] } = useQuery({ queryKey: ['admin-users'], queryFn: () => base44.entities.User.list('-created_date', 100), enabled: !!user });
  const { data: products = [] } = useQuery({ queryKey: ['admin-products'], queryFn: () => base44.entities.Product.list('-created_date', 200), enabled: !!user });
  const { data: orders = [] } = useQuery({ queryKey: ['admin-orders'], queryFn: () => base44.entities.Order.list('-created_date', 200), enabled: !!user });
  const { data: sellers = [] } = useQuery({ queryKey: ['admin-sellers'], queryFn: () => base44.entities.Seller.list('-created_date', 100), enabled: !!user });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingProducts = products.filter(p => p.status === 'pending');

  const approveProduct = async (id) => {
    await base44.entities.Product.update(id, { status: 'approved' });
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    toast.success('Product approved');
  };

  const rejectProduct = async (id) => {
    await base44.entities.Product.update(id, { status: 'rejected' });
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    toast.success('Product rejected');
  };

  const updateOrderStatus = async (id, status) => {
    await base44.entities.Order.update(id, { status });
    queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    toast.success('Order status updated');
  };

  // Chart data
  const categoryData = products.reduce((acc, p) => {
    const cat = p.category || 'Other';
    const existing = acc.find(a => a.name === cat);
    if (existing) existing.count++;
    else acc.push({ name: cat, count: 1 });
    return acc;
  }, []);

  const statusData = orders.reduce((acc, o) => {
    const s = o.status || 'unknown';
    const existing = acc.find(a => a.name === s);
    if (existing) existing.value++;
    else acc.push({ name: s, value: 1 });
    return acc;
  }, []);

  if (!user) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-[#2874F0]" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#F1F3F6]">
      <div className="bg-[#172337] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold italic">FlipKart</span>
          <span className="text-sm opacity-80">Admin Panel</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to={createPageUrl('Home')} className="text-sm hover:underline flex items-center gap-1"><Home size={14} /> Store</Link>
          <span className="text-sm">{user.full_name}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600 bg-blue-50' },
            { label: 'Products', value: products.length, icon: Package, color: 'text-green-600 bg-green-50' },
            { label: 'Orders', value: orders.length, icon: ShoppingCart, color: 'text-purple-600 bg-purple-50' },
            { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-orange-600 bg-orange-50' },
          ].map((s) => (
            <Card key={s.label} className="shadow-sm rounded-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${s.color}`}><s.icon size={20} /></div>
                <div><p className="text-xs text-gray-500">{s.label}</p><p className="text-xl font-bold">{s.value}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <Card className="shadow-sm rounded-sm">
            <CardHeader><CardTitle className="text-sm">Products by Category</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="count" fill="#2874F0" radius={[4, 4, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="shadow-sm rounded-sm">
            <CardHeader><CardTitle className="text-sm">Order Status</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart><Pie data={statusData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({name, value}) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="pending">Pending Approval ({pendingProducts.length})</TabsTrigger>
            <TabsTrigger value="products">All Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-3">
            <div className="bg-white rounded-sm shadow-sm p-4">
              {pendingProducts.length === 0 ? <p className="text-gray-500 text-center py-8">No products pending approval</p> : (
                <Table>
                  <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Seller</TableHead><TableHead>Price</TableHead><TableHead>Category</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {pendingProducts.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.seller_name}</TableCell>
                        <TableCell>₹{p.price?.toLocaleString()}</TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" onClick={() => approveProduct(p.id)} className="bg-green-600 hover:bg-green-700 gap-1"><CheckCircle2 size={14} /> Approve</Button>
                            <Button size="sm" onClick={() => rejectProduct(p.id)} variant="destructive" className="gap-1"><XCircle size={14} /> Reject</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-3">
            <div className="bg-white rounded-sm shadow-sm p-4">
              <Table>
                <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Status</TableHead><TableHead>Rating</TableHead></TableRow></TableHeader>
                <TableBody>
                  {products.slice(0, 50).map((p) => (
                    <TableRow key={p.id}>
                      <TableCell><div className="flex items-center gap-2"><img src={p.thumbnail || ''} alt="" className="w-8 h-8 object-contain" />{p.name}</div></TableCell>
                      <TableCell>₹{p.price?.toLocaleString()}</TableCell>
                      <TableCell>{p.stock || 0}</TableCell>
                      <TableCell><Badge className={p.status === 'approved' ? 'bg-green-100 text-green-800' : p.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>{p.status}</Badge></TableCell>
                      <TableCell>{p.rating?.toFixed(1) || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-3">
            <div className="bg-white rounded-sm shadow-sm p-4">
              <Table>
                <TableHeader><TableRow><TableHead>Order #</TableHead><TableHead>Customer</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                <TableBody>
                  {orders.slice(0, 50).map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.order_number}</TableCell>
                      <TableCell>{o.user_email}</TableCell>
                      <TableCell>₹{o.total?.toLocaleString()}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{o.status}</Badge></TableCell>
                      <TableCell>
                        <Select value={o.status} onValueChange={(v) => updateOrderStatus(o.id, v)}>
                          <SelectTrigger className="w-36 h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, ' ')}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-3">
            <div className="bg-white rounded-sm shadow-sm p-4">
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Joined</TableHead></TableRow></TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.full_name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{u.role || 'user'}</Badge></TableCell>
                      <TableCell>{new Date(u.created_date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}