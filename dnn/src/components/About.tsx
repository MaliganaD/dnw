import React from 'react';
import { Heart, Target, Lightbulb, Award } from 'lucide-react';

const About: React.FC = () => (
  <section id="about" className="py-20 bg-[#090b13] text-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">About Us</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">Dunu Nation is a space where artists can learn, grow, and share their music with the world.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            { icon: Heart, title: "Community", desc: "Supportive environment." },
            { icon: Target, title: "Empowerment", desc: "Tools for success." },
            { icon: Lightbulb, title: "Innovation", desc: "Evolving platform." },
            { icon: Award, title: "Excellence", desc: "High quality resources." }
        ].map((item, i) => (
            <div key={i} className="bg-[#1a1d29] border border-[#2d2f36] p-8 rounded-xl text-center hover:border-white transition-all">
                <div className="w-16 h-16 rounded-full bg-[#2d2f36] flex items-center justify-center mx-auto mb-6"><item.icon className="w-8 h-8 text-blue-400" /></div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
        ))}
      </div>
    </div>
  </section>
);
export default About;