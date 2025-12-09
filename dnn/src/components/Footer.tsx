import React from 'react';
import logo from './../assets/Images/logo.png';
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const Footer: React.FC = () => (
  <footer className="bg-[#090b13] text-white py-14 border-t border-[#2d2f36]">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Dunu Nation" className="w-12 object-cover" />
          <span className="text-xl font-bold tracking-wider uppercase">Dunu Nation</span>
        </div>
        <div className="flex gap-4">
          <Instagram className="w-6 h-6 hover:text-blue-400 cursor-pointer" />
          <Twitter className="w-6 h-6 hover:text-blue-400 cursor-pointer" />
          <Facebook className="w-6 h-6 hover:text-blue-400 cursor-pointer" />
          <Youtube className="w-6 h-6 hover:text-blue-400 cursor-pointer" />
        </div>
      </div>
      <div className="pt-8 border-t border-[#2d2f36] text-center text-xs text-gray-500 mt-8">
        <p>© 2025 Dunu Nation. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
export default Footer;