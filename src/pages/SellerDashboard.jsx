import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Package, TrendingUp, DollarSign, ShoppingCart, Plus, Edit2, Trash2, BarChart3, Home, Loader2, Eye, EyeOff, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

const CATEGORIES = ['electronics', 'fashion', 'home-furniture', 'appliances', 'mobiles', 'beauty', 'grocery', 'toys'];

export default function SellerDashboard() {
  const [user, setUser] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', original_price: '', category: '', brand: '', stock: '', thumbnail: '', delivery_days: 5 });
  const queryClient = useQueryClient();

  useEffect(() => {
    const init = async () => {
      const authed = await base44.auth.isAuthenticated();
      if (!authed) { base44.auth.redirectToLogin(); return; }
      setUser(await base44.auth.me());
    };
    init();
  }, []);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['seller-products', user?.email],
    queryFn: () => base44.entities.Product.filter({ seller_email: user.email }, '-created_date', 100),
    enabled: !!user,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['seller-orders', user?.email],
    queryFn: async () => {
      const allOrders = await base44.entities.Order.list('-created_date', 100);
      return allOrders.filter(o => o.items?.some(i => products.some(p => p.id === i.product_id)));
    },
    enabled: products.length > 0,
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalProducts = products.length;
  const approvedProducts = products.filter(p => p.status === 'approved').length;

  const saveProduct = async () => {
    const data = {
      ...productForm,
      price: Number(productForm.price),
      original_price: Number(productForm.original_price) || Number(productForm.price),
      stock: Number(productForm.stock) || 0,
      delivery_days: Number(productForm.delivery_days) || 5,
      seller_email: user.email,
      seller_name: user.full_name,
      status: 'pending',
      discount_percent: productForm.original_price ? Math.round((1 - Number(productForm.price) / Number(productForm.original_price)) * 100) : 0,
    };

    if (editingProduct) {
      await base44.entities.Product.update(editingProduct.id, data);
      toast.success('Product updated');
    } else {
      await base44.entities.Product.create(data);
      toast.success('Product submitted for approval');
    }

    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: '', original_price: '', category: '', brand: '', stock: '', thumbnail: '', delivery_days: 5 });
    queryClient.invalidateQueries({ queryKey: ['seller-products'] });
  };

  const deleteProduct = async (id) => {
    await base44.entities.Product.delete(id);
    queryClient.invalidateQueries({ queryKey: ['seller-products'] });
    toast.success('Product deleted');
  };

  const editProduct = (p) => {
    setEditingProduct(p);
    setProductForm({ name: p.name, description: p.description, price: p.price, original_price: p.original_price, category: p.category, brand: p.brand, stock: p.stock, thumbnail: p.thumbnail, delivery_days: p.delivery_days });
    setShowProductForm(true);
  };

  if (!user) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-[#2874F0]" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#F1F3F6]">
      {/* Header */}
      <div className="bg-[#2874F0] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold italic">FlipKart</span>
          <span className="text-sm opacity-80">Seller Hub</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to={createPageUrl('Home')} className="text-sm hover:underline flex items-center gap-1"><Home size={14} /> Store</Link>
          <span className="text-sm">{user.full_name}</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Total Products', value: totalProducts, icon: Package, color: 'text-blue-600 bg-blue-50' },
            { label: 'Approved', value: approvedProducts, icon: Eye, color: 'text-green-600 bg-green-50' },
            { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-purple-600 bg-purple-50' },
            { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-orange-600 bg-orange-50' },
          ].map((s) => (
            <Card key={s.label} className="shadow-sm rounded-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${s.color}`}><s.icon size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className="text-lg font-bold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="products">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-3">
            <div className="bg-white rounded-sm shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">My Products</h2>
                <Button onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: '', original_price: '', category: '', brand: '', stock: '', thumbnail: '', delivery_days: 5 }); setShowProductForm(true); }} className="bg-[#2874F0] gap-1">
                  <Plus size={16} /> Add Product
                </Button>
              </div>

              {/* Product Form */}
              {showProductForm && (
                <div className="border-2 border-dashed border-[#2874F0] rounded p-4 mb-4 space-y-3">
                  <h3 className="font-semibold">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input placeholder="Product Name *" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} />
                    <Input placeholder="Brand" value={productForm.brand} onChange={(e) => setProductForm({...productForm, brand: e.target.value})} />
                    <Input type="number" placeholder="Price *" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} />
                    <Input type="number" placeholder="Original Price (MRP)" value={productForm.original_price} onChange={(e) => setProductForm({...productForm, original_price: e.target.value})} />
                    <Select value={productForm.category} onValueChange={(v) => setProductForm({...productForm, category: v})}>
                      <SelectTrigger><SelectValue placeholder="Category *" /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace('-', ' & ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}</SelectContent>
                    </Select>
                    <Input type="number" placeholder="Stock" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} />
                    <Input placeholder="Thumbnail Image URL" value={productForm.thumbnail} onChange={(e) => setProductForm({...productForm, thumbnail: e.target.value})} className="md:col-span-2" />
                    <Textarea placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} className="md:col-span-2" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveProduct} className="bg-[#FB641B]">{editingProduct ? 'Update' : 'Submit'} Product</Button>
                    <Button variant="outline" onClick={() => { setShowProductForm(false); setEditingProduct(null); }}>Cancel</Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img src={p.thumbnail || ''} alt="" className="w-10 h-10 object-contain rounded" />
                          <span className="text-sm font-medium">{p.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>₹{p.price?.toLocaleString()}</TableCell>
                      <TableCell>{p.stock || 0}</TableCell>
                      <TableCell>
                        <Badge className={p.status === 'approved' ? 'bg-green-100 text-green-800' : p.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => editProduct(p)}><Edit2 size={14} /></Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteProduct(p.id)} className="text-red-600"><Trash2 size={14} /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-3">
            <div className="bg-white rounded-sm shadow-sm p-4">
              <h2 className="font-bold mb-4">Orders</h2>
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.order_number}</TableCell>
                        <TableCell>{new Date(o.created_date).toLocaleDateString()}</TableCell>
                        <TableCell>{o.items?.length}</TableCell>
                        <TableCell>₹{o.total?.toLocaleString()}</TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{o.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}