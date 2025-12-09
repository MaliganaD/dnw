import React from 'react';
import { MapPin, Clock, ChevronRight } from 'lucide-react';

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  attendees: number;
  type: string;
}

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => (
  <div onClick={onClick} className="group bg-[#1a1d29] border border-[#2d2f36] rounded-xl overflow-hidden cursor-pointer shadow-lg hover:border-white transition-all duration-300">
    <div className="aspect-video relative overflow-hidden">
      <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/20 rounded-lg p-2 text-center min-w-[60px]">
        <span className="block text-xs uppercase text-gray-300">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
        <span className="block text-xl font-bold text-white">{new Date(event.date).getDate()}</span>
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{event.type}</span>
        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
      </div>
      <h3 className="text-xl font-bold mb-2 line-clamp-1 text-white group-hover:text-blue-400">{event.title}</h3>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <MapPin className="w-4 h-4" /> <span className="truncate">{event.location}</span>
      </div>
    </div>
  </div>
);
export default EventCard;