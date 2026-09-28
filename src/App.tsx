import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { History } from './components/History';
import { Chatbot } from './components/Chatbot';
import { Settings } from './components/Settings';
import { Navbar } from './components/Navbar';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard');

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('mirai_token');
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            localStorage.removeItem('mirai_token');
          }
        } catch (err) {
          console.error("Auth check failed", err);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mirai_token');
    setUser(null);
    setCurrentTab('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f4f1] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={(userData: any) => setUser(userData)} />;
  }

  return (
    <div className="min-h-screen bg-[#f0f4f1] text-slate-900 font-sans">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24 lg:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentTab === 'dashboard' && <Dashboard onNavigate={setCurrentTab} user={user} />}
            {currentTab === 'scan' && <Scanner />}
            {currentTab === 'history' && <History />}
            {currentTab === 'chat' && <Chatbot />}
            {/* {currentTab === 'settings' && <Settings user={user} />} */}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Action Button for Chat on Mobile */}
      {currentTab !== 'chat' && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentTab('chat')}
          className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 lg:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
        </motion.button>
      )}
    </div>
  );
}
