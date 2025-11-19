import React from 'react';
import { User } from '../types';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Target, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const stats = [
    { label: 'Study Hours', value: '24.5', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Assignments Pending', value: '3', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Avg. Score', value: '88%', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Hello, {user.name}! 👋</h1>
        <p className="text-indigo-100 max-w-xl">
          Ready to learn something new today? Check your pending assignments or upload new notes to get started with your AI tutor.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-full ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span className="text-slate-600">Uploaded "Physics Chapter 4" notes</span>
                </div>
                <span className="text-xs text-slate-400">2h ago</span>
              </div>
            ))}
          </div>
          <Link to="/notes" className="inline-flex items-center text-indigo-600 text-sm font-medium mt-4 hover:underline">
            View all activity <ArrowUpRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Upcoming Deadlines</h2>
          <div className="space-y-4">
             <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
               <h3 className="font-medium text-red-900">Calculus Midterm</h3>
               <p className="text-sm text-red-700">Tomorrow, 10:00 AM</p>
             </div>
             <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
               <h3 className="font-medium text-amber-900">History Essay</h3>
               <p className="text-sm text-amber-700">Friday, 11:59 PM</p>
             </div>
          </div>
          <Link to="/assignments" className="inline-flex items-center text-indigo-600 text-sm font-medium mt-4 hover:underline">
            View calendar <ArrowUpRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;