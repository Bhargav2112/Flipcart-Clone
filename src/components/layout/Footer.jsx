import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Footer() {
  return (
    <footer className="bg-[#172337] text-white mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-4">About</h3>
            <ul className="space-y-2.5">
              <li><Link to={createPageUrl('Contact')} className="text-xs text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to={createPageUrl('About')} className="text-xs text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to={createPageUrl('Terms')} className="text-xs text-gray-300 hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to={createPageUrl('Terms')} className="text-xs text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-4">Help</h3>
            <ul className="space-y-2.5">
              <li><Link to={createPageUrl('Help')} className="text-xs text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to={createPageUrl('Help')} className="text-xs text-gray-300 hover:text-white transition-colors">Shipping</Link></li>
              <li><Link to={createPageUrl('Help')} className="text-xs text-gray-300 hover:text-white transition-colors">Cancellation & Returns</Link></li>
              <li><Link to={createPageUrl('Help')} className="text-xs text-gray-300 hover:text-white transition-colors">Report Issue</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-4">Policy</h3>
            <ul className="space-y-2.5">
              <li><Link to={createPageUrl('Terms')} className="text-xs text-gray-300 hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link to={createPageUrl('Terms')} className="text-xs text-gray-300 hover:text-white transition-colors">Security</Link></li>
              <li><Link to={createPageUrl('Terms')} className="text-xs text-gray-300 hover:text-white transition-colors">Sitemap</Link></li>
              <li><Link to={createPageUrl('Terms')} className="text-xs text-gray-300 hover:text-white transition-colors">EPR Compliance</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-4">Mail Us</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              FlipKart Internet Private Limited<br />
              Buildings Alyssa, Begonia & Clove<br />
              Embassy Tech Village<br />
              Bengaluru, 560103<br />
              Karnataka, India
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <span className="text-white text-lg font-bold italic">FlipKart</span>
            <span className="text-xs text-gray-400">© 2024-2026 FlipKart.com</span>
          </div>
          <div className="flex items-center gap-4">
            <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/payment-method-c454fb.svg" alt="Payment Methods" className="h-5 opacity-70" onError={(e) => e.target.style.display='none'} />
          </div>
        </div>
      </div>
    </footer>
  );
}