import React, { useState } from 'react';
import { GraduationCap, ArrowRight, Loader2, UserPlus, LogIn } from 'lucide-react';
import { db } from '../services/db';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) return;
    if (mode === 'register') {
      if (!fullName.trim()) return;
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      let user;
      if (mode === 'login') {
        user = await db.login(identifier, password);
      } else {
        user = await db.register(fullName, identifier, password);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 md:p-10 border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-100 p-4 rounded-full">
            <GraduationCap size={48} className="text-indigo-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">Portal Pro</h1>
        <p className="text-center text-slate-500 mb-6">
          {mode === 'login' ? 'Welcome back! Please sign in.' : 'Join Portal Pro today.'}
        </p>

        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${mode === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => toggleMode('login')}
          >
            Sign In
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${mode === 'register' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => toggleMode('register')}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email or Phone
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="student@portal.edu"
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {mode === 'register' ? 'Create Password' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              required
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                required
              />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition-transform active:scale-[0.98] mt-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                {mode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          <p>Protected by Portal Pro Secure Gateway</p>
        </div>
      </div>
    </div>
  );
};

export default Login;