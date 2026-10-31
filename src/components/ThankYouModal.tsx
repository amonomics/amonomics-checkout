import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Sparkles, Copy, Check, Download, Share2, Award, Terminal, Heart, X, ExternalLink } from 'lucide-react';
import { Backer } from '../types';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  backer: Backer | null;
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({
  isOpen,
  onClose,
  backer,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (isOpen && backer) {
      // Trigger festive celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#3b82f6', '#f59e0b'],
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, backer]);

  if (!isOpen || !backer) return null;

  const markdownBadge = `[![Sponsor](https://img.shields.io/badge/Sponsor-${encodeURIComponent(
    backer.projectName
  )}-emerald?style=flat-square&logo=github)](https://github.com/${backer.donorGithub || 'backer'})`;

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden my-8">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 -z-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              Contribution Confirmed • Gemini AI Dispatch
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Top Hero Banner */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/20 mx-auto">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Thank You, {backer.donorName}!
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto">
              Your pledge of <strong className="text-emerald-300 font-mono">${backer.amount}</strong> {backer.frequency === 'monthly' ? '/ month' : ''} directly sustains open-source craftsmanship on{' '}
              <span className="text-white font-medium">{backer.projectName}</span>.
            </p>
          </div>

          {/* AI Appreciation Letter Card */}
          <div className="relative rounded-xl border border-zinc-700 bg-gradient-to-b from-zinc-950 to-zinc-900/90 p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                  Maintainer Dispatch (Generated with Gemini 3.8 Flash)
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                Official Letter
              </span>
            </div>

            {/* Letter Body */}
            <div className="text-sm text-zinc-200 leading-relaxed space-y-3 font-sans whitespace-pre-line italic">
              {backer.aiThankYouNote.letter}
            </div>

            {/* Maintainer Quote */}
            {backer.aiThankYouNote.quote && (
              <div className="pt-2 border-t border-zinc-800/80">
                <blockquote className="text-xs text-emerald-300/90 font-mono border-l-2 border-emerald-500 pl-3 italic">
                  "{backer.aiThankYouNote.quote}"
                </blockquote>
              </div>
            )}
          </div>

          {/* Tangible Engineering Impact & Badge Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Impact Metric */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                <Sparkles className="w-4 h-4" />
                <span>Computed Impact</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                {backer.aiThankYouNote.impactStatement}
              </p>
            </div>

            {/* Backer Honorific Badge */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                <Award className="w-4 h-4" />
                <span>Awarded Title</span>
              </div>
              <p className="text-sm font-bold text-white tracking-tight">
                {backer.aiThankYouNote.maintainerBadge}
              </p>
              <p className="text-[11px] text-zinc-500">
                Added to repository sponsor records and hall of fame.
              </p>
            </div>
          </div>

          {/* Interactive Code Tribute Snippet */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden space-y-0">
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800">
              <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                <span>tribute.ts</span>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(backer.aiThankYouNote.tributeSnippet, setCopiedCode)
                }
                className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-mono text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-mono">Copy Snippet</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-400/90 overflow-x-auto bg-zinc-950">
              <code>{backer.aiThankYouNote.tributeSnippet}</code>
            </pre>
          </div>

          {/* GitHub Markdown Badge */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-white">GitHub README Sponsor Badge</p>
              <p className="text-[11px] text-zinc-400">
                Add this badge to your personal README or project portfolio.
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(markdownBadge, setCopiedBadge)}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 border border-zinc-700 flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
            >
              {copiedBadge ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Badge Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `I just backed ${backer.projectName} on amonomics-checkout to support open-source sustainability! 🚀`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 flex items-center justify-center space-x-2 transition-all cursor-pointer text-center"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Share on X / Twitter</span>
            </a>

            <button
              onClick={onClose}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-zinc-950" />
              <span>View On Backers Wall</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
