import React from "react";
import { Upload, Calendar } from "lucide-react";

const FridayBanner: React.FC<{ onUploadClick: () => void }> = ({ onUploadClick }) => (
  <section className="py-20 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-[#090b13] z-0"></div>
    <div className="container mx-auto px-4 relative z-10 text-center">
      <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
        <Calendar className="w-3 h-3" /> Every Friday
      </span>
      <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight drop-shadow-xl">Friday Live Sessions</h2>
      <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">Join us for live music performances featuring emerging artists.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button onClick={onUploadClick} className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded hover:bg-gray-200 transition-colors font-bold tracking-widest uppercase text-sm">
          <Upload className="w-5 h-5" /> Upload Your Track
        </button>
      </div>
    </div>
  </section>
);
export default FridayBanner;