import React from 'react';

const ARTISTS = [
  { id: "6x54M39fgFgXmXvlqWk1nv" }, { id: "3cGcpSU6lBKEV2kMFJb0zK" }, { id: "7xDh9xWg5mER07kIArgw1G" },
  { id: "6Aj0fNu6zu06zFF90C0PsG" }, { id: "1DXmdKSx3VTfykbW1Pp4N5" }, { id: "3kPtdzzTFXY0AZIR1Iyrtl" },
  { id: "0T0t8hpMZ2zKhdKlWoGAe4" }, { id: "7I9qtOev4WyHkzcjiL4xrD" }
];

const FeaturedArtists: React.FC = () => (
  <section id="artists" className="py-16 bg-[#090b13] text-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide">Featured Artists</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">Discover talented South African artists and support local music.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {ARTISTS.map((artist) => (
          <div key={artist.id} className="group relative rounded-xl overflow-hidden border border-[#2d2f36] bg-[#1a1d29] shadow-lg transition-all duration-300 hover:scale-[1.05] hover:border-white">
            <iframe src={`https://open.spotify.com/embed/artist/${artist.id}?utm_source=generator&theme=0`} width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  </section>
);
export default FeaturedArtists;