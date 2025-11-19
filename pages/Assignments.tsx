import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Circle, Clock, Upload, Paperclip } from 'lucide-react';
import { db } from '../services/db';
import { Assignment } from '../types';

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);

  useEffect(() => {
    setAssignments(db.getAssignments());
  }, []);

  const handleStatusToggle = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'PENDING' ? 'SUBMITTED' : 'PENDING';
    db.updateAssignmentStatus(id, newStatus as any);
    setAssignments(db.getAssignments());
  };

  const handleUploadClick = (id: string) => {
    setActiveAssignmentId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && activeAssignmentId) {
      const fileName = e.target.files[0].name;
      alert(`Successfully uploaded ${fileName} for assignment.`);
      // Auto mark as submitted for demo flow
      handleStatusToggle(activeAssignmentId, 'PENDING');
      setActiveAssignmentId(null);
      // Reset input
      e.target.value = ''; 
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Assignments</h1>
        <p className="text-slate-500">Track your pending work and deadlines</p>
      </div>
      
      {/* Hidden file input for uploads */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange} 
      />

      <div className="space-y-4">
        {assignments.map((assign) => (
          <div key={assign.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${
                  assign.status === 'SUBMITTED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {assign.status}
                </span>
                <span className="text-sm font-medium text-slate-500">{assign.subject}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">{assign.title}</h3>
              <p className="text-slate-600 text-sm mt-1">{assign.description}</p>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-3">
                <Clock size={14} />
                <span>Due: {assign.dueDate}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {assign.status === 'PENDING' && (
                <button 
                    onClick={() => handleUploadClick(assign.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm"
                >
                  <Upload size={16} />
                  <span>Upload File</span>
                </button>
              )}
              
              <button 
                onClick={() => handleStatusToggle(assign.id, assign.status)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition text-sm font-medium ${
                  assign.status === 'SUBMITTED' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {assign.status === 'SUBMITTED' ? (
                    <>
                        <Circle size={16} />
                        <span>Mark Pending</span>
                    </>
                ) : (
                    <>
                        <CheckCircle2 size={16} />
                        <span>Mark Done</span>
                    </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;