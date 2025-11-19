import React, { useState, useEffect } from 'react';
import { Mail, Phone, User as UserIcon, Plus, Upload, X } from 'lucide-react';
import { db } from '../services/db';
import { FacultyMember } from '../types';

const Faculty: React.FC = () => {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form
  const [name, setName] = useState('');
  const [dept, setDept] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    setFaculty(db.getFaculty());
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: FacultyMember = {
      id: Date.now().toString(),
      name,
      department: dept,
      email,
      phone,
      subjectSpecialty: specialty,
      avatar: avatarPreview
    };
    db.addFaculty(newMember);
    setFaculty(db.getFaculty());
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName(''); setDept(''); setEmail(''); setPhone(''); setSpecialty(''); setAvatarPreview(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Faculty Directory</h1>
            <p className="text-slate-500">Connect with your professors and mentors</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <Plus size={20} />
          <span>Add Faculty</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.map((member) => (
          <div key={member.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col items-center text-center hover:shadow-md transition">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 overflow-hidden bg-indigo-50 border border-indigo-100 relative">
              {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                  <UserIcon size={40} className="text-indigo-400" />
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-800">{member.name}</h3>
            <p className="text-indigo-600 font-medium text-sm mb-1">{member.department}</p>
            <p className="text-slate-500 text-sm mb-4">{member.subjectSpecialty}</p>
            
            <div className="w-full space-y-2">
              <a href={`mailto:${member.email}`} className="flex items-center justify-center space-x-2 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm transition">
                <Mail size={16} />
                <span>{member.email}</span>
              </a>
              <a href={`tel:${member.phone}`} className="flex items-center justify-center space-x-2 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm transition">
                <Phone size={16} />
                <span>{member.phone}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Faculty Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24}/></button>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Add Faculty Member</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input required value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg p-2" placeholder="Prof. X" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                            <input required value={dept} onChange={e => setDept(e.target.value)} className="w-full border rounded-lg p-2" placeholder="Science" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-lg p-2" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                            <input required value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded-lg p-2" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
                        <input required value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full border rounded-lg p-2" placeholder="Quantum Physics" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Photo Upload</label>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center relative hover:bg-slate-50 cursor-pointer overflow-hidden">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10" />
                            {avatarPreview ? (
                                <div className="relative h-32 w-full">
                                     <img src={avatarPreview} alt="Preview" className="h-full w-full object-contain" />
                                </div>
                            ) : (
                                <div className="py-4">
                                    <Upload className="mx-auto text-slate-400 mb-1" size={24} />
                                    <span className="text-sm text-slate-500">Click to upload photo</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium">Add Member</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Faculty;