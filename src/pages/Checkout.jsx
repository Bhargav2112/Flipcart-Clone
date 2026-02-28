import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { MapPin, CreditCard, Truck, CheckCircle2, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function Checkout() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', pincode: '', type: 'home' });
  const [placing, setPlacing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const init = async () => {
      const authed = await base44.auth.isAuthenticated();
      if (!authed) { base44.auth.redirectToLogin(); return; }
      setUser(await base44.auth.me());
    };
    init();
  }, []);

  const { data: cartItems = [] } = useQuery({
    queryKey: ['cart-checkout', user?.email],
    queryFn: () => base44.entities.CartItem.filter({ user_email: user.email, saved_for_later: false }),
    enabled: !!user,
  });

  const { data: addresses = [], refetch: refetchAddresses } = useQuery({
    queryKey: ['addresses', user?.email],
    queryFn: () => base44.entities.Address.filter({ user_email: user.email }),
    enabled: !!user,
  });

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses.find(a => a.is_default) || addresses[0]);
    }
  }, [addresses]);

  const subtotal = cartItems.reduce((sum, i) => sum + (i.product_price || 0) * (i.quantity || 1), 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const saveAddress = async () => {
    await base44.entities.Address.create({ ...newAddress, user_email: user.email });
    toast.success('Address saved');
    setShowAddressForm(false);
    setNewAddress({ name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', pincode: '', type: 'home' });
    refetchAddresses();
  };

  const placeOrder = async () => {
    if (!selectedAddress) { toast.error('Please select an address'); return; }
    setPlacing(true);
    const orderNumber = 'FK' + Date.now().toString().slice(-8);
    const deliveryDate = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];

    await base44.entities.Order.create({
      order_number: orderNumber,
      user_email: user.email,
      items: cartItems.map(i => ({
        product_id: i.product_id, product_name: i.product_name, product_thumbnail: i.product_thumbnail,
        price: i.product_price, quantity: i.quantity || 1, seller_name: i.seller_name,
      })),
      subtotal, discount: 0, delivery_fee: deliveryFee, total,
      status: 'placed', payment_method: paymentMethod, payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
      shipping_address: selectedAddress, estimated_delivery: deliveryDate,
    });

    // Clear cart
    for (const item of cartItems) {
      await base44.entities.CartItem.delete(item.id);
    }

    setPlacing(false);
    toast.success('Order placed successfully!');
    window.location.href = createPageUrl('Orders');
  };

  const steps = [
    { num: 1, label: 'Address', icon: MapPin },
    { num: 2, label: 'Payment', icon: CreditCard },
    { num: 3, label: 'Review', icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-[1000px] mx-auto px-2 md:px-4 py-4">
      {/* Steps */}
      <div className="bg-white rounded-sm shadow-sm p-4 mb-3">
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {steps.map((s, i) => (
            <React.Fragment key={s.num}>
              <button onClick={() => setStep(s.num)} className={`flex items-center gap-2 ${step >= s.num ? 'text-[#2874F0]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s.num ? 'bg-[#2874F0] text-white' : 'bg-gray-200 text-gray-500'}`}>{s.num}</div>
                <span className="hidden sm:inline text-sm font-medium">{s.label}</span>
              </button>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 max-w-[80px] ${step > s.num ? 'bg-[#2874F0]' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-white rounded-sm shadow-sm p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-[#2874F0]">SELECT DELIVERY ADDRESS</h2>
                <Button variant="outline" size="sm" onClick={() => setShowAddressForm(true)} className="gap-1">
                  <Plus size={14} /> Add New
                </Button>
              </div>

              {addresses.map((addr) => (
                <div key={addr.id} onClick={() => setSelectedAddress(addr)}
                  className={`border-2 rounded p-4 cursor-pointer transition-colors ${selectedAddress?.id === addr.id ? 'border-[#2874F0] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold">{addr.name}</span>
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded uppercase">{addr.type}</span>
                    <span className="text-xs text-gray-500">{addr.phone}</span>
                  </div>
                  <p className="text-sm text-gray-600">{addr.address_line1}, {addr.address_line2 ? addr.address_line2 + ', ' : ''}{addr.city}, {addr.state} - {addr.pincode}</p>
                </div>
              ))}

              {showAddressForm && (
                <div className="border-2 border-dashed border-[#2874F0] rounded p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Add New Address</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Full Name" value={newAddress.name} onChange={(e) => setNewAddress({...newAddress, name: e.target.value})} />
                    <Input placeholder="Phone" value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} />
                    <Input placeholder="Address Line 1" className="col-span-2" value={newAddress.address_line1} onChange={(e) => setNewAddress({...newAddress, address_line1: e.target.value})} />
                    <Input placeholder="Address Line 2" className="col-span-2" value={newAddress.address_line2} onChange={(e) => setNewAddress({...newAddress, address_line2: e.target.value})} />
                    <Input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} />
                    <Input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} />
                    <Input placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})} />
                    <Select value={newAddress.type} onValueChange={(v) => setNewAddress({...newAddress, type: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveAddress} className="bg-[#FB641B]">Save Address</Button>
                    <Button variant="outline" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                  </div>
                </div>
              )}

              <Button onClick={() => setStep(2)} className="w-full bg-[#FB641B] h-11 font-bold" disabled={!selectedAddress}>CONTINUE</Button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white rounded-sm shadow-sm p-4 space-y-4">
              <h2 className="font-bold text-[#2874F0]">PAYMENT OPTIONS</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive' },
                  { value: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm' },
                  { value: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                  { value: 'netbanking', label: 'Net Banking', desc: 'All major banks supported' },
                  { value: 'wallet', label: 'Wallet', desc: 'FlipKart Pay Balance' },
                ].map((pm) => (
                  <div key={pm.value} className={`border-2 rounded p-4 cursor-pointer ${paymentMethod === pm.value ? 'border-[#2874F0] bg-blue-50/50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={pm.value} />
                      <div>
                        <span className="text-sm font-medium">{pm.label}</span>
                        <p className="text-xs text-gray-500">{pm.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
              <Button onClick={() => setStep(3)} className="w-full bg-[#FB641B] h-11 font-bold">CONTINUE</Button>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="bg-white rounded-sm shadow-sm p-4 space-y-4">
              <h2 className="font-bold text-[#2874F0]">ORDER SUMMARY</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 py-3 border-b">
                  <img src={item.product_thumbnail || ''} alt="" className="w-16 h-16 object-contain" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.product_name}</h4>
                    <p className="text-sm font-bold mt-1">₹{item.product_price?.toLocaleString()} × {item.quantity || 1}</p>
                  </div>
                </div>
              ))}
              {selectedAddress && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500 mb-1">Deliver to:</p>
                  <p className="text-sm font-medium">{selectedAddress.name}, {selectedAddress.address_line1}, {selectedAddress.city} - {selectedAddress.pincode}</p>
                </div>
              )}
              <Button onClick={placeOrder} disabled={placing} className="w-full bg-[#FB641B] h-12 font-bold text-base gap-2">
                {placing ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                {placing ? 'Placing Order...' : `PLACE ORDER · ₹${total.toLocaleString()}`}
              </Button>
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="lg:w-[300px]">
          <div className="bg-white rounded-sm shadow-sm p-4 sticky top-[110px]">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Price Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Price ({cartItems.length} items)</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span className={deliveryFee === 0 ? 'text-green-700' : ''}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
              <Separator />
              <div className="flex justify-between font-bold text-base"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}