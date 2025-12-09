import React, { useState } from 'react';
import { Menu, X, Lock } from 'lucide-react';
import logo from '../assets/Images/logo.png';
import ThemeToggle from './ThemeToggle';

interface HeaderProps { currentPage: string; onNavigate: (page: string) => void; }

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { id: 'home', label: 'Home' }, { id: 'artists', label: 'Artists' },
    { id: 'education', label: 'Education' }, { id: 'events', label: 'Events' },
    { id: 'blog', label: 'News' }, { id: 'contact', label: 'Contact' },
  ];

  const handleLogoClick = () => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 dark:bg-[#090b13]/90 backdrop-blur-md border-b border-gray-200 dark:border-[#2d2f36] transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
            <img src={logo} alt="DUNU NATION" className="h-12 w-auto object-contain" />
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { onNavigate('home'); setTimeout(() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-sm font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              {item.label}
            </button>
          ))}
          <ThemeToggle />
          <button onClick={() => onNavigate('admin')} className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-[#2d2f36] rounded text-xs font-bold uppercase text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white dark:hover:text-black transition-all">
            <Lock className="w-3 h-3" /> Admin
          </button>
        </nav>
        <button className="md:hidden text-black dark:text-white" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-[#090b13] border-b border-gray-200 dark:border-[#2d2f36] p-4 flex flex-col gap-4 shadow-lg">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { onNavigate('home'); setIsOpen(false); setTimeout(() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-left text-sm font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
              {item.label}
            </button>
          ))}
          <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-[#2d2f36] mt-2"><span className="text-sm font-bold text-gray-500 uppercase">Theme</span><ThemeToggle /></div>
          <button onClick={() => { onNavigate('admin'); setIsOpen(false); }} className="text-left text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500 hover:text-black dark:hover:text-white">Admin Login</button>
        </div>
      )}
    </header>
  );
};
export default Header;