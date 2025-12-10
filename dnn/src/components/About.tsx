import React from 'react';
import { Heart, Target, Lightbulb, Award } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    { icon: Heart, title: "Community", desc: "A supportive environment for creators." },
    { icon: Target, title: "Empowerment", desc: "Providing the tools for success." },
    { icon: Lightbulb, title: "Innovation", desc: "An evolving digital platform." },
    { icon: Award, title: "Excellence", desc: "High-quality resources and education." }
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-[#090b13] text-gray-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        {/* --- PART 1: FULL BIOGRAPHY --- */}
        <div className="flex flex-col lg:flex-row gap-12 items-start mb-20">
          
          {/* Text Content - The Full Biography */}
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              The DUNU Nation Story
            </h2>
            
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              DUNU Nation is a dynamic and rapidly emerging creative collective reshaping the African music and digital arts landscape. Known for their innovative approach to sound, storytelling, and community-driven artistry, DUNU Nation is more than a musical outfit — it is a movement dedicated to culture, creativity, and knowledge-sharing across the continent.
            </p>

            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Rising from Africa’s vibrant youth culture, DUNU Nation brings together a blend of musical influences, modern digital expression, and grassroots creative energy. Their work is characterised by a fresh sonic identity, experimental rhythms, and a commitment to producing art that resonates with young people while preserving African authenticity. Their growing presence has positioned them as one of the most exciting new forces to watch on the continent.
            </p>

            <div className="p-6 bg-gray-50 dark:bg-[#1a1d29] border-l-4 border-blue-600 rounded-r-xl my-6">
              <p className="italic text-gray-600 dark:text-gray-400">
                "What sets DUNU Nation apart is their philosophy of empowerment. Beyond producing music and digital content, the collective actively engages in building communities of young creators and sharing knowledge with emerging artists."
              </p>
            </div>

            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Their ethos centres on growth, accessibility, and elevating African creativity. This approach has earned them admiration across social platforms, where they consistently inspire, educate, and interact with their growing audience.
            </p>

            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Their feature in <span className="font-bold text-blue-600 dark:text-blue-400">Imbizo Magazine</span> marked a significant milestone, spotlighting them as a “rising creative force in the African music landscape.” The platform recognised their ability to merge artistry with cultural responsibility — positioning DUNU Nation as a collective with vision, purpose, and long-term impact.
            </p>

            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Driven by passion, digital fluency, and a bold artistic voice, DUNU Nation continues to build momentum, connecting with fans across the continent and beyond. As they expand their creative footprint, they are shaping a new generation of African expression — one rooted in unity, innovation, and the fearless celebration of identity.
            </p>

            <p className="text-xl font-bold pt-4 text-gray-900 dark:text-white">
              DUNU Nation is not just creating art. They’re building a legacy.
            </p>
          </div>

          {/* Image Side */}
          <div className="lg:w-1/2 w-full sticky top-24">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-[#2d2f36] aspect-[4/5] bg-gray-100 dark:bg-[#151720] group">
              {/* Replace with your actual group photo URL */}
              <img 
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop" 
                alt="DUNU Nation Collective" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-white/80 text-sm uppercase tracking-widest mb-2 font-bold">Building a Legacy</p>
                <p className="text-white text-2xl md:text-3xl font-bold leading-tight">Reshaping the African Soundscape</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- PART 2: VALUES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#1a1d29] border border-gray-200 dark:border-[#2d2f36] p-8 rounded-xl text-center hover:border-blue-500 dark:hover:border-white hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg">
                <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-[#2d2f36] flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                    <item.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;
