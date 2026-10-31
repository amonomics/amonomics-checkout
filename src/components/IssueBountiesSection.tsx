import React, { useState, useEffect } from 'react';
import { Target, Sparkles, DollarSign, CheckCircle2, ArrowRight, ExternalLink, Tag } from 'lucide-react';

interface IssueBounty {
  id: string;
  projectId: string;
  issueNumber: number;
  issueTitle: string;
  issueUrl: string;
  bountyTotal: number;
  targetAmount: number;
  backersCount: number;
  tags: string[];
  status: 'open' | 'funded' | 'claimed' | 'completed';
  claimedBy?: string;
  summary: string;
}

export const IssueBountiesSection: React.FC = () => {
  const [bounties, setBounties] = useState<IssueBounty[]>([]);
  const [pledgingBountyId, setPledgingBountyId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/bounties')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.bounties) {
          setBounties(data.bounties);
        }
      })
      .catch((err) => console.error('Failed to load bounties:', err));
  }, []);

  const handlePledgeBounty = async (bountyId: string, amount: number) => {
    setPledgingBountyId(bountyId);
    try {
      const res = await fetch('/api/bounties/pledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bountyId, amount, donorName: 'Community Sponsor' }),
      });
      const data = await res.json();
      if (data.success && data.bounty) {
        setBounties((prev) =>
          prev.map((b) => (b.id === bountyId ? data.bounty : b))
        );
      }
    } catch (err) {
      console.error('Bounty pledge failed:', err);
    } finally {
      setPledgingBountyId(null);
    }
  };

  return (
    <section id="issue-bounties" className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>Milestone &amp; Issue Micro-Bounties</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Crowdfund Critical Features &amp; Bug Fixes
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            Sponsor specific GitHub issues directly. Pledges disburse when PRs are verified, merged, and closed by maintainers.
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs font-mono text-zinc-500 uppercase">Active Bounties</span>
          <p className="text-2xl font-black text-white font-mono">
            {bounties.length} <span className="text-xs text-cyan-400 font-sans">Open Goals</span>
          </p>
        </div>
      </div>

      {/* Bounties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bounties.map((bounty) => {
          const percent = Math.min(100, Math.round((bounty.bountyTotal / bounty.targetAmount) * 100));

          return (
            <div
              key={bounty.id}
              className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    Issue #{bounty.issueNumber}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      bounty.status === 'funded'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {bounty.status === 'funded' ? 'Funded & Claimed' : `${percent}% funded`}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white leading-snug">
                  {bounty.issueTitle}
                </h4>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {bounty.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {bounty.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-zinc-950 text-[10px] font-mono text-zinc-400 border border-zinc-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress and Pledge Action */}
              <div className="space-y-3 pt-3 border-t border-zinc-800/80">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold">${bounty.bountyTotal} raised</span>
                  <span className="text-zinc-500">Goal: ${bounty.targetAmount}</span>
                </div>

                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {bounty.backersCount} backers
                  </span>

                  <button
                    onClick={() => handlePledgeBounty(bounty.id, 25)}
                    disabled={pledgingBountyId === bounty.id}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-colors flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                  >
                    <span>+ Pledge $25</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
