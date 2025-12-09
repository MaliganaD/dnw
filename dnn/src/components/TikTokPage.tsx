import React from 'react';
import { ArrowLeft } from 'lucide-react';

const TikTokPage: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => (
    <div className="min-h-screen pt-24 bg-[#090b13] text-white flex flex-col items-center">
        <div className="container mx-auto px-4">
            <button onClick={onBackToHome} className="flex gap-2 text-gray-400 hover:text-white mb-8"><ArrowLeft className="w-4 h-4" /> Back</button>
            <div className="text-center bg-[#1a1d29] p-12 rounded-xl border border-[#2d2f36]">
                <h1 className="text-4xl font-bold mb-4">TikTok Feed</h1>
                <p className="text-gray-400 mb-8">Follow us @dununation for daily updates.</p>
                <button onClick={() => window.open('https://tiktok.com/@dununation', '_blank')} className="bg-white text-black px-8 py-3 rounded font-bold uppercase">Visit TikTok</button>
            </div>
        </div>
    </div>
);
export default TikTokPage;