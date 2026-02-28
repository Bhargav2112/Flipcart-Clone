import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Package, Truck, RotateCcw, CreditCard, Shield, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const faqCategories = [
  {
    title: 'Orders & Shipping',
    icon: Truck,
    faqs: [
      { q: 'How do I track my order?', a: 'Go to My Orders page, click on the order to see real-time tracking status including estimated delivery date.' },
      { q: 'What are the delivery charges?', a: 'Delivery is free for orders above ₹500. For orders below ₹500, a delivery charge of ₹40 is applicable.' },
      { q: 'How long does delivery take?', a: 'Standard delivery takes 3-7 business days. Express delivery is available in select cities for 1-2 days.' },
    ]
  },
  {
    title: 'Returns & Refunds',
    icon: RotateCcw,
    faqs: [
      { q: 'What is the return policy?', a: 'Most products can be returned within 7 days of delivery. Some categories have a 30-day return window.' },
      { q: 'How do I initiate a return?', a: 'Go to My Orders, select the order, click "Return" and follow the instructions. A pickup will be scheduled.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 5-7 business days after the returned item is received and verified.' },
    ]
  },
  {
    title: 'Payments',
    icon: CreditCard,
    faqs: [
      { q: 'What payment methods are accepted?', a: 'We accept UPI, credit/debit cards, net banking, wallets, and cash on delivery.' },
      { q: 'Is cash on delivery available?', a: 'Yes, COD is available for most products. Maximum COD limit is ₹50,000 per order.' },
      { q: 'Are there any EMI options?', a: 'Yes, no-cost EMI is available on select products with leading bank credit cards.' },
    ]
  },
  {
    title: 'Account & Security',
    icon: Shield,
    faqs: [
      { q: 'How do I change my password?', a: 'Go to your profile settings and click on "Change Password". You can also use "Forgot Password" at login.' },
      { q: 'Is my payment information secure?', a: 'Absolutely. We use 256-bit encryption and are PCI DSS compliant. We never store full card details.' },
      { q: 'How do I delete my account?', a: 'Contact our support team at support@flipkart.com. Account deletion will be processed within 48 hours.' },
    ]
  },
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const filteredCategories = faqCategories.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(cat => cat.faqs.length > 0);

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#2874F0] to-[#1a4fc0] rounded-lg p-8 text-white text-center mb-8">
        <h1 className="text-3xl font-bold mb-3">How can we help you?</h1>
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white text-gray-900 border-0 h-11"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { icon: Package, label: 'Track Order', color: 'bg-blue-50 text-blue-600' },
          { icon: RotateCcw, label: 'Returns', color: 'bg-green-50 text-green-600' },
          { icon: CreditCard, label: 'Payments', color: 'bg-purple-50 text-purple-600' },
          { icon: HelpCircle, label: 'More Help', color: 'bg-orange-50 text-orange-600' },
        ].map((item) => (
          <Card key={item.label} className="shadow-sm rounded-sm cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center mx-auto mb-2`}>
                <item.icon size={20} />
              </div>
              <p className="text-sm font-medium">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQs */}
      <div className="space-y-6">
        {(searchQuery ? filteredCategories : faqCategories).map((cat) => (
          <div key={cat.title}>
            <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
              <cat.icon size={20} className="text-[#2874F0]" /> {cat.title}
            </h2>
            <div className="space-y-2">
              {cat.faqs.map((faq, i) => {
                const key = `${cat.title}-${i}`;
                return (
                  <Card key={key} className="shadow-sm rounded-sm">
                    <button
                      onClick={() => setOpenFaq(openFaq === key ? null : key)}
                      className="w-full p-4 flex items-center justify-between text-left"
                    >
                      <span className="text-sm font-medium pr-4">{faq.q}</span>
                      {openFaq === key ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
                    </button>
                    {openFaq === key && (
                      <div className="px-4 pb-4 text-sm text-gray-600 animate-fade-in">
                        {faq.a}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}