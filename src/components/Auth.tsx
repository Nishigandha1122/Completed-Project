import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Leaf } from 'lucide-react';
import image from "../photo/mirai2.png";
import logo from "../photo/Logo.png";

interface AuthProps {
  onAuthSuccess: (user: any) => void;
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { email, password, firstName, lastName, mobile };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      localStorage.setItem('mirai_token', data.token);
      onAuthSuccess(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
    style={{backgroundImage:`url(${image})`}}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <img src={logo} alt="App Logo" className="w-full h-full object-contain"/>
          </div>
          <h1 className="text-3xl font-bold text-white">Mirai Farm</h1>
          <p className="text-green-100/80">SQL-Powered Farm Companion</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          )}
          
          <input
            type="text"
            placeholder="Login ID / Email"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          {!isLogin && (
             <input
                type="tel"
                placeholder="Mobile Number"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
          )}

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-400 text-sm px-2 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : isLogin ? <><LogIn size={20} /> Login</> : <><UserPlus size={20} /> Sign Up</>}
          </button>
        </form>

        <p className="mt-8 text-center text-white/70">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-green-400 font-semibold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
