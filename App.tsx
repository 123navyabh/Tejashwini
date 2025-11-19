import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { GeminiChat } from './components/GeminiChat';
import { db } from './services/db';
import { User } from './types';
import { Menu } from 'lucide-react';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Marks from './pages/Marks';
import Assignments from './pages/Assignments';
import Faculty from './pages/Faculty';
import Labs from './pages/Labs';
import Achievements from './pages/Achievements';
import Contact from './pages/Contact';
import Attendance from './pages/Attendance';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = db.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setUser(user);
  };

  const handleLogout = () => {
    db.logout();
    setUser(null);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-indigo-600">Loading Portal Pro...</div>;
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex">
        {user ? (
          <>
            <Sidebar 
              user={user} 
              onLogout={handleLogout} 
              isOpen={isSidebarOpen} 
              setIsOpen={setIsSidebarOpen} 
            />
            
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
              {/* Mobile Header */}
              <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between shrink-0">
                 <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">
                  Portal Pro
                </span>
                <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600">
                  <Menu size={24} />
                </button>
              </header>

              {/* Main Content Area */}
              <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                <Routes>
                  <Route path="/" element={<Dashboard user={user} />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/marks" element={<Marks />} />
                  <Route path="/assignments" element={<Assignments />} />
                  <Route path="/faculty" element={<Faculty />} />
                  <Route path="/labs" element={<Labs />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </div>
            <GeminiChat />
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </HashRouter>
  );
};

export default App;