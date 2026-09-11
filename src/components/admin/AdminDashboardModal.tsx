import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  CheckCircle2,
  Ban,
  X,
  Users,
  Eye,
  Zap,
  TrendingUp,
  Globe,
} from 'lucide-react';

export const AdminDashboardModal: React.FC = () => {
  const { isAdminOpen, setIsAdminOpen, reports, resolveReport } = useApp();

  if (!isAdminOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top Bar */}
        <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">
                Tarang Admin & AI Moderation Console
              </h2>
              <p className="text-[10px] text-zinc-400">
                Live monitoring for India • Trust & Safety Operations
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 rounded-full bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Overview Stats */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
              <p className="text-[10px] text-zinc-400 uppercase font-bold">Daily Active (DAU)</p>
              <p className="text-base font-black text-white mt-1">4.82M</p>
              <span className="text-[9px] text-emerald-400 font-bold">+18.2% MoM</span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
              <p className="text-[10px] text-zinc-400 uppercase font-bold">Bandwidth Saved</p>
              <p className="text-base font-black text-emerald-400 mt-1">320 TB</p>
              <span className="text-[9px] text-zinc-500">AV1 Compression</span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
              <p className="text-[10px] text-zinc-400 uppercase font-bold">Tier 2/3 Share</p>
              <p className="text-base font-black text-sky-400 mt-1">68.4%</p>
              <span className="text-[9px] text-zinc-500">Regional growth</span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
              <p className="text-[10px] text-zinc-400 uppercase font-bold">Safety SLA</p>
              <p className="text-base font-black text-amber-400 mt-1">&lt; 90s</p>
              <span className="text-[9px] text-zinc-500">Flag to resolution</span>
            </div>
          </div>

          {/* Regional Languages breakdown */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>Language Distribution (Live Streams)</span>
            </h3>
            <div className="space-y-1.5 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-300">Hindi (हिंदी)</span>
                  <span className="text-zinc-400">46%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[46%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-300">Telugu & Tamil (తెలుగు / தமிழ்)</span>
                  <span className="text-zinc-400">22%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-[22%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-300">Punjabi & Bengali (ਪੰਜਾਬੀ / বাংলা)</span>
                  <span className="text-zinc-400">18%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[18%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-300">English & Others</span>
                  <span className="text-zinc-400">14%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 w-[14%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Reported Content Queue */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Reported Content Queue ({reports.filter(r => r.status === 'pending').length} Pending)
            </h3>

            {reports.map(rep => (
              <div
                key={rep.id}
                className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{rep.contentTitle}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        rep.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Reported by {rep.reportedBy} • Reason: <strong className="text-rose-400">{rep.reason}</strong>
                  </p>
                </div>

                {rep.status === 'pending' && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => resolveReport(rep.id, 'approve')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold hover:bg-emerald-500/30 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => resolveReport(rep.id, 'ban')}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold hover:bg-rose-500/30 flex items-center gap-1"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Ban Video</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
