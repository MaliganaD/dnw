import React from 'react';

const FeaturedArtistItem: React.FC<{ id: string }> = ({ id }) => (
  <div className="group relative rounded-xl overflow-hidden border border-[#2d2f36] bg-[#1a1d29] shadow-lg transition-all duration-300 hover:scale-[1.05] hover:border-white hover:shadow-2xl">
    <iframe
      src={`https://open.spotify.com/embed/artist/${id}?utm_source=generator&theme=0`}
      width="100%"
      height="352"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="rounded-lg"
      title={`Spotify Player ${id}`}
    />
  </div>
);
export default FeaturedArtistItem;