import React, { useState } from 'react';
import { Trophy, Medal, Award, Flame, Search, Sparkles } from 'lucide-react';
import { mockLeaderboardUsers } from '../data/mockData';

export const LeaderboardPage: React.FC = () => {
  const [tab, setTab] = useState<'Global' | 'College' | 'Weekly' | 'Monthly'>('Global');
  const [search, setSearch] = useState('');

  const filteredUsers = mockLeaderboardUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.college.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>Leaderboard & Rankings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Compete with students across colleges and climb the PrepVerse benchmark ladder.
          </p>
        </div>

        {/* Current User Rank Banner */}
        <div className="bg-slate-900 border border-indigo-500/30 px-4 py-2 rounded-2xl flex items-center gap-3">
          <Medal className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Your Position</span>
            <span className="text-sm font-black text-white">#14 Rank (Top 2%)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl text-xs font-bold">
        <div className="flex gap-1">
          {(['Global', 'College', 'Weekly', 'Monthly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl transition-all ${
                tab === t ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t} Leaderboard
            </button>
          ))}
        </div>

        <div className="relative w-48 hidden sm:block">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Rank</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">College</th>
                <th className="py-3.5 px-4">Coding Rating</th>
                <th className="py-3.5 px-4">Problems</th>
                <th className="py-3.5 px-4 text-right">PrepVerse Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className={`transition-colors ${
                    u.isCurrentUser
                      ? 'bg-indigo-600/20 border-l-4 border-indigo-500 font-bold'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Rank Badge */}
                  <td className="py-3.5 px-4">
                    {u.rank === 1 ? (
                      <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
                    ) : u.rank === 2 ? (
                      <span className="w-7 h-7 rounded-lg bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center">2</span>
                    ) : u.rank === 3 ? (
                      <span className="w-7 h-7 rounded-lg bg-amber-700 text-white font-black text-xs flex items-center justify-center">3</span>
                    ) : (
                      <span className="text-slate-400 font-bold ml-2">#{u.rank}</span>
                    )}
                  </td>

                  {/* Student Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-700" />
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{u.name}</span>
                          {u.isCurrentUser && (
                            <span className="text-[9px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">You</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{u.badge}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">{u.college}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{u.rating}</td>
                  <td className="py-3.5 px-4 text-slate-200">{u.problemsSolved} Solved</td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-400 text-sm">{u.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
