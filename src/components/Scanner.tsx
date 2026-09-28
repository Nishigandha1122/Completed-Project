import React, { useState, useRef } from 'react';
import { Camera, Upload, X, ShieldCheck, AlertCircle, RefreshCw, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { detectCropDisease } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

export function Scanner() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError('Could not access camera. Please upload an image instead.');
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
    setShowCamera(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      setImage(canvas.toDataURL('image/jpeg'));
      stopCamera();
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    setError('');
    
    try {
      const base64Data = image.split(',')[1];
      const analysis = await detectCropDisease(base64Data);
      setResult(analysis);

      // Save to SQL Database via API
      const token = localStorage.getItem('mirai_token');
      await fetch('/api/crops/scan', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          imageUrl: image,
          diseaseName: analysis.diseaseName,
          confidence: analysis.confidence,
          status: analysis.status,
          treatment: analysis.treatment
        })
      });
    } catch (err: any) {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError('');
    stopCamera();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
         {(image || showCamera) && (
           <button onClick={reset} className="p-2 bg-white rounded-full shadow-sm text-slate-500">
             <ChevronLeft size={20} />
           </button>
         )}
         <h2 className="text-2xl font-bold text-slate-800">Crop Health Scanner</h2>
      </div>

      <AnimatePresence mode="wait">
        {!image && !showCamera ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button onClick={startCamera} className="group bg-green-50 aspect-square rounded-[2.5rem] border-2 border-dashed border-green-200 flex flex-col items-center justify-center gap-4 hover:bg-green-100 transition-all">
              <Camera size={32} className="text-green-600" />
              <div className="font-bold text-green-800">Use Camera</div>
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="group bg-blue-50 aspect-square rounded-[2.5rem] border-2 border-dashed border-blue-200 flex flex-col items-center justify-center gap-4 hover:bg-blue-100 transition-all">
              <Upload size={32} className="text-blue-600" />
              <div className="font-bold text-blue-800">Upload Photo</div>
              <input type="file" ref={fileInputRef} onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  const r = new FileReader();
                  r.onloadend = () => setImage(r.result as string);
                  r.readAsDataURL(f);
                }
              }} accept="image/*" className="hidden" />
            </button>
          </motion.div>
        ) : showCamera ? (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative bg-slate-900 rounded-[2.5rem] overflow-hidden aspect-[3/4]">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-8">
               <button onClick={stopCamera} className="p-4 bg-white/20 rounded-full text-white"><X /></button>
               <button onClick={captureImage} className="w-20 h-20 bg-white rounded-full flex items-center justify-center"><div className="w-14 h-14 bg-green-500 rounded-full" /></button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-white p-4 rounded-[2.5rem] shadow-xl">
               <img src={image!} className="w-full rounded-[2rem] aspect-square object-cover" alt="Preview" />
            </div>
            {!result && (
              <button onClick={analyzeImage} disabled={loading} className="w-full bg-green-600 text-white font-bold py-6 rounded-3xl shadow-xl flex items-center justify-center gap-3">
                {loading ? <><RefreshCw className="animate-spin" /> Analyzing...</> : <><ShieldCheck /> Verify Health</>}
              </button>
            )}
            {result && (
              <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl">
                <div className={cn("p-8 text-white", result.status === 'Healthy' ? 'bg-green-600' : 'bg-red-500')}>
                  <h3 className="text-4xl font-black mb-1">{result.diseaseName}</h3>
                  <p>{result.confidence}% Confidence</p>
                </div>
                <div className="p-8">
                  <div className="prose">
                    <ReactMarkdown>{result.treatment}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
