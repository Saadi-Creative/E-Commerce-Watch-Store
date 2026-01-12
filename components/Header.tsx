// src/components/Header.tsx
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { User, Menu, X } from 'lucide-react';

// SECRET ADMIN PATH - Must match App.tsx
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || 'wh-secret-panel';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const { isAdmin } = useAuth();

    const activeLinkClass = 'text-yellow-500 font-semibold';
    const inactiveLinkClass = 'text-white hover:text-yellow-500 transition-colors duration-300 font-medium';
    const mobileLinkClass = 'block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-yellow-500 hover:bg-gray-800';

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'My Orders', path: '/my-orders' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <header className="fixed w-full top-0 z-50 transition-all duration-300 bg-brand-dark/95 border-b border-white/5 shadow-lg">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* --- LEFT: LOGO --- */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <img
                                src="/wristhublogo.svg"
                                alt="WristHub"
                                width="150"
                                height="40"
                                loading="eager"
                                className="h-10 w-auto object-contain"
                            />
                            <span className="text-white font-serif text-xl tracking-widest md:hidden lg:block uppercase">WristHub</span>
                        </Link>
                    </div>

                    {/* --- CENTER: DESKTOP NAV --- */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-6">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} text-sm`}
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* --- RIGHT: ICONS & MOBILE TOGGLE --- */}
                    <div className="flex items-center space-x-4">

                        {/* DIRECT SHOP LINK FOR MOBILE */}
                        <NavLink
                            to="/shop"
                            className={({ isActive }) => `md:hidden font-bold text-sm tracking-wider mr-1 ${isActive ? 'text-yellow-500' : 'text-white'}`}
                        >
                            SHOP
                        </NavLink>

                        {/* Admin Icon (only visible for admins) */}
                        {isAdmin && (
                            <Link to={`/${ADMIN_PATH}/inventory`} className="text-white hover:text-yellow-500 transition-colors p-2" title="Admin Panel">
                                <User size={24} />
                            </Link>
                        )}

                        {/* Cart Icon */}
                        <Link to="/cart" className="relative text-white hover:text-yellow-500 transition-colors duration-300 p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-yellow-500 text-gray-900 text-xs flex items-center justify-center font-bold animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-300 hover:text-white p-2 focus:outline-none"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- MOBILE MENU DROPDOWN --- */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-900 border-t border-gray-800 absolute w-full left-0 top-20 shadow-xl">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `${isActive ? 'text-yellow-500 bg-gray-800' : 'text-gray-300'} ${mobileLinkClass}`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;