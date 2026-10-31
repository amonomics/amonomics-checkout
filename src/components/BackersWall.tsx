import React, { useState } from 'react';
import { Users, Heart, Sparkles, MessageSquare, Terminal, Github, ExternalLink, ShieldCheck } from 'lucide-react';
import { Backer } from '../types';

interface BackersWallProps {
  backers: Backer[];
  onOpenLetter: (backer: Backer) => void;
}

export const BackersWall: React.FC<BackersWallProps> = ({ backers, onOpenLetter }) => {
  const [filter, setFilter] = useState<'all' | 'monthly' | 'once'>('all');

  const filteredBackers = backers.filter((b) => {
    if (filter === 'monthly') return b.frequency === 'monthly';
    if (filter === 'once') return b.frequency === 'once';
    return true;
  });

  const totalRaised = backers.reduce((acc, b) => acc + b.amount, 0);

  return (
    <section id="backers-wall" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Community Hall of Fame</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Recent Backers & Sustaining Patrons
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Over <strong className="text-emerald-300 font-mono">${totalRaised.toLocaleString()}</strong> in verified open-source micro-funding and dedicated CI hours.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All ({backers.length})
          </button>
          <button
            onClick={() => setFilter('monthly')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              filter === 'monthly'
                ? 'bg-zinc-800 text-emerald-300 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Monthly Sustaining
          </button>
          <button
            onClick={() => setFilter('once')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              filter === 'once'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            One-Time
          </button>
        </div>
      </div>

      {/* Grid of Backer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBackers.map((backer) => {
          const githubAvatar = backer.donorGithub
            ? `https://github.com/${backer.donorGithub}.png?size=100`
            : null;

          return (
            <div
              key={backer.id}
              className="rounded-xl border border-zinc-800/90 bg-zinc-950/70 p-5 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-emerald-500/5 group"
            >
              <div className="space-y-3">
                {/* Backer Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="relative">
                      {githubAvatar && !backer.isAnonymous ? (
                        <img
                          src={githubAvatar}
                          alt={backer.donorName}
                          onError={(e) => {
                            // Fallback if github avatar fails
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-700 group-hover:ring-emerald-500/50 transition-all"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-zinc-950 font-bold font-mono text-sm ring-1 ring-emerald-400/40">
                          {backer.isAnonymous ? '?' : backer.donorName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {backer.frequency === 'monthly' && (
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-zinc-950 flex items-center justify-center text-[8px] text-zinc-950 font-black">
                          ✓
                        </span>
                      )}
                    </div>

                    {/* Name & Handle */}
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center space-x-1.5">
                        <span>{backer.donorName}</span>
                      </h4>
                      {backer.donorGithub && !backer.isAnonymous && (
                        <a
                          href={`https://github.com/${backer.donorGithub}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-mono text-zinc-400 hover:text-emerald-400 flex items-center space-x-1 transition-colors"
                        >
                          <Github className="w-3 h-3" />
                          <span>@{backer.donorGithub}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Pledge Amount */}
                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-white font-mono">
                      ${backer.amount}
                    </span>
                    <span className="text-[10px] text-zinc-400 block font-mono">
                      {backer.frequency === 'monthly' ? '/mo' : 'gift'}
                    </span>
                  </div>
                </div>

                {/* Tier Badge */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                    {backer.tierTitle}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    for {backer.projectName}
                  </span>
                </div>

                {/* Backer custom message if any */}
                {backer.customMessage && (
                  <p className="text-xs text-zinc-300 italic bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/80 leading-relaxed">
                    "{backer.customMessage}"
                  </p>
                )}

                {/* AI appreciation note excerpt */}
                {backer.aiThankYouNote && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center space-x-1 text-[11px] text-emerald-400 font-mono">
                      <Sparkles className="w-3 h-3" />
                      <span>{backer.aiThankYouNote.maintainerBadge}</span>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {backer.aiThankYouNote.quote || backer.aiThankYouNote.impactStatement}
                    </p>
                  </div>
                )}
              </div>

              {/* View Full Dispatch CTA */}
              <div className="pt-2 border-t border-zinc-800/80">
                <button
                  onClick={() => onOpenLetter(backer)}
                  className="w-full text-left flex items-center justify-between text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer py-1"
                >
                  <span>Read AI appreciation dispatch</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
