import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, X, Ticket } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";

const Events: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetch(API_ENDPOINTS.PUBLIC.EVENTS)
        .then(res => res.json())
        .then(data => setEvents(data.events || []))
        .catch(err => console.error(err));
  }, []);

  return (
    <section id="events" className="py-20 bg-[#090b13] text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-10 text-center">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} onClick={() => setSelected(event)} className="group bg-[#1a1d29] border border-[#2d2f36] rounded-xl overflow-hidden cursor-pointer hover:border-white transition-all">
                {event.image && <div className="aspect-video relative"><img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /></div>}
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400">{event.title}</h3>
                    <div className="flex gap-2 text-sm text-gray-500"><MapPin className="w-4 h-4" /> {event.location}</div>
                    <div className="flex gap-2 text-sm text-gray-500 mt-2"><Calendar className="w-4 h-4"/> {event.date}</div>
                </div>
            </div>
          ))}
        </div>
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelected(null)}>
            <div className="bg-[#1a1d29] border border-[#2d2f36] w-full max-w-2xl rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold">{selected.title}</h2>
                        <button onClick={() => setSelected(null)}><X className="w-6 h-6"/></button>
                    </div>
                    {selected.image && <img src={selected.image} className="w-full h-48 object-cover rounded-lg mb-6" alt="" />}
                    <div className="grid grid-cols-2 gap-4 mb-6 text-gray-400">
                        <div className="flex gap-2"><Calendar className="w-4 h-4"/> {selected.date}</div>
                        <div className="flex gap-2"><Clock className="w-4 h-4"/> {selected.time}</div>
                        <div className="flex gap-2"><MapPin className="w-4 h-4"/> {selected.location}</div>
                    </div>
                    <p className="text-gray-300 mb-8">{selected.description}</p>
                    <button onClick={() => window.open(selected.link, '_blank')} className="w-full bg-white text-black py-3 rounded font-bold uppercase flex justify-center gap-2 hover:bg-gray-200">
                        <Ticket className="w-5 h-5"/> Buy Ticket
                    </button>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};
export default Events;