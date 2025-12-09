import React, { useState } from 'react';
import { Upload, Music, Image as ImageIcon, Loader2, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase"; // Ensure this import is correct
import { API_ENDPOINTS } from "../config/api";

interface MusicUploadProps {
  onBackToHome: () => void;
}

const MusicUpload: React.FC<MusicUploadProps> = ({ onBackToHome }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    artistName: "",
    trackTitle: "",
    email: "",
    genre: "",
    description: "",
    socialMedia: "", // Instagram/Twitter handle
  });

  // File State
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'cover') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'audio') setAudioFile(e.target.files[0]);
      else setCoverFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!audioFile) throw new Error("Please upload an audio file.");

      // 1. Upload Audio to Firebase Storage
      const audioRef = ref(storage, `tracks/${Date.now()}_${audioFile.name}`);
      const audioSnapshot = await uploadBytes(audioRef, audioFile);
      const audioUrl = await getDownloadURL(audioSnapshot.ref);

      // 2. Upload Cover Art (Optional)
      let coverUrl = "";
      if (coverFile) {
        const coverRef = ref(storage, `covers/${Date.now()}_${coverFile.name}`);
        const coverSnapshot = await uploadBytes(coverRef, coverFile);
        coverUrl = await getDownloadURL(coverSnapshot.ref);
      }

      // 3. Send Data to Python Backend
      const payload = {
        ...formData,
        audioUrl,
        coverUrl
      };

      const res = await fetch(API_ENDPOINTS.MUSIC.UPLOAD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ artistName: "", trackTitle: "", email: "", genre: "", description: "", socialMedia: "" });
        setAudioFile(null);
        setCoverFile(null);
      } else {
        throw new Error(data.message || "Submission failed.");
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#090b13] text-gray-900 dark:text-white p-4 transition-colors duration-300">
        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold">Submission Received!</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Your track has been sent to our A&R team. Keep an eye on your email for updates.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <button onClick={() => setSuccess(false)} className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-[#2d2f36] transition-colors">
              Upload Another
            </button>
            <button onClick={onBackToHome} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition-colors">
              Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Styles
  const inputClass = "w-full bg-white dark:bg-[#1a1d29] border border-gray-300 dark:border-[#2d2f36] rounded p-3 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors";
  const labelClass = "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 tracking-wider";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#090b13] text-gray-900 dark:text-white p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <button onClick={onBackToHome} className="flex items-center gap-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white mb-8 transition-colors font-bold uppercase text-xs">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Submit Your Demo</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Ready to be heard? Upload your best track for review. We accept MP3 and WAV formats.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#1a1d29] border border-gray-200 dark:border-[#2d2f36] rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden transition-colors">
          
          {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="font-bold text-lg">Uploading your masterpiece...</p>
              <p className="text-sm text-gray-500">Please wait, this might take a moment.</p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">Upload Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Audio Upload */}
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer group ${audioFile ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-300 dark:border-[#2d2f36] hover:border-blue-500 dark:hover:border-blue-500'}`}>
                <input type="file" id="audio" accept="audio/*" className="hidden" onChange={e => handleFileChange(e, 'audio')} />
                <label htmlFor="audio" className="cursor-pointer block w-full h-full">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Music className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="font-bold text-sm mb-1">{audioFile ? "Audio Selected" : "Upload Track"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate px-2">{audioFile ? audioFile.name : "MP3 or WAV (Max 10MB)"}</p>
                </label>
              </div>

              {/* Cover Art Upload */}
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer group ${coverFile ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-300 dark:border-[#2d2f36] hover:border-purple-500 dark:hover:border-purple-500'}`}>
                <input type="file" id="cover" accept="image/*" className="hidden" onChange={e => handleFileChange(e, 'cover')} />
                <label htmlFor="cover" className="cursor-pointer block w-full h-full">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="font-bold text-sm mb-1">{coverFile ? "Image Selected" : "Upload Artwork"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate px-2">{coverFile ? coverFile.name : "JPG or PNG (Optional)"}</p>
                </label>
              </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Artist Name</label>
                <input className={inputClass} placeholder="Stage Name" value={formData.artistName} onChange={e => setFormData({...formData, artistName: e.target.value})} required />
              </div>
              <div>
                <label className={labelClass}>Track Title</label>
                <input className={inputClass} placeholder="Song Name" value={formData.trackTitle} onChange={e => setFormData({...formData, trackTitle: e.target.value})} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Email Address</label>
                <input type="email" className={inputClass} placeholder="you@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div>
                <label className={labelClass}>Genre</label>
                <select className={inputClass} value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} required>
                  <option value="">Select Genre</option>
                  <option value="Amapiano">Amapiano</option>
                  <option value="Hip Hop">Hip Hop</option>
                  <option value="Afro Pop">Afro Pop</option>
                  <option value="House">House</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Social Media Handle</label>
              <input className={inputClass} placeholder="@instagram / @twitter" value={formData.socialMedia} onChange={e => setFormData({...formData, socialMedia: e.target.value})} />
            </div>

            <div>
              <label className={labelClass}>Description / Pitch</label>
              <textarea rows={4} className={inputClass} placeholder="Tell us about the song..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-sm shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2">
              {loading ? "Processing..." : <><Upload className="w-5 h-5" /> Submit Demo</>}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default MusicUpload;