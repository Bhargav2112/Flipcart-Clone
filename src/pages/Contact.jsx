import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-gray-500 mt-2">We're here to help and answer any questions you might have</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Phone, title: 'Call Us', desc: '1800-123-4567', sub: 'Mon-Sat, 9am-6pm' },
          { icon: Mail, title: 'Email Us', desc: 'support@flipkart.com', sub: 'We reply within 24h' },
          { icon: MapPin, title: 'Visit Us', desc: 'Bengaluru, Karnataka', sub: 'Embassy Tech Village' },
        ].map((item) => (
          <Card key={item.title} className="shadow-sm rounded-sm text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <item.icon className="text-[#2874F0]" size={22} />
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-800 mt-1">{item.desc}</p>
              <p className="text-xs text-gray-500">{item.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm rounded-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MessageSquare size={20} className="text-[#2874F0]" /> Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Your Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
              <Input type="email" placeholder="Your Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
            </div>
            <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} required />
            <Textarea placeholder="Your message..." value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="h-32" required />
            <Button type="submit" className="bg-[#2874F0] gap-2" disabled={sending}>
              {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}