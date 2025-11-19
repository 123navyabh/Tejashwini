import React, { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, Folder, Plus } from 'lucide-react';
import { db } from '../services/db';
import { Note } from '../types';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setNotes(db.getNotes());
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      subject,
      dateAdded: new Date().toISOString().split('T')[0],
      fileName: file?.name,
      fileSize: file ? `${(file.size / 1024).toFixed(1)} KB` : undefined,
      fileType: file?.type
    };
    db.addNote(newNote);
    setNotes(db.getNotes());
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setSubject('');
    setFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Notes</h1>
          <p className="text-slate-500">Manage and organize your study materials</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <Plus size={20} />
          <span>Add Note</span>
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <Folder size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No notes added yet. Upload one to get started!</p>
          </div>
        )}
        
        {notes.map((note) => (
          <div key={note.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition group">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                <FileText size={24} />
              </div>
              <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">
                {note.subject}
              </span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">{note.title}</h3>
            <div className="text-sm text-slate-500 space-y-1">
              {note.fileName && <p className="truncate">File: {note.fileName}</p>}
              {note.fileSize && <p>Size: {note.fileSize}</p>}
              <p className="text-xs mt-2 text-slate-400">Added: {note.dateAdded}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Upload New Note</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  required 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g., Thermodynamics Lecture 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input 
                  required 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g., Physics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Attachment</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 transition relative">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                  <p className="text-sm text-slate-600">
                    {file ? file.name : "Click to upload file"}
                  </p>
                  {!file && <p className="text-xs text-slate-400 mt-1">PDF, DOCX, JPG up to 10MB</p>}
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;