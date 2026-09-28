import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, Trash2, AlertCircle, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

export function History() {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScan, setSelectedScan] = useState<any | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('mirai_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setScans(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteScan = async (id: number) => {
    if (!window.confirm('Delete record?')) return;
    try {
      const res = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('mirai_token')}` }
      });
      if (res.ok) {
        setScans(scans.filter(s => s.id !== id));
        if (selectedScan?.id === id) setSelectedScan(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredScans = scans.filter(s => s.diseaseName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-800">Relational History</h2>
          <input 
            type="text" 
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {loading ? <p>Loading history...</p> : (
          <div className="space-y-3">
             {filteredScans.map((scan) => (
               <div key={scan.id} onClick={() => setSelectedScan(scan)} className="bg-white p-4 rounded-3xl border flex items-center gap-4 cursor-pointer hover:shadow-md">
                 <img src={scan.imageUrl} className="w-16 h-16 rounded-2xl object-cover" alt="Scan" />
                 <div className="flex-1">
                   <h4 className="font-bold text-slate-800">{scan.diseaseName}</h4>
                   <p className="text-xs text-slate-400 italic">{new Date(scan.timestamp).toLocaleDateString()}</p>
                 </div>
                 <button onClick={(e) => { e.stopPropagation(); deleteScan(scan.id); }} className="text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
               </div>
             ))}
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-8 h-full">
        {selectedScan ? (
          <div className="bg-white rounded-[2.5rem] border shadow-xl overflow-hidden h-full">
             <img src={selectedScan.imageUrl} className="w-full aspect-video object-cover" alt="Detailed" />
             <div className="p-8">
                <h3 className="text-3xl font-black mb-4">{selectedScan.diseaseName}</h3>
                <div className="prose"><ReactMarkdown>{selectedScan.treatment}</ReactMarkdown></div>
             </div>
          </div>
        ) : (
          <div className="hidden lg:flex h-full min-h-[400px] border-2 border-dashed rounded-[2.5rem] items-center justify-center text-slate-400 italic">Select a scan</div>
        )}
      </div>
    </div>
  );
}
