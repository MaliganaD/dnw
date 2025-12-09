import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { API_ENDPOINTS } from "../config/api";
import { User, Lock, Loader2, AlertCircle, ArrowLeft } from "lucide-react";

interface AdminLoginProps { onLogin: (user: string) => void; onBackToHome: () => void; }

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBackToHome }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setLoading(true);
    try {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const res = await fetch(API_ENDPOINTS.ADMIN.LOGIN, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cred.user.email, password: "firebase-verified" }) 
        });
        const data = await res.json();
        if (data.success) { localStorage.setItem('admin_token', data.token); onLogin(cred.user.email || "Admin"); } 
        else { setErr(data.message || "Unauthorized"); }
    } catch (e: any) { setErr("Invalid credentials or server error"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#090b13] text-gray-900 dark:text-white relative p-4 transition-colors duration-300">
        <button onClick={onBackToHome} className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors font-bold uppercase text-sm">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back to Home</span>
        </button>
        <form onSubmit={handleLogin} className="bg-white dark:bg-[#1a1d29] p-8 rounded-xl border border-gray-200 dark:border-[#2d2f36] w-full max-w-md shadow-2xl space-y-6 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-center mb-2">Admin Access</h2>
            {err && <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/50 dark:border-red-500 dark:text-red-200 p-3 rounded text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" /> {err}</div>}
            <div className="space-y-4">
                <div className="relative"><User className="absolute left-3 top-3 w-5 h-5 text-gray-400" /><input className="w-full bg-gray-50 dark:bg-[#090b13] pl-10 p-3 rounded border border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none transition-colors" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div className="relative"><Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" /><input className="w-full bg-gray-50 dark:bg-[#090b13] pl-10 p-3 rounded border border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none transition-colors" type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} /></div>
            </div>
            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-bold uppercase tracking-widest text-sm transition-all flex justify-center items-center gap-2 shadow-lg">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Admin Login"}</button>
        </form>
    </div>
  );
};
export default AdminLogin;