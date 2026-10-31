import React, { useState } from 'react';
import { X, Sparkles, Activity, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { Project } from '../types';

interface AIAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const AIAuditModal: React.FC<AIAuditModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [auditData, setAuditData] = useState<any>(null);

  if (!isOpen) return null;

  const runAudit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/sustainability-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id }),
      });
      const data = await res.json();
      if (data.success) {
        setAuditData(data.audit);
      }
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden my-8">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 -z-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Gemini 3.8 Flash • OSS Sustainability Health Auditor
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Repository Sustainability Health Audit
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Gemini analyzes <span className="text-white font-mono">{project.repo}</span>'s funding runway, CI runner consumption, and open issue velocity to provide strategic recommendations.
            </p>
          </div>

          {!auditData && !isLoading && (
            <div className="text-center py-8 space-y-4 rounded-xl bg-zinc-950/60 border border-zinc-800 p-6">
              <Activity className="w-10 h-10 text-emerald-400 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">
                  Ready to audit {project.name}
                </p>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Evaluate real-time open issue ratio ({project.openIssues} issues), {project.stars} stars, and current monthly funding (${project.currentMonthlyFunding}/${project.monthlyGoal}).
                </p>
              </div>

              <button
                onClick={runAudit}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer inline-flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run Gemini Health Audit</span>
              </button>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
              <p className="text-xs font-mono text-zinc-300">
                Evaluating repository health metrics via Gemini 3.8 Flash...
              </p>
            </div>
          )}

          {auditData && !isLoading && (
            <div className="space-y-6 animate-fade-in">
              {/* Scorecard */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                    Health Grade
                  </span>
                  <span className="text-3xl font-black text-emerald-400 font-mono mt-1 block">
                    {auditData.sustainabilityGrade}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 sm:col-span-2 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                    Runway & Burn Assessment
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {auditData.burnRateSummary}
                  </p>
                </div>
              </div>

              {/* Top Risk Factor */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Primary Sustainability Risk</span>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  {auditData.topRiskFactor}
                </p>
              </div>

              {/* Actionable Recommendations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Actionable Recommendations for Maintainers:
                </h4>
                <div className="space-y-2">
                  {auditData.actionableRecommendations?.map((rec: string, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-start space-x-2.5 text-xs text-zinc-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corporate Sponsor Pitch */}
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  Executive Pitch for Corporate Sponsors
                </span>
                <p className="text-xs text-cyan-200/90 leading-relaxed italic">
                  "{auditData.corporateSponsorPitch}"
                </p>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={runAudit}
                  className="px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-run Audit</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Close Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
