import React, { useState, useEffect } from "react";
import { 
  Music, FileText, Calendar, Mail, LogOut, 
  CheckCircle, XCircle, Eye, Trash2, Plus, X, Loader2, Send, GraduationCap, Home 
} from "lucide-react";
import { API_ENDPOINTS } from "../config/api";
import ThemeToggle from "./ThemeToggle";

// --- INTERFACES ---
interface Submission {
  id: string;
  artistName: string;
  trackTitle: string;
  email: string;
  genre: string;
  description: string;
  socialMedia: string;
  audioUrl: string;
  coverUrl?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: any;
}

interface Article { id: string; title: string; author: string; category: string; date: string; }
interface Event { id: string; title: string; date: string; time: string; location: string; type: string; link: string; image: string; }
interface Course { id: string; title: string; instructor: string; price: string; category: string; link: string; image: string; }
interface Message { id: string; name: string; email: string; subject: string; message: string; status: "read" | "unread"; }

interface AdminDashboardProps {
  username: string;
  onLogout: () => void;
  onBackToHome: () => void;
}

export default function AdminDashboard({ username, onLogout, onBackToHome }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("tracks");
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [notification, setNotification] = useState<{type: 'success'|'error', msg: string} | null>(null);

  // Data State
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Modals
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);

  // Forms
  const [newArticle, setNewArticle] = useState({ title: "", author: "", category: "", excerpt: "", content: "" });
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", location: "", description: "", type: "", link: "", image: "" });
  const [newCourse, setNewCourse] = useState({ title: "", instructor: "", price: "", category: "", link: "", image: "" });

  const showNotification = (type: 'success'|'error', msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3000);
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('admin_token'); 
    return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'tracks') {
        const res = await fetch(API_ENDPOINTS.ADMIN.TRACKS, { headers: getAuthHeader() });
        const data = await res.json();
        if (data.tracks) setSubmissions(data.tracks);
      } 
      else if (activeTab === 'articles') {
        const res = await fetch(API_ENDPOINTS.PUBLIC.ARTICLES); 
        const data = await res.json();
        if (data.articles) setArticles(data.articles);
      }
      else if (activeTab === 'events') {
        const res = await fetch(API_ENDPOINTS.PUBLIC.EVENTS);
        const data = await res.json();
        if (data.events) setEvents(data.events);
      }
      else if (activeTab === 'courses') {
        const res = await fetch(API_ENDPOINTS.PUBLIC.COURSES);
        const data = await res.json();
        if (data.courses) setCourses(data.courses);
      }
      else if (activeTab === 'messages') {
        const res = await fetch(API_ENDPOINTS.ADMIN.MESSAGES, { headers: getAuthHeader() });
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
      }
    } catch (e) {
      showNotification('error', "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // --- HANDLERS ---
  
  const handleAutoFill = async (type: 'event' | 'course') => {
    const link = type === 'event' ? newEvent.link : newCourse.link;
    if (!link) {
        showNotification('error', "Please paste a link first");
        return;
    }

    setScraping(true);
    try {
        const res = await fetch(API_ENDPOINTS.ADMIN.SCRAPE, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ link })
        });
        const data = await res.json();

        if (data.success) {
            if (type === 'event') {
                setNewEvent(prev => ({
                    ...prev,
                    title: data.data.title || prev.title,
                    description: data.data.description || prev.description,
                    image: data.data.image || prev.image,
                    location: data.data.location || prev.location,
                    date: data.data.date || prev.date,
                    time: data.data.time || prev.time,
                }));
            } else {
                setNewCourse(prev => ({
                    ...prev,
                    title: data.data.title || prev.title,
                    image: data.data.image || prev.image,
                    instructor: data.data.instructor || prev.instructor,
                    price: data.data.price || prev.price
                }));
            }
            showNotification('success', "Auto-filled successfully!");
        } else {
            showNotification('error', "Could not fetch data. Please fill manually.");
        }
    } catch (e) {
        showNotification('error', "Scraping failed.");
    } finally {
        setScraping(false);
    }
  };

  const handleTrackAction = async (id: string, action: string) => {
      try {
        await fetch(API_ENDPOINTS.ADMIN.TRACK_ACTION(id, action), { method: 'POST', headers: getAuthHeader() });
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: action === 'approve' ? 'approved' : 'rejected' } : s));
        const statusText = action === 'approve' ? 'approved' : 'rejected';
        showNotification('success', `Track ${statusText}`);
        setSelectedSubmission(null);
      } catch (e) { showNotification('error', "Action failed"); }
  };

  const deleteTrack = async (id: string) => {
    if(!confirm("Delete this track?")) return;
    try {
        await fetch(API_ENDPOINTS.ADMIN.DELETE_TRACK(id), { method: 'DELETE', headers: getAuthHeader() });
        setSubmissions(prev => prev.filter(s => s.id !== id));
        showNotification('success', "Track deleted");
    } catch (e) { showNotification('error', "Delete failed"); }
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch(API_ENDPOINTS.ADMIN.ARTICLES, {
            method: 'POST', headers: getAuthHeader(), body: JSON.stringify(newArticle)
        });
        if(res.ok) {
            showNotification('success', "Article published");
            setIsAddArticleOpen(false);
            fetchData();
            setNewArticle({ title: "", author: "", category: "", excerpt: "", content: "" });
        }
    } catch (e) { showNotification('error', "Failed to publish"); }
  };

  const deleteArticle = async (id: string) => {
    if(!confirm("Delete article?")) return;
    await fetch(API_ENDPOINTS.ADMIN.DELETE_ARTICLE(id), { method: 'DELETE', headers: getAuthHeader() });
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch(API_ENDPOINTS.ADMIN.EVENTS, {
            method: 'POST', headers: getAuthHeader(), body: JSON.stringify(newEvent)
        });
        if(res.ok) {
            showNotification('success', "Event created");
            setIsAddEventOpen(false);
            fetchData();
            setNewEvent({ title: "", date: "", time: "", location: "", description: "", type: "", link: "", image: "" });
        }
    } catch (e) { showNotification('error', "Failed to create event"); }
  };

  const deleteEvent = async (id: string) => {
    if(!confirm("Delete event?")) return;
    await fetch(API_ENDPOINTS.ADMIN.DELETE_EVENT(id), { method: 'DELETE', headers: getAuthHeader() });
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch(API_ENDPOINTS.ADMIN.COURSES, {
            method: 'POST', headers: getAuthHeader(), body: JSON.stringify(newCourse)
        });
        if(res.ok) {
            showNotification('success', "Course added");
            setIsAddCourseOpen(false);
            fetchData();
            setNewCourse({ title: "", instructor: "", price: "", category: "", link: "", image: "" });
        }
    } catch (e) { showNotification('error', "Failed to add course"); }
  };

  const deleteCourse = async (id: string) => {
    if(!confirm("Delete course?")) return;
    await fetch(API_ENDPOINTS.ADMIN.DELETE_COURSE(id), { method: 'DELETE', headers: getAuthHeader() });
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const deleteMessage = async (id: string) => {
    if(!confirm("Delete this message?")) return;
    try {
        await fetch(API_ENDPOINTS.ADMIN.DELETE_MESSAGE(id), { method: 'DELETE', headers: getAuthHeader() });
        setMessages(prev => prev.filter(m => m.id !== id));
        showNotification('success', "Message deleted");
        setSelectedMessage(null);
    } catch (e) { showNotification('error', "Delete failed"); }
  };

  // Styles
  const inputClass = "w-full bg-gray-50 dark:bg-[#090b13] border border-gray-300 dark:border-[#2d2f36] rounded p-3 text-gray-900 dark:text-white mb-4 focus:border-blue-500 outline-none transition-colors";
  const thClass = "text-left text-xs font-bold text-gray-500 uppercase py-4 border-b border-gray-200 dark:border-[#2d2f36] px-6 whitespace-nowrap bg-gray-50 dark:bg-[#151720]";
  const tdClass = "py-4 border-b border-gray-200 dark:border-[#2d2f36] text-sm text-gray-700 dark:text-gray-300 px-6 whitespace-nowrap";

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-[#090b13] dark:text-white font-sans p-4 md:p-10 relative transition-colors duration-300">
      
      {notification && <div className="fixed top-5 right-5 z-[100] bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:text-white p-4 rounded border animate-in slide-in-from-right shadow-xl max-w-[90vw]">{notification.msg}</div>}

      <div className="w-full max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-gray-200 dark:border-[#2d2f36] pb-6 gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-400 mt-1 text-sm md:text-base">Logged in as {username}</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto items-center">
                <div className="bg-white dark:bg-[#2d2f36] rounded-full shadow-sm"><ThemeToggle /></div>
                <button onClick={onBackToHome} className="flex-1 md:flex-none px-6 py-2 bg-white dark:bg-[#2d2f36] hover:bg-gray-100 dark:hover:bg-[#3d404a] rounded border border-gray-300 dark:border-gray-600 text-sm font-bold uppercase flex justify-center items-center gap-2 transition-colors text-gray-800 dark:text-white">
                    <Home className="w-4 h-4"/> <span className="hidden sm:inline">Home Site</span><span className="sm:hidden">Home</span>
                </button>
                <button onClick={onLogout} className="flex-1 md:flex-none px-6 py-2 border border-red-500 text-red-500 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20 rounded text-sm font-bold uppercase flex justify-center items-center gap-2 transition-colors">
                    <LogOut className="w-4 h-4"/> Logout
                </button>
            </div>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {['tracks', 'courses', 'events', 'articles', 'messages'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 border-b-2 uppercase font-bold text-sm tracking-wider transition-colors whitespace-nowrap ${activeTab === tab ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}>{tab}</button>
            ))}
        </div>

        <div className="bg-white dark:bg-[#1a1d29] border border-gray-200 dark:border-[#2d2f36] rounded-xl w-full overflow-hidden min-h-[400px] shadow-sm">
            {activeTab === 'tracks' && (
                <div className="w-full overflow-x-auto">
                    <div className="p-6 border-b border-gray-200 dark:border-[#2d2f36]"><h2 className="text-xl font-bold flex items-center gap-2">Music Submissions {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-500"/>}</h2></div>
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50 dark:bg-[#151720]"><tr><th className={thClass}>Artist</th><th className={thClass}>Title</th><th className={thClass}>Status</th><th className={thClass}>Action</th></tr></thead>
                        <tbody>
                            {submissions.map(s => (
                                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-[#222533] transition-colors">
                                    <td className={tdClass}>{s.artistName}</td>
                                    <td className={tdClass}>{s.trackTitle}</td>
                                    <td className={tdClass}><span className={`px-2 py-1 rounded border text-xs uppercase font-bold ${s.status === 'approved' ? 'bg-green-100 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-600 dark:text-green-400' : s.status === 'rejected' ? 'bg-red-100 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-600 dark:text-red-400' : 'bg-yellow-100 border-yellow-300 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-600 dark:text-yellow-400'}`}>{s.status}</span></td>
                                    <td className={tdClass}>
                                        <div className="flex gap-2">
                                            <button onClick={() => setSelectedSubmission(s)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><Eye className="w-4 h-4 text-gray-500 dark:text-gray-400 dark:hover:text-white"/></button>
                                            <button onClick={() => deleteTrack(s.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"><Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'articles' && (
                <div className="p-6"><button onClick={() => setIsAddArticleOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6 flex gap-2 font-bold text-sm items-center transition-colors"><Plus className="w-4 h-4"/> Add Article</button><div className="overflow-x-auto"><table className="w-full min-w-[600px]"><thead className="bg-gray-50 dark:bg-[#151720]"><tr><th className={thClass}>Title</th><th className={thClass}>Author</th><th className={thClass}>Action</th></tr></thead><tbody>{articles.map(a => <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-[#222533] transition-colors"><td className={tdClass}>{a.title}</td><td className={tdClass}>{a.author}</td><td className={tdClass}><button onClick={() => deleteArticle(a.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"><Trash2 className="w-4 h-4 text-red-500"/></button></td></tr>)}</tbody></table></div></div>
            )}

            {activeTab === 'events' && (
                <div className="p-6"><button onClick={() => setIsAddEventOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6 flex gap-2 font-bold text-sm items-center transition-colors"><Plus className="w-4 h-4"/> Add Event</button><div className="overflow-x-auto"><table className="w-full min-w-[600px]"><thead className="bg-gray-50 dark:bg-[#151720]"><tr><th className={thClass}>Title</th><th className={thClass}>Date</th><th className={thClass}>Link</th><th className={thClass}>Action</th></tr></thead><tbody>{events.map(e => <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-[#222533] transition-colors"><td className={tdClass}>{e.title}</td><td className={tdClass}>{e.date}</td><td className={tdClass}><a href={e.link} target="_blank" className="text-blue-400 hover:underline">Link</a></td><td className={tdClass}><button onClick={() => deleteEvent(e.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"><Trash2 className="w-4 h-4 text-red-500"/></button></td></tr>)}</tbody></table></div></div>
            )}

            {activeTab === 'courses' && (
                <div className="p-6"><button onClick={() => setIsAddCourseOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6 flex gap-2 font-bold text-sm items-center transition-colors"><Plus className="w-4 h-4"/> Add Course</button><div className="overflow-x-auto"><table className="w-full min-w-[600px]"><thead className="bg-gray-50 dark:bg-[#151720]"><tr><th className={thClass}>Title</th><th className={thClass}>Instructor</th><th className={thClass}>Link</th><th className={thClass}>Action</th></tr></thead><tbody>{courses.map(c => <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-[#222533] transition-colors"><td className={tdClass}>{c.title}</td><td className={tdClass}>{c.instructor}</td><td className={tdClass}><a href={c.link} target="_blank" className="text-blue-400 hover:underline">Link</a></td><td className={tdClass}><button onClick={() => deleteCourse(c.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"><Trash2 className="w-4 h-4 text-red-500"/></button></td></tr>)}</tbody></table></div></div>
            )}

            {activeTab === 'messages' && (
                <div className="overflow-x-auto"><div className="p-6 border-b border-gray-200 dark:border-[#2d2f36]"><h2 className="text-xl font-bold">Inbox</h2></div><table className="w-full min-w-[600px]"><thead className="bg-gray-50 dark:bg-[#151720]"><tr><th className={thClass}>From</th><th className={thClass}>Subject</th><th className={thClass}>Action</th></tr></thead><tbody>{messages.map(m => <tr key={m.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-[#222533] transition-colors" onClick={() => setSelectedMessage(m)}><td className={tdClass}>{m.name}</td><td className={tdClass}>{m.subject}</td><td className={tdClass}><button onClick={(e) => {e.stopPropagation(); deleteMessage(m.id)}} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"><Trash2 className="w-4 h-4 text-red-500"/></button></td></tr>)}</tbody></table></div>
            )}
        </div>
      </div>

      {/* MODALS */}
      
      {isAddArticleOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95 duration-200">
            <div className="bg-white dark:bg-[#1a1d29] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-8 border border-gray-200 dark:border-[#2d2f36] shadow-2xl transition-colors">
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Publish Article</h3>
                <form onSubmit={handleAddArticle}>
                    <input className={inputClass} placeholder="Title" value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} required/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input className={inputClass} placeholder="Author" value={newArticle.author} onChange={e => setNewArticle({...newArticle, author: e.target.value})} required/>
                        <input className={inputClass} placeholder="Category" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value})} required/>
                    </div>
                    <textarea className={inputClass} placeholder="Excerpt" rows={2} value={newArticle.excerpt} onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})} required/>
                    <textarea className={inputClass} placeholder="Full Content" rows={5} value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} required/>
                    <div className="flex justify-end gap-3"><button type="button" onClick={() => setIsAddArticleOpen(false)} className="px-4 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Cancel</button><button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold transition-colors">Publish</button></div>
                </form>
            </div>
        </div>
      )}

      {isAddEventOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95 duration-200">
            <div className="bg-white dark:bg-[#1a1d29] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-8 border border-gray-200 dark:border-[#2d2f36] shadow-2xl transition-colors">
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Create Event</h3>
                <form onSubmit={handleAddEvent}>
                    <div className="mb-6 bg-gray-100 dark:bg-[#090b13] p-4 rounded border border-gray-300 dark:border-[#2d2f36]">
                        <label className="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase mb-2 block">Step 1: Paste Ticket Link</label>
                        <div className="flex gap-2">
                            <input className="flex-1 bg-white dark:bg-[#1a1d29] border border-gray-300 dark:border-[#2d2f36] rounded p-3 text-gray-900 dark:text-white focus:border-blue-500 outline-none" placeholder="https://ticketmaster.com/event/..." value={newEvent.link} onChange={e => setNewEvent({...newEvent, link: e.target.value})} required />
                            <button type="button" onClick={() => handleAutoFill('event')} disabled={scraping} className="bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-600/50 px-4 rounded font-bold uppercase text-xs hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap">{scraping ? <Loader2 className="w-4 h-4 animate-spin"/> : "Auto-Fill"}</button>
                        </div>
                    </div>
                    <input className={inputClass} placeholder="Event Title" value={newEvent.title} onChange={e=>setNewEvent({...newEvent, title: e.target.value})} required/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input className={inputClass} type="date" value={newEvent.date} onChange={e=>setNewEvent({...newEvent, date: e.target.value})} required/>
                        <input className={inputClass} placeholder="Time" value={newEvent.time} onChange={e=>setNewEvent({...newEvent, time: e.target.value})} required/>
                    </div>
                    <input className={inputClass} placeholder="Location" value={newEvent.location} onChange={e=>setNewEvent({...newEvent, location: e.target.value})} required/>
                    <textarea className={inputClass} placeholder="Description" rows={3} value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} required/>
                    <div className="flex gap-4 items-start mb-4"><input className={`${inputClass} flex-1 mb-0`} placeholder="Image URL" value={newEvent.image} onChange={e=>setNewEvent({...newEvent, image: e.target.value})}/>{newEvent.image && <img src={newEvent.image} alt="Preview" className="w-12 h-12 rounded border border-gray-300 dark:border-[#2d2f36] object-cover bg-black" />}</div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-[#2d2f36]"><button type="button" onClick={() => setIsAddEventOpen(false)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Cancel</button><button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold transition-colors">Create</button></div>
                </form>
            </div>
        </div>
      )}

      {isAddCourseOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95 duration-200">
            <div className="bg-white dark:bg-[#1a1d29] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-8 border border-gray-200 dark:border-[#2d2f36] shadow-2xl transition-colors">
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Add Course</h3>
                <form onSubmit={handleAddCourse}>
                    <div className="mb-6 bg-gray-100 dark:bg-[#090b13] p-4 rounded border border-gray-300 dark:border-[#2d2f36]">
                        <label className="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase mb-2 block">Step 1: Paste Link</label>
                        <div className="flex gap-2">
                            <input className="flex-1 bg-white dark:bg-[#1a1d29] border border-gray-300 dark:border-[#2d2f36] rounded p-3 text-gray-900 dark:text-white focus:border-blue-500 outline-none" placeholder="https://www.udemy.com/course/..." value={newCourse.link} onChange={e => setNewCourse({...newCourse, link: e.target.value})} required />
                            <button type="button" onClick={() => handleAutoFill('course')} disabled={scraping} className="bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-600/50 px-4 rounded font-bold uppercase text-xs hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap">{scraping ? <Loader2 className="w-4 h-4 animate-spin"/> : "Auto-Fill"}</button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <input className={inputClass} placeholder="Course Title" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} required/>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input className={inputClass} placeholder="Instructor" value={newCourse.instructor} onChange={e => setNewCourse({...newCourse, instructor: e.target.value})} required/>
                            <input className={inputClass} placeholder="Price (e.g. 1499)" value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} required/>
                        </div>
                        <input className={inputClass} placeholder="Category" value={newCourse.category} onChange={e => setNewCourse({...newCourse, category: e.target.value})} required/>
                        <div className="flex gap-4 items-start"><input className={`${inputClass} flex-1 mb-0`} placeholder="Image URL" value={newCourse.image} onChange={e => setNewCourse({...newCourse, image: e.target.value})}/>{newCourse.image && <div className="w-20 h-20 rounded border border-gray-300 dark:border-[#2d2f36] overflow-hidden bg-black shrink-0"><img src={newCourse.image} alt="Preview" className="w-full h-full object-cover" /></div>}</div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-[#2d2f36]"><button type="button" onClick={() => setIsAddCourseOpen(false)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Cancel</button><button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-bold transition-colors shadow-lg">Add Course</button></div>
                </form>
            </div>
        </div>
      )}

      {/* TRACK DETAILS MODAL - UPDATED: Image on Right, Clickable */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95 duration-200" onClick={() => setSelectedSubmission(null)}>
            <div className="bg-white dark:bg-[#1a1d29] border border-gray-200 dark:border-[#2d2f36] w-full max-w-2xl rounded-xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto transition-colors" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between mb-6 border-b border-gray-200 dark:border-[#2d2f36] pb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedSubmission.trackTitle}</h3>
                    <button onClick={() => setSelectedSubmission(null)}><X className="w-6 h-6 text-gray-500 hover:text-red-500 transition-colors"/></button>
                </div>
                
                {/* 2-Column Layout: Left (Info), Right (Clickable Image) */}
                <div className="flex flex-col sm:flex-row gap-6">
                    {/* LEFT COLUMN: Info & Audio */}
                    <div className="flex-1 space-y-4 text-gray-600 dark:text-gray-300">
                        <p><span className="text-gray-500 uppercase text-xs font-bold block mb-1">Artist</span> {selectedSubmission.artistName}</p>
                        <p><span className="text-gray-500 uppercase text-xs font-bold block mb-1">Description</span> {selectedSubmission.description}</p>
                        
                        <div className="pt-4">
                            <p className="text-gray-500 uppercase text-xs font-bold mb-2">Listen Preview</p>
                            {selectedSubmission.audioUrl ? (
                                <audio controls className="w-full h-10 rounded" src={selectedSubmission.audioUrl}>Your browser does not support audio.</audio>
                            ) : <p className="text-red-500 text-sm">Audio URL missing</p>}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Image (Clickable to open in new tab) */}
                    {selectedSubmission.coverUrl && (
                        <div className="w-32 shrink-0">
                            <a 
                                href={selectedSubmission.coverUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="block group relative cursor-zoom-in"
                                title="Click to view full size"
                            >
                                <img 
                                    src={selectedSubmission.coverUrl} 
                                    alt="Cover Art" 
                                    className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-[#2d2f36] shadow-md group-hover:brightness-90 transition-all" 
                                />
                                {/* Overlay Eye Icon on Hover */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                                    <Eye className="w-8 h-8 text-white drop-shadow-lg" />
                                </div>
                            </a>
                            <p className="text-xs text-center mt-2 text-gray-400 dark:text-gray-500">Click to view</p>
                        </div>
                    )}
                </div>
                
                {selectedSubmission.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-[#2d2f36]">
                        <button onClick={() => handleTrackAction(selectedSubmission.id, 'approve')} className="bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold uppercase text-xs flex justify-center gap-2 items-center transition-colors"><CheckCircle className="w-4 h-4"/> Approve</button>
                        <button onClick={() => handleTrackAction(selectedSubmission.id, 'reject')} className="bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold uppercase text-xs flex justify-center gap-2 items-center transition-colors"><XCircle className="w-4 h-4"/> Reject</button>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95 duration-200" onClick={() => setSelectedMessage(null)}>
            <div className="bg-white dark:bg-[#1a1d29] w-full max-w-lg rounded-xl p-8 border border-gray-200 dark:border-[#2d2f36] shadow-2xl max-h-[90vh] overflow-y-auto transition-colors" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">Message Details</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">From: {selectedMessage.name} ({selectedMessage.email})</p>
                    </div>
                    <button onClick={() => setSelectedMessage(null)}><X className="w-6 h-6 text-gray-500 hover:text-red-500 transition-colors"/></button>
                </div>
                <div className="mb-6"><p className="text-xs text-gray-500 uppercase font-bold mb-2">Subject</p><p className="font-bold text-lg text-gray-800 dark:text-gray-100">{selectedMessage.subject}</p></div>
                <div className="mb-8"><p className="text-xs text-gray-500 uppercase font-bold mb-2">Message</p><div className="bg-gray-100 dark:bg-[#090b13] p-4 rounded border border-gray-200 dark:border-[#2d2f36] text-sm whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300">{selectedMessage.message}</div></div>
                <a href={`mailto:${selectedMessage.email}`} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-bold uppercase text-sm w-full flex justify-center items-center gap-2 transition-colors"><Send className="w-4 h-4"/> Respond via Email</a>
            </div>
        </div>
      )}

    </div>
  );
}