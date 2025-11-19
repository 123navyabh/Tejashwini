import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { db } from '../services/db';
import { Mark } from '../types';
import { Plus, Upload, FileText } from 'lucide-react';

const Marks: React.FC = () => {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form
  const [subject, setSubject] = useState('');
  const [examName, setExamName] = useState('');
  const [score, setScore] = useState('');
  const [total, setTotal] = useState('100');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setMarks(db.getMarks());
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMark: Mark = {
      id: Date.now().toString(),
      subject,
      examName,
      score: Number(score),
      total: Number(total),
      date: new Date().toISOString().split('T')[0],
      reportCardFile: file?.name
    };
    db.addMark(newMark);
    setMarks(db.getMarks());
    setIsModalOpen(false);
    // Reset
    setSubject('');
    setExamName('');
    setScore('');
    setFile(null);
  };

  // Process data for chart
  const chartData = marks.map(m => ({
    name: m.subject,
    score: (m.score / m.total) * 100,
    raw: m.score,
    total: m.total
  }));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Performance Tracker</h1>
          <p className="text-slate-500">Visualize your academic progress</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <Plus size={20} />
          <span>Add Score</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-6">Performance Overview (%)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score >= 90 ? '#10b981' : entry.score >= 75 ? '#4f46e5' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Recent Marks</h3>
          <div className="space-y-4">
            {marks.map((mark) => (
              <div key={mark.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">{mark.subject}</p>
                  <div className="flex items-center space-x-2">
                      <p className="text-xs text-slate-500">{mark.examName}</p>
                      {mark.reportCardFile && <FileText size={12} className="text-indigo-400" />}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-indigo-600">{mark.score}</span>
                  <span className="text-xs text-slate-400">/{mark.total}</span>
                </div>
              </div>
            ))}
            {marks.length === 0 && <p className="text-sm text-slate-500">No marks added yet.</p>}
          </div>
        </div>
      </div>

      {/* Add Mark Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Add Test Score</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input required value={subject} onChange={e => setSubject(e.target.value)} className="w-full input-field border rounded-lg p-2" placeholder="Math" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Exam Name</label>
                <input required value={examName} onChange={e => setExamName(e.target.value)} className="w-full input-field border rounded-lg p-2" placeholder="Midterm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Score</label>
                  <input type="number" required value={score} onChange={e => setScore(e.target.value)} className="w-full input-field border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total</label>
                  <input type="number" required value={total} onChange={e => setTotal(e.target.value)} className="w-full input-field border rounded-lg p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Report Card (Optional)</label>
                <div className="border border-slate-300 rounded-lg p-2 flex items-center space-x-2 hover:bg-slate-50 cursor-pointer relative">
                    <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                    <Upload size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-600 truncate">{file ? file.name : 'Upload file...'}</span>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-slate-300 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marks;