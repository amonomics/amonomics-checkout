import React, { useState } from 'react';
import { X, Sparkles, Building2, Code2, Users, DollarSign, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

interface AIRoiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRecommendation: (tierId: string, amount: number, companyName: string) => void;
}

export const AIRoiAdvisorModal: React.FC<AIRoiAdvisorModalProps> = ({
  isOpen,
  onClose,
  onApplyRecommendation,
}) => {
  const [companyName, setCompanyName] = useState('Acme Cloud Systems');
  const [techStack, setTechStack] = useState('Distributed microservices, Node.js, GraphQL, Kubernetes, TypeScript');
  const [teamSize, setTeamSize] = useState('10-50 engineers');
  const [budgetRange, setBudgetRange] = useState('$50 - $150 / mo');

  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  if (!isOpen) return null;

  const handleGetRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/recommend-tier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          techStack,
          teamSize,
          budgetRange,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRecommendation(data.recommendation);
      }
    } catch (err) {
      console.error('ROI Advisor error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden my-8">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 -z-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Gemini 3.8 Flash • Corporate Sponsor ROI Advisor
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
              Calculate Corporate Sponsorship ROI
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Tell Gemini about your company's tech stack and infrastructure needs. AI will match your engineering team with the optimal support tier.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleGetRecommendation} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Company / Organization Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-zinc-950 text-xs text-white border border-zinc-800 rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. Acme Studio"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Engineering Team Size</span>
                </label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full bg-zinc-950 text-xs text-zinc-200 border border-zinc-800 rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="1-5 engineers">1 - 5 engineers</option>
                  <option value="5-20 engineers">5 - 20 engineers</option>
                  <option value="20-100 engineers">20 - 100 engineers</option>
                  <option value="100+ enterprise">100+ Enterprise</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
                <Code2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Tech Stack & Usage Patterns</span>
              </label>
              <textarea
                rows={2}
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full bg-zinc-950 text-xs text-white border border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 resize-none"
                placeholder="e.g. Next.js, Node.js edge runtime, Kafka, GraphQL"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-zinc-400">
                Budget Target: <span className="text-white font-mono">{budgetRange}</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-zinc-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing ROI with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate ROI Recommendation</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results Box */}
          {recommendation && (
            <div className="p-5 rounded-xl bg-zinc-950 border border-cyan-500/40 space-y-4 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold block">
                    Recommended Match
                  </span>
                  <h4 className="text-lg font-bold text-white mt-0.5">
                    {recommendation.recommendedTierTitle}
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-cyan-400 font-mono">
                    ${recommendation.recommendedAmount}
                  </span>
                  <span className="text-[10px] text-zinc-400 block font-mono">/ month</span>
                </div>
              </div>

              {/* Rationale */}
              <div className="space-y-1.5 text-xs text-zinc-300 bg-zinc-900/80 p-3.5 rounded-lg border border-zinc-800">
                <span className="font-bold text-white block">Engineering ROI Rationale:</span>
                <p className="leading-relaxed text-zinc-300">
                  {recommendation.roiRationale}
                </p>
              </div>

              {/* Impact Highlight */}
              <div className="flex items-center space-x-2 text-xs text-emerald-300 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{recommendation.impactHighlight}</span>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => {
                  onApplyRecommendation(
                    recommendation.recommendedTierId,
                    recommendation.recommendedAmount,
                    companyName
                  );
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-zinc-950 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Select This Tier & Auto-fill Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
