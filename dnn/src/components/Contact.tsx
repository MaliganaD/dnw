import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from "../config/api";

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
        const res = await fetch(API_ENDPOINTS.PUBLIC.CONTACT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if(res.ok) {
            setStatus("Message Sent!");
            setForm({ name: '', email: '', subject: 'General Inquiry', message: '' });
        } else {
            setStatus("Failed to send.");
        }
    } catch (e) { setStatus("Error sending message."); }
    finally { setLoading(false); }
  };

  return (
    <section id="contact" className="py-20 bg-[#090b13] text-white">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
            <h2 className="text-4xl font-bold">Contact Us</h2>
            <div className="space-y-4">
                <div className="bg-[#1a1d29] p-6 rounded-xl border border-[#2d2f36] flex gap-4 items-center"><Mail className="text-blue-400" /> <div><h4 className="font-bold">Email</h4><p className="text-gray-400 text-sm">info@dunu.com</p></div></div>
                <div className="bg-[#1a1d29] p-6 rounded-xl border border-[#2d2f36] flex gap-4 items-center"><Phone className="text-blue-400" /> <div><h4 className="font-bold">Phone</h4><p className="text-gray-400 text-sm">+27 11 123 4567</p></div></div>
            </div>
        </div>
        <div className="bg-[#1a1d29] p-8 rounded-xl border border-[#2d2f36]">
            <h3 className="text-2xl font-bold mb-6">Send Message</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <input className="w-full bg-[#090b13] border border-[#2d2f36] p-3 rounded text-white" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required/>
                <input className="w-full bg-[#090b13] border border-[#2d2f36] p-3 rounded text-white" type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required/>
                <input className="w-full bg-[#090b13] border border-[#2d2f36] p-3 rounded text-white" placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required/>
                <textarea className="w-full bg-[#090b13] border border-[#2d2f36] p-3 rounded text-white" rows={4} placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required/>
                <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold uppercase flex justify-center gap-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <><Send className="w-4 h-4"/> Send</>}
                </button>
                {status && <p className="text-center text-sm mt-2">{status}</p>}
            </form>
        </div>
      </div>
    </section>
  );
};
export default Contact;