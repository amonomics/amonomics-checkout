import React, { useState } from 'react';
import { X, Code2, Copy, Check, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { Project } from '../types';

interface ReadmeBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ReadmeBadgeModal: React.FC<ReadmeBadgeModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [badgeStyle, setBadgeStyle] = useState<'flat' | 'flat-square' | 'for-the-badge'>('flat-square');

  if (!isOpen) return null;

  const origin = window.location.origin;
  const badgeSvgUrl = `${origin}/api/badge/${project.id}.svg`;
  const markdownBadge = `[![Amonomics Sustainability](${badgeSvgUrl})](${origin})`;
  const htmlBadge = `<a href="${origin}"><img src="${badgeSvgUrl}" alt="Amonomics Sustainability" /></a>`;

  const sponsorGridMarkdown = `## 💖 Sponsoring ${project.name}

This project is sustained by community micro-funding via **[amonomics-checkout](${origin})**.
Every dollar funds continuous CI matrix runners, CVE audits, and maintainer triage hours.

[![Sustain ${project.name}](${badgeSvgUrl})](${origin})

### 🛡️ Sustaining Backers
| Sponsor | Tier | Allocation |
|---|---|---|
| **Sarah Jenkins** (@sjenkins-dev) | CI Infrastructure Pillar ⚡ | CI/CD Matrix Runners |
| **ByteWorks Studio** | Enterprise Guardian 🛡️ | Dedicated Maintainer Hours |
| **Marcus Vance** (@marcus-cloud) | Debug Champion 🐛 | Security & CVE Auditing |

*Want to sponsor? [Back ${project.name} on amonomics-checkout](${origin})*`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden my-8">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 -z-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Interactive README Sponsor Grid & SVG Badge Generator
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
              Embed Live Backer Badges in Your GitHub README
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Dynamic SVG badges update automatically as new backers pledge on <span className="text-emerald-400 font-mono">amonomics-checkout</span>.
            </p>
          </div>

          {/* Live SVG Badge Preview */}
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <span className="text-xs font-mono text-zinc-400 block">Live SVG Badge Preview:</span>
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-zinc-900/80 border border-zinc-800/80">
              <img src={`/api/badge/${project.id}.svg`} alt="Live SVG Badge" className="h-7" />
              <span className="text-[11px] text-emerald-400 font-mono">← Real-time SVG endpoint</span>
            </div>
          </div>

          {/* Markdown Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300 font-semibold">GitHub README Markdown Badge:</span>
              <button
                onClick={() => copyToClipboard(markdownBadge, 'md')}
                className="flex items-center space-x-1 text-emerald-400 hover:underline cursor-pointer"
              >
                {copiedKey === 'md' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'md' ? 'Copied' : 'Copy Markdown'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-400/90 overflow-x-auto">
              <code>{markdownBadge}</code>
            </pre>
          </div>

          {/* Full Sponsor Grid Markdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300 font-semibold">Complete README Sponsor Section:</span>
              <button
                onClick={() => copyToClipboard(sponsorGridMarkdown, 'grid')}
                className="flex items-center space-x-1 text-emerald-400 hover:underline cursor-pointer"
              >
                {copiedKey === 'grid' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'grid' ? 'Copied' : 'Copy README Section'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto max-h-48 leading-relaxed">
              <code>{sponsorGridMarkdown}</code>
            </pre>
          </div>

          {/* HTML Embed Option */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400 font-semibold">HTML Web Embed:</span>
              <button
                onClick={() => copyToClipboard(htmlBadge, 'html')}
                className="flex items-center space-x-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                {copiedKey === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'html' ? 'Copied' : 'Copy HTML'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 overflow-x-auto">
              <code>{htmlBadge}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
