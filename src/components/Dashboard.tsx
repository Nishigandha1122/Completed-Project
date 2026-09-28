import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Wind, Scan, History as HistoryIcon, MessageCircle, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  user: any;
}

export function Dashboard({ onNavigate, user }: DashboardProps) {
  const [weather] = useState({ temp: 28, condition: 'Sunny', hum: 45 });

  const features = [
    { id: 'scan', label: 'Scan Crop', icon: Scan, desc: 'Detect diseases in seconds', color: 'bg-green-500', tab: 'scan' },
    { id: 'history', label: 'Scan History', icon: HistoryIcon, desc: 'View your previous detections', color: 'bg-blue-500', tab: 'history' },
    { id: 'chat', label: 'Farm Assistant', icon: MessageCircle, desc: 'Get expert advice & tips', color: 'bg-orange-500', tab: 'chat' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden bg-green-900 rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-sm font-medium uppercase tracking-widest text-green-300 mb-2">Welcome Back</h2>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Hello, {user?.firstName || 'Farmer'}</h1>
          <p className="text-green-100/70 max-w-md mb-8">
            The health of your crops is our priority. Explore your farm's status and get intelligent recommendations.
          </p>
          <div className="flex gap-4">
            <button 
                onClick={() => onNavigate('scan')}
                className="bg-white text-green-900 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-green-50 transition"
            >
              Scan Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-500/20 to-transparent pointer-events-none" />
      </section>

      {/* Stats & Weather Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
              <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Current Weather • Pune</span>
              <div className="flex items-center gap-6">
                <span className="text-6xl font-bold text-slate-800">{weather.temp}°C</span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-600 font-semibold italic text-xl capitalize">
                    <Sun className="text-orange-400" /> {weather.condition}
                  </div>
                  <div className="text-slate-400 text-sm">Humidity: {weather.hum}% • Wind: 12km/h</div>
                </div>
              </div>
          </div>
        </div>

        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-100 italic">
           <div className="text-indigo-200 uppercase text-xs font-bold tracking-widest mb-4">Farm Insight</div>
           <p className="text-xl leading-relaxed">
             "Precision farming today leads to a bountiful harvest tomorrow."
           </p>
        </div>
      </div>

      {/* Feature Cards */}
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 px-2">
            Explore Tools <div className="h-0.5 flex-1 bg-slate-100 ml-4"></div>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <motion.button
              key={f.id}
              whileHover={{ y: -8 }}
              onClick={() => onNavigate(f.tab)}
              className="group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all text-left"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6", f.color)}>
                <f.icon size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">{f.label}</h4>
              <p className="text-slate-500 text-sm">{f.desc}</p>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  );
}
