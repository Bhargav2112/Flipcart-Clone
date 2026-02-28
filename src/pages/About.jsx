import React from 'react';
import { Users, Globe, Truck, Shield, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#2874F0] to-[#1a4fc0] rounded-lg p-8 md:p-12 text-white text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">About FlipKart</h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">India's leading e-commerce marketplace offering millions of products across categories at the best prices.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { value: '100M+', label: 'Customers', icon: Users },
          { value: '150M+', label: 'Products', icon: Globe },
          { value: '10K+', label: 'Sellers', icon: Award },
          { value: '19K+', label: 'Pincodes', icon: Truck },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-sm rounded-sm text-center">
            <CardContent className="p-6">
              <stat.icon className="text-[#2874F0] mx-auto mb-2" size={28} />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Story */}
      <div className="bg-white rounded-sm shadow-sm p-6 md:p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Our Story</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
          <p>FlipKart was founded in 2007 by Sachin Bansal and Binny Bansal in Bangalore, starting as an online bookstore before expanding into a full e-commerce marketplace. Today, we are India's most valuable e-commerce company.</p>
          <p>We believe in making quality products accessible to everyone. Our platform connects millions of buyers with sellers across the country, offering everything from electronics and fashion to grocery and furniture.</p>
          <p>With industry-leading logistics, customer-first policies, and continuous innovation, we've transformed how India shops online. Our commitment to technology and customer satisfaction drives everything we do.</p>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Shield, title: 'Trust & Safety', desc: 'Secure payments, buyer protection, and verified sellers ensure a safe shopping experience.' },
          { icon: TrendingUp, title: 'Innovation', desc: 'AI-powered recommendations, voice search, and AR try-ons for a cutting-edge experience.' },
          { icon: Truck, title: 'Fast Delivery', desc: 'Same-day and next-day delivery in major cities with real-time order tracking.' },
        ].map((item) => (
          <Card key={item.title} className="shadow-sm rounded-sm">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                <item.icon className="text-[#2874F0]" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}