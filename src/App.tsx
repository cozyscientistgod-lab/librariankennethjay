/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Book, Film, ExternalLink, Library, Rocket, Shield, Cpu, Activity, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import ReactMarkdown from 'react-markdown';

interface Item {
  title: string;
  year: string;
  description: string;
  genre: string;
  rating: number;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'books' | 'movies'>('books');
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'home' | 'search' | 'list'>('home');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setView('search');
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, type }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchList = async (listType: 'books' | 'movies') => {
    setType(listType);
    setLoading(true);
    setError(null);
    setView('list');
    try {
      const response = await fetch('/api/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: listType }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-mono overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      <div className="grid-overlay" />
      <div className="scanline" />

      {/* Background FX - merging with grid style */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#00f3ff_0%,transparent_70%)] blur-[120px]" />
      </div>

      {/* Top Bar */}
      <nav className="relative z-20 border-b border-cyan-900/50 bg-black/40 backdrop-blur-md px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col group cursor-pointer" onClick={() => setView('home')}>
          <a 
            href="https://campsite.bio/kenjay" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-cyan-400 opacity-70 hover:opacity-100 transition-opacity flex items-center gap-2 mb-1 uppercase tracking-widest"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            campsite.bio/kenjay
          </a>
          <h1 className="text-xl font-bold font-display uppercase tracking-widest text-white group-hover:text-cyan-400 transition-colors">
            Kennethjay <span className="text-cyan-400">Guban Mapalad</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right flex flex-col items-end">
            <div className="text-[10px] text-cyan-500 uppercase tracking-tighter">Neural Interface Status</div>
            <div className="text-xs text-green-400 font-bold flex items-center gap-2">
              <Activity className="w-3 h-3" /> CONNECTED / OPTIMIZED
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center text-center py-10"
            >
              <div className="mb-12">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-10 -z-10" />
                  <Library className="w-20 h-20 text-cyan-400 mx-auto" />
                </div>
                <h2 className="glitch-title text-4xl md:text-6xl font-black mb-4">
                  Universal Archive
                </h2>
                <p className="text-white/60 max-w-2xl mx-auto text-sm uppercase tracking-widest leading-relaxed">
                  Sector-wide neural sync of 
                  <span className="text-cyan-400 font-bold"> 15,000,000 </span> volumes and 
                  <span className="text-blue-500 font-bold"> 7,000,000 </span> cinematic records.
                </p>
              </div>

              <form onSubmit={handleSearch} className="w-full max-w-2xl mb-16 relative">
                <div className="absolute -top-6 left-0 text-[10px] uppercase text-cyan-400 tracking-widest opacity-60">Global Archive Query</div>
                <div className="relative glass-card flex p-1 border-2 border-cyan-500/30 overflow-hidden">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/40" />
                    <input 
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={`SEARCH ARCHIVES...`}
                      className="w-full bg-transparent py-5 pl-12 pr-4 outline-none text-white font-display tracking-widest placeholder:text-cyan-800"
                    />
                  </div>
                  <div className="flex gap-1 p-1 mr-2 items-center">
                    <button
                      type="button"
                      onClick={() => setType('books')}
                      className={cn(
                        "px-3 py-2 text-[10px] font-bold transition-all flex items-center gap-2 border border-transparent",
                        type === 'books' ? "border-cyan-500 text-cyan-400 bg-cyan-500/10 shadow-[0_0_10px_rgba(6,182,212,0.3)]" : "text-white/40 hover:text-white"
                      )}
                    >
                      BOOKS
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('movies')}
                      className={cn(
                        "px-3 py-2 text-[10px] font-bold transition-all flex items-center gap-2 border border-transparent",
                        type === 'movies' ? "border-blue-500 text-blue-400 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.3)]" : "text-white/40 hover:text-white"
                      )}
                    >
                      MOVIES
                    </button>
                    <button 
                      type="submit"
                      className="ml-2 px-8 py-3 bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                    >
                      ACCESS
                    </button>
                  </div>
                </div>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div className="glass-card p-10 flex flex-col items-center justify-center relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 mb-4">Archived Volumes</span>
                  <div className="text-6xl font-bold font-display text-white mb-2 tracking-tighter">15,000,000</div>
                  <p className="text-[10px] text-slate-400 text-center uppercase tracking-[0.2em]">Total Books Consumed</p>
                  <button 
                    onClick={() => fetchList('books')}
                    className="mt-8 px-8 py-3 border border-cyan-500 text-cyan-400 text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-500/20 transition-all"
                  >
                    Access Book Registry
                  </button>
                  <Book className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 group-hover:text-cyan-500/10 transition-colors" />
                </div>

                <div className="glass-card p-10 flex flex-col items-center justify-center relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-1 h-full bg-blue-500"></div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-blue-400 mb-4">Cinematic Logs</span>
                  <div className="text-6xl font-bold font-display text-white mb-2 tracking-tighter">7,000,000</div>
                  <p className="text-[10px] text-slate-400 text-center uppercase tracking-[0.2em]">Visual Media Analyzed</p>
                  <button 
                    onClick={() => fetchList('movies')}
                    className="mt-8 px-8 py-3 border border-blue-500 text-blue-400 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500/20 transition-all"
                  >
                    Access Movie Registry
                  </button>
                  <Film className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 group-hover:text-blue-500/10 transition-colors" />
                </div>
              </div>
            </motion.div>
          )}

          {(view === 'search' || view === 'list') && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-4"
            >
              <div className="flex items-center justify-between mb-12 border-b border-cyan-900/30 pb-8">
                <div>
                  <button 
                    onClick={() => setView('home')}
                    className="text-cyan-400/60 hover:text-cyan-400 flex items-center gap-2 mb-4 text-[10px] font-bold tracking-widest uppercase"
                  >
                    &larr; RETURN_TO_BASE
                  </button>
                  <h2 className="text-2xl font-bold font-display uppercase tracking-widest">
                    {view === 'search' ? `RESULTS: ${query}` : `REGISTRY: ${type.toUpperCase()}`}
                  </h2>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-[10px] text-white/30 uppercase tracking-[0.4em] mb-1">DATABASE_SYNC</span>
                  <span className="text-cyan-400 text-xs font-bold font-display px-2 py-1 bg-cyan-500/10 border border-cyan-500/20">STATUS_COMPREHENSIVE</span>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6">
                  <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-none animate-spin" />
                  <p className="text-cyan-400 animate-pulse font-bold text-[10px] tracking-[0.5em] uppercase">QUERYING_SECTOR_SYNC</p>
                </div>
              ) : error ? (
                <div className="p-10 glass-card border-red-500/30 text-center">
                  <p className="text-red-400 font-bold mb-4 uppercase tracking-[0.2em]">CRITICAL_ERROR: {error}</p>
                  <button onClick={() => setView('home')} className="px-8 py-2 border border-red-500/50 text-red-400 text-[10px] font-bold hover:bg-red-500/20 uppercase tracking-widest">REINITIALIZE</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.map((item, i) => (
                    <motion.div
                      key={item.title + i}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="group relative glass-card p-6 flex flex-col border-cyan-500/10 hover:border-cyan-500/40 transition-all"
                    >
                      <div className="absolute top-0 left-0 w-2 h-px bg-cyan-500" />
                      <div className="absolute top-0 left-0 w-px h-2 bg-cyan-500" />
                      
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-[9px] px-2 py-1 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 font-bold uppercase tracking-[0.2em]">
                          {item.genre}
                        </span>
                        <div className="flex items-center gap-1 text-orange-400/80">
                          <Star className="w-3 h-3 fill-orange-400/20" />
                          <span className="text-xs font-bold tabular-nums">{item.rating}</span>
                        </div>
                      </div>
                      
                      <h4 className="text-lg font-bold font-display mb-2 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-white/30 mb-6 font-bold tracking-[0.3em] uppercase">{item.year} // SEC_ID_{Math.floor(Math.random() * 8888 + 1111)}</p>
                      
                      <div className="text-xs text-white/50 mb-8 flex-grow leading-relaxed uppercase tracking-wider">
                        <ReactMarkdown>{item.description}</ReactMarkdown>
                      </div>

                      <button className="w-full py-3 border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[9px] font-bold tracking-[0.4em] uppercase hover:bg-cyan-500/20 hover:border-cyan-500 transition-all flex items-center justify-center gap-3">
                        FETCH_DATA_STREAM <Cpu className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-20 border-t border-cyan-900/50 bg-black/60 backdrop-blur-md px-6 py-10 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-1">
            <div className="text-[10px] text-cyan-400 font-bold tracking-[0.3em] uppercase">
              Core: KGMapalad-OS v9.4.2
            </div>
            <div className="text-[9px] text-white/20 font-bold tracking-[0.4em] uppercase">
              Sector: 7G-Delta // Sync: 100% Comprehensive
            </div>
          </div>
          <div className="flex items-center gap-10">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-white/30 uppercase tracking-[0.5em] mb-1">TOTAL_RECORDS</span>
              <span className="text-lg font-bold font-display text-cyan-400 tabular-nums tracking-tighter">22.0M+</span>
            </div>
            <div className="text-[10px] text-cyan-900 font-bold uppercase tracking-[0.4em] hidden md:block">
              BUILD_REF: 445AQR2Q-AIS
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
