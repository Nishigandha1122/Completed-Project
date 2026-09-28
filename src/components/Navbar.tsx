import React from 'react';
import { Home, Scan, History as HistoryIcon, MessageSquare, Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onLogout: () => void;
}

export function Navbar({ currentTab, setCurrentTab, onLogout }: NavbarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'scan', label: 'Scan', icon: Scan },
    { id: 'history', label: 'History', icon: HistoryIcon },
    { id: 'chat', label: 'Assistant', icon: MessageSquare },
    // { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-20 bg-white border-r z-50">
        <div className="flex-1 flex flex-col items-center py-8 gap-8">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-200">M</div>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setCurrentTab(tab.id)} className={cn("p-3 rounded-2xl group", currentTab === tab.id ? "bg-green-50 text-green-600" : "text-slate-400 hover:text-slate-600 transition")}>
              <tab.icon size={24} />
            </button>
          ))}
        </div>
        <div className="pb-8">
            <button onClick={onLogout} className="p-3 text-slate-400 hover:text-red-500 transition-colors"><LogOut size={24} /></button>
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-20 px-4 z-50 rounded-t-3xl shadow-lg">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setCurrentTab(tab.id)} className={cn("flex flex-col items-center gap-1 p-2 transition", currentTab === tab.id ? "text-green-600" : "text-slate-400")}>
            <tab.icon size={20} />
            <span className="text-[10px] font-medium uppercase">{tab.label === 'Assistant' ? 'Chat' : tab.label}</span>
          </button>
        ))}
      </nav>
      
      <header className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <h1 className="font-bold text-slate-800 italic">MR SQL</h1>
          </div>
          <button onClick={onLogout} className="text-slate-400 p-2"><LogOut size={20} /></button>
      </header>
    </>
  );
}
