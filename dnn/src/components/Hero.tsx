import React from 'react';
import { Play, Music2 } from "lucide-react";

const Hero: React.FC = () => (
  <section className="pt-40 pb-24 bg-gradient-to-b from-[#1a1d29] to-[#090b13] text-white">
    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-8 animate-in slide-in-from-left duration-700">
        <div className="inline-block px-4 py-2 bg-[#2d2f36] border border-gray-600 rounded-full">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-200">
            <Music2 className="w-4 h-4 text-blue-400" /> Empowering Artists Since 2025
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
          Welcome to <br /><span className="text-blue-500">Dunu Nation</span>
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
          A vibrant community dedicated to amplifying artists' voices and providing comprehensive music education.
        </p>
        <button onClick={() => document.getElementById('artists')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded hover:bg-gray-200 transition-colors font-bold tracking-widest uppercase text-sm">
          <Play className="w-5 h-5 fill-black" /> Discover Artists
        </button>
      </div>
      <div className="relative animate-in slide-in-from-right duration-700">
        <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border border-[#2d2f36]">
          <img src="https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg" alt="Artist" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </div>
      </div>
    </div>
  </section>
);
export default Hero;