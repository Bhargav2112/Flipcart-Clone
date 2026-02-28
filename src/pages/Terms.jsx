import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Terms() {
  return (
    <div className="max-w-[900px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Legal & Policies</h1>

      <Tabs defaultValue="terms" className="bg-white rounded-sm shadow-sm">
        <TabsList className="w-full justify-start border-b rounded-none px-4 pt-2">
          <TabsTrigger value="terms">Terms of Use</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="returns">Return Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="p-6">
          <div className="prose prose-sm max-w-none text-gray-600">
            <h2 className="text-lg font-bold text-gray-900">Terms of Use</h2>
            <p className="text-xs text-gray-400 mb-4">Last updated: January 2026</p>
            <h3 className="font-semibold text-gray-800 mt-4">1. Acceptance of Terms</h3>
            <p>By accessing and using FlipKart, you agree to be bound by these Terms of Use. If you do not agree, please do not use our services.</p>
            <h3 className="font-semibold text-gray-800 mt-4">2. User Account</h3>
            <p>You must create an account to make purchases. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
            <h3 className="font-semibold text-gray-800 mt-4">3. Product Listings</h3>
            <p>Product descriptions are provided by sellers. While we verify accuracy, we cannot guarantee all details are complete. Prices and availability are subject to change.</p>
            <h3 className="font-semibold text-gray-800 mt-4">4. Payments</h3>
            <p>All payments are processed through secure payment gateways. We support multiple payment methods including UPI, cards, net banking, and COD.</p>
            <h3 className="font-semibold text-gray-800 mt-4">5. Intellectual Property</h3>
            <p>All content, trademarks, and materials on this platform are the property of FlipKart or its licensors. Unauthorized use is prohibited.</p>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="p-6">
          <div className="prose prose-sm max-w-none text-gray-600">
            <h2 className="text-lg font-bold text-gray-900">Privacy Policy</h2>
            <p className="text-xs text-gray-400 mb-4">Last updated: January 2026</p>
            <h3 className="font-semibold text-gray-800 mt-4">Information We Collect</h3>
            <p>We collect information you provide directly, such as name, email, phone, and address. We also collect usage data, device information, and cookies.</p>
            <h3 className="font-semibold text-gray-800 mt-4">How We Use Your Information</h3>
            <p>Your data is used to process orders, personalize your experience, improve our services, communicate with you, and prevent fraud.</p>
            <h3 className="font-semibold text-gray-800 mt-4">Data Security</h3>
            <p>We implement industry-standard security measures including 256-bit SSL encryption, regular security audits, and PCI DSS compliance.</p>
            <h3 className="font-semibold text-gray-800 mt-4">Your Rights</h3>
            <p>You have the right to access, update, or delete your personal data. Contact us at privacy@flipkart.com for data-related requests.</p>
          </div>
        </TabsContent>

        <TabsContent value="returns" className="p-6">
          <div className="prose prose-sm max-w-none text-gray-600">
            <h2 className="text-lg font-bold text-gray-900">Return & Refund Policy</h2>
            <p className="text-xs text-gray-400 mb-4">Last updated: January 2026</p>
            <h3 className="font-semibold text-gray-800 mt-4">Return Window</h3>
            <p>Most products can be returned within 7 days of delivery. Electronics have a 10-day return window. Fashion items have a 30-day window.</p>
            <h3 className="font-semibold text-gray-800 mt-4">Return Process</h3>
            <p>Initiate returns from My Orders. Pack the item in original packaging. A pickup will be scheduled within 24-48 hours.</p>
            <h3 className="font-semibold text-gray-800 mt-4">Refund Timeline</h3>
            <p>Refunds are processed within 5-7 business days after verification. UPI/wallet refunds are faster (1-3 days). Card refunds may take up to 10 days.</p>
            <h3 className="font-semibold text-gray-800 mt-4">Non-Returnable Items</h3>
            <p>Certain items like innerwear, perishables, customized products, and digital goods cannot be returned.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}