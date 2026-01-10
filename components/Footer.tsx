// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Send } from 'lucide-react';

const Footer: React.FC = () => {
  const email = 'wristhubstore@gmail.com';
  const phonePrimary = '+923155308406';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <footer className="bg-brand-darker border-t border-white/10 mt-auto relative pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* 1. Brand & Info */}
          <div className="space-y-6">
            <Link to="/" className="block">
              <span className="text-2xl font-serif text-white tracking-widest uppercase">WristHub</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Own your time. We curate the finest timepieces for those who value precision and legacy.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors"><Facebook size={20} /></a>
              <a href="https://www.instagram.com/wristhubwatch?igsh=MTg0aTUyZjhtaXVxaA==" target="_blank" className="text-gray-400 hover:text-brand-gold transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-white font-serif text-lg mb-6">Explore</h3>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-brand-gold text-sm transition-colors uppercase tracking-wider">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Customer Care */}
          <div>
            <h3 className="text-white font-serif text-lg mb-6">Support</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href={`mailto:${email}`} className="hover:text-brand-gold transition-colors">{email}</a></li>
              <li><a href={`tel:${phonePrimary}`} className="hover:text-brand-gold transition-colors">{phonePrimary}</a></li>
              <li><Link to="/contact" className="hover:text-brand-gold transition-colors">Contact Form</Link></li>
              <li><Link to="/shipping" className="hover:text-brand-gold transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div>
            <h3 className="text-white font-serif text-lg mb-6">Stay Timeless</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                name="email"
                id="newsletter-email"
                placeholder="Enter your email"
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-l-lg border border-gray-700 focus:outline-none focus:border-yellow-500 transition-colors"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-gold hover:text-white transition-colors">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">© 2024 WristHub. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-500 text-xs">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;