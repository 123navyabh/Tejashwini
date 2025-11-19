import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Award, X, Upload, Plus } from 'lucide-react';
import { db } from '../services/db';
import { Achievement } from '../types';

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setAchievements(db.getAchievements());
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAch: Achievement = {
        id: Date.now().toString(),
        title,
        description: desc,
        date,
        badgeIcon: 'award', // Default
        certificateFile: file?.name
    };
    db.addAchievement(newAch);
    setAchievements(db.getAchievements());
    setIsModalOpen(false);
    setTitle(''); setDesc(''); setDate(''); setFile(null);
  };

  const getIcon = (name: string) => {
    switch (name) {
        case 'award': return <Award size={32} />;
        case 'code': return <Star size={32} />;
        default: return <Medal size={32} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
                <Trophy size={28} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Achievements Hall</h1>
                <p className="text-slate-500">Your certificates and awards</p>
            </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Add Achievement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => (
          <div key={ach.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-yellow-100 to-transparent rounded-bl-full -mr-4 -mt-4 opacity-50 transition-opacity group-hover:opacity-100"></div>
            
            <div className="mb-4 text-yellow-500">
                {getIcon(ach.badgeIcon)}
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-2">{ach.title}</h3>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">{ach.description}</p>
            
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Earned on {ach.date}</span>
                {ach.certificateFile && (
                    <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded flex items-center">
                        <Award size={10} className="mr-1"/> Cert
                    </span>
                )}
            </div>
          </div>
        ))}
        
        {/* Add New Placeholder */}
        <button onClick={() => setIsModalOpen(true)} className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition h-full min-h-[200px]">
            <Trophy size={32} className="mb-2 opacity-50" />
            <span className="font-medium">Add New Achievement</span>
        </button>
      </div>

       {/* Add Achievement Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24}/></button>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Add Achievement</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-lg p-2" placeholder="Dean's List" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea required value={desc} onChange={e => setDesc(e.target.value)} className="w-full border rounded-lg p-2" rows={3} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date Earned</label>
                        <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full border rounded-lg p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Certificate Proof</label>
                        <div className="border border-slate-300 rounded-lg p-2 flex items-center space-x-2 hover:bg-slate-50 cursor-pointer relative">
                            <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                            <Upload size={16} className="text-slate-400" />
                            <span className="text-sm text-slate-600 truncate">{file ? file.name : 'Upload certificate...'}</span>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium">Save Achievement</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;