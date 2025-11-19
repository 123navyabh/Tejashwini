import React, { useState, useEffect } from 'react';
import { CalendarCheck, Plus, Trash2, CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { db } from '../services/db';
import { AttendanceRecord } from '../types';

const Attendance: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('Mathematics');
  const [status, setStatus] = useState<'Present' | 'Absent' | 'Excused'>('Present');

  // Preset Subjects (In a real app, these might come from a DB table)
  const subjects = ['Mathematics', 'Physics', 'Computer Science', 'English', 'History', 'Chemistry'];

  useEffect(() => {
    setRecords(db.getAttendance());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      date,
      subject,
      status
    };
    db.addAttendance(newRecord);
    setRecords(db.getAttendance());
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
        db.deleteAttendance(id);
        setRecords(db.getAttendance());
    }
  };

  // Calculations
  const totalClasses = records.length;
  const totalPresent = records.filter(r => r.status === 'Present' || r.status === 'Excused').length; // Counting Excused as Present for credit
  const totalAbsent = records.filter(r => r.status === 'Absent').length;
  const overallPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 100;

  // Prepare Chart Data (Attendance by Subject)
  const subjectStats = subjects.map(subj => {
    const subjRecords = records.filter(r => r.subject === subj);
    const total = subjRecords.length;
    if (total === 0) return null;
    const present = subjRecords.filter(r => r.status === 'Present' || r.status === 'Excused').length;
    return {
      name: subj,
      percentage: Math.round((present / total) * 100),
      total
    };
  }).filter(Boolean);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Attendance Sheet</h1>
          <p className="text-slate-500">Track your daily class attendance</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition shadow-sm"
        >
          <Plus size={20} />
          <span>Mark Attendance</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className={`p-4 rounded-full ${overallPercentage >= 75 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Overall Attendance</p>
            <p className={`text-3xl font-bold ${overallPercentage >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {overallPercentage}%
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-4 rounded-full bg-indigo-100 text-indigo-600">
            <CalendarCheck size={28} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Classes</p>
            <p className="text-3xl font-bold text-slate-800">{totalClasses}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-4 rounded-full bg-red-100 text-red-600">
            <XCircle size={28} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Days Absent</p>
            <p className="text-3xl font-bold text-slate-800">{totalAbsent}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Subject-wise Attendance (%)</h3>
          {subjectStats.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectStats as any} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [`${value}%`, 'Attendance']}
                  />
                  <Bar dataKey="percentage" barSize={24} radius={[0, 4, 4, 0]}>
                    {(subjectStats as any).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.percentage >= 75 ? '#4f46e5' : entry.percentage >= 60 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
              <p>Not enough data to display chart.</p>
            </div>
          )}
        </div>

        {/* Recent History List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Recent History</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {records.length === 0 && (
                <p className="text-center text-slate-400 mt-10">No attendance records yet.</p>
            )}
            {records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record) => (
              <div key={record.id} className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-10 rounded-full ${
                    record.status === 'Present' ? 'bg-emerald-500' : 
                    record.status === 'Absent' ? 'bg-red-500' : 'bg-amber-500'
                  }`}></div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">{record.subject}</h4>
                    <p className="text-xs text-slate-500">{record.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        record.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 
                        record.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                        {record.status}
                    </span>
                    <button 
                        onClick={() => handleDelete(record.id)}
                        className="text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Attendance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X size={24}/>
            </button>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Mark Attendance</h2>
            <p className="text-slate-500 text-sm mb-6">Update your daily log manually.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input 
                    type="date" 
                    required 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <select 
                    value={subject} 
                    onChange={e => setSubject(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <div className="grid grid-cols-3 gap-3">
                    {(['Present', 'Absent', 'Excused'] as const).map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setStatus(s)}
                            className={`py-2 rounded-lg text-sm font-medium border transition ${
                                status === s 
                                    ? s === 'Present' ? 'bg-emerald-600 text-white border-emerald-600' 
                                    : s === 'Absent' ? 'bg-red-600 text-white border-red-600' 
                                    : 'bg-amber-500 text-white border-amber-500'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold shadow-md shadow-indigo-200 transition transform active:scale-[0.98] mt-4"
              >
                Save Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;