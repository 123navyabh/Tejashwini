import React, { useState } from 'react';
import { Send, Check, Loader2, Paperclip } from 'lucide-react';
import { db } from '../services/db';

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await db.sendContactMessage({
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString(),
        attachmentName: file?.name
    });
    
    setLoading(false);
    setSuccess(true);
    setFormData({ name: '', email: '', message: '' });
    setFile(null);
    
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">Contact Administration</h1>
        <p className="text-slate-500 mt-2">Have a question or need support? Send us a message.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Check size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Message Sent!</h3>
            <p className="text-slate-500 mt-2">We have received your inquiry and will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                    <input 
                        required
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input 
                        required
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        placeholder="john@portal.edu"
                    />
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea 
                    required
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
                    placeholder="How can we help you?"
                />
            </div>

            <div className="flex items-center space-x-3">
                 <div className="relative flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition text-slate-600 text-sm font-medium">
                    <Paperclip size={18} />
                    <span>{file ? file.name : 'Attach File'}</span>
                    <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                 </div>
                 {file && <button type="button" onClick={() => setFile(null)} className="text-xs text-red-500 hover:underline">Remove</button>}
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-lg flex items-center justify-center space-x-2 transition disabled:opacity-70"
            >
                {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                ) : (
                    <>
                        <span>Send Message</span>
                        <Send size={20} />
                    </>
                )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;