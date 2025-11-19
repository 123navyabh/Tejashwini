import React, { useState, useEffect } from 'react';
import { FlaskConical, File, Calendar, Plus, Upload, X } from 'lucide-react';
import { db } from '../services/db';
import { LabResource } from '../types';

const Labs: React.FC = () => {
  const [labs, setLabs] = useState<LabResource[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [schedule, setSchedule] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setLabs(db.getLabs());
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLab: LabResource = {
        id: Date.now().toString(),
        title,
        labCode: code,
        schedule,
        resources: file ? [file.name] : []
    };
    db.addLab(newLab);
    setLabs(db.getLabs());
    setIsModalOpen(false);
    setTitle(''); setCode(''); setSchedule(''); setFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Laboratory Resources</h1>
            <p className="text-slate-500">Access lab schedules and manuals</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <Plus size={20} />
          <span>Add Lab</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {labs.map((lab) => (
          <div key={lab.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-indigo-600">
                    <FlaskConical size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">{lab.title}</h3>
                    <span className="text-xs font-mono text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">{lab.labCode}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-sm text-slate-500">
                <Calendar size={14} />
                <span>{lab.schedule}</span>
              </div>
            </div>
            <div className="p-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Available Resources</h4>
                <div className="space-y-2">
                    {lab.resources.length > 0 ? lab.resources.map((res, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition cursor-pointer">
                            <div className="flex items-center space-x-3">
                                <File size={16} className="text-slate-400" />
                                <span className="text-sm text-slate-600">{res}</span>
                            </div>
                            <span className="text-xs text-indigo-600 font-medium">Download</span>
                        </div>
                    )) : <span className="text-sm text-slate-400 italic">No resources uploaded.</span>}
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Lab Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24}/></button>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Add Lab Session</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Lab Title</label>
                        <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-lg p-2" placeholder="Physics Lab 101" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Lab Code</label>
                        <input required value={code} onChange={e => setCode(e.target.value)} className="w-full border rounded-lg p-2" placeholder="PHY-101" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Schedule</label>
                        <input required value={schedule} onChange={e => setSchedule(e.target.value)} className="w-full border rounded-lg p-2" placeholder="Mon 10:00 AM" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Resource Upload</label>
                        <div className="border border-slate-300 rounded-lg p-2 flex items-center space-x-2 hover:bg-slate-50 cursor-pointer relative">
                            <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                            <Upload size={16} className="text-slate-400" />
                            <span className="text-sm text-slate-600 truncate">{file ? file.name : 'Upload manual/guide...'}</span>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium">Save Lab</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Labs;