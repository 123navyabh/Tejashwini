import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Users, 
  FlaskConical, 
  Trophy, 
  Mail, 
  LogOut,
  Menu,
  X,
  CalendarCheck
} from 'lucide-react';
import { db } from '../services/db';
import { User } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const navItems = [
    { label: 'Student Corner', path: '/', icon: LayoutDashboard },
    { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { label: 'Notes', path: '/notes', icon: BookOpen },
    { label: 'Test Marks', path: '/marks', icon: GraduationCap },
    { label: 'Assignments', path: '/assignments', icon: FileText },
    { label: 'Faculty', path: '/faculty', icon: Users },
    { label: 'Labs', path: '/labs', icon: FlaskConical },
    { label: 'Achievements', path: '/achievements', icon: Trophy },
    { label: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">
            Portal Pro
          </span>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-500">
            <X size={24} />
          </button>
        </div>

        {/* User Profile Summary */}
        <div className="p-6 flex flex-col items-center border-b border-slate-100">
          <img 
            src={user.avatar || "https://picsum.photos/200"} 
            alt="Profile" 
            className="w-20 h-20 rounded-full border-4 border-indigo-50 mb-3 object-cover"
          />
          <h3 className="font-semibold text-slate-800 text-center">{user.name}</h3>
          <p className="text-xs text-slate-500 uppercase tracking-wider">{user.role}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};