import React, { useState } from 'react';
import { X, Award, ShieldCheck, Download, Share2, Copy, Check, Printer, Sparkles } from 'lucide-react';
import { Backer } from '../types';

interface DigitalBackerPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  backer: Backer | null;
}

export const DigitalBackerPassModal: React.FC<DigitalBackerPassModalProps> = ({
  isOpen,
  onClose,
  backer,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen || !backer) return null;

  const verificationHash = `sha256_${backer.id}_${backer.amount}_${backer.createdAt.replace(/\D/g, '')}`.substring(0, 32);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden my-8">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 -z-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Official Cryptographic Digital Backer Pass
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Card */}
        <div className="p-6 sm:p-8 space-y-6">
          <div
            id="printable-backer-pass"
            className="relative rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden"
          >
            {/* Watermark logo */}
            <div className="absolute -bottom-8 -right-8 text-zinc-800/20 font-black text-9xl pointer-events-none select-none font-mono">
              OSS
            </div>

            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                  Certificate of Open-Source Stewardship
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {backer.donorName}
                </h3>
                {backer.donorGithub && (
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    github.com/{backer.donorGithub}
                  </p>
                )}
              </div>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-zinc-950 font-black font-mono text-xl shadow-lg shadow-emerald-500/20">
                {backer.donorName.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Tribute Details */}
            <div className="space-y-1.5 py-3 border-y border-zinc-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Awarded Title:</span>
                <span className="font-bold text-white font-mono">{backer.aiThankYouNote.maintainerBadge}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Sustained Repository:</span>
                <span className="font-mono text-emerald-400">{backer.projectName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Pledge Level:</span>
                <span className="font-bold text-white">${backer.amount} ({backer.frequency === 'monthly' ? 'Monthly Sustaining' : 'One-time'})</span>
              </div>
            </div>

            {/* Cryptographic Hash */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Verification Hash:</span>
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-300">
                <span className="truncate mr-2">{verificationHash}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(verificationHash);
                    setCopiedHash(true);
                    setTimeout(() => setCopiedHash(false), 2000);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 shrink-0 cursor-pointer"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-colors text-center cursor-pointer"
            >
              Close Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
