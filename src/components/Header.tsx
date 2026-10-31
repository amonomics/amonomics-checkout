import React from 'react';
import { Coffee, ShieldCheck, Github, Terminal, Sparkles, Activity, Box, Code2, Building2, GitCommit } from 'lucide-react';
import { Project } from '../types';

interface HeaderProps {
  projects: Project[];
  selectedProject: Project;
  onSelectProject: (project: Project) => void;
  onOpenWebhookModal: () => void;
  onOpenDocs: () => void;
  onOpenAudit: () => void;
  onOpenScanner: () => void;
  onOpenBadges: () => void;
  onOpenInvoice: () => void;
  onOpenChangelog: () => void;
  onQuickDonate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onOpenWebhookModal,
  onOpenDocs,
  onOpenAudit,
  onOpenScanner,
  onOpenBadges,
  onOpenInvoice,
  onOpenChangelog,
  onQuickDonate,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-zinc-950 shadow-lg shadow-emerald-500/20 font-bold">
            <Coffee className="w-5 h-5 text-zinc-950 stroke-[2.2]" />
            <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                amonomics
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium">
                checkout
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Open-Source Sustainability Micro-Funding
            </p>
          </div>
        </div>

        {/* Project Selector & Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Repo selector dropdown */}
          <div className="relative">
            <select
              value={selectedProject.id}
              onChange={(e) => {
                const found = projects.find((p) => p.id === e.target.value);
                if (found) onSelectProject(found);
              }}
              className="appearance-none bg-zinc-900 hover:bg-zinc-800/80 text-xs font-mono text-zinc-200 border border-zinc-700/80 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer transition-colors"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-zinc-900 text-zinc-200">
                  {p.repo}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* AI Dependency Scanner */}
          <button
            onClick={onOpenScanner}
            className="hidden xl:flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
            title="Scan package.json for Ecosystem Debt"
          >
            <Box className="w-3.5 h-3.5 text-amber-400" />
            <span>Debt Scanner</span>
          </button>

          {/* README SVG Badge Generator */}
          <button
            onClick={onOpenBadges}
            className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
            title="Generate SVG Badges for README"
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Badges</span>
          </button>

          {/* Corporate Invoice */}
          <button
            onClick={onOpenInvoice}
            className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition-colors cursor-pointer"
            title="Request Corporate Net-30 Invoice"
          >
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Invoice</span>
          </button>

          {/* AI Changelog Tribute */}
          <button
            onClick={onOpenChangelog}
            className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition-colors cursor-pointer"
            title="Draft Release Notes with Sponsor Tributes"
          >
            <GitCommit className="w-3.5 h-3.5 text-purple-400" />
            <span>Changelog</span>
          </button>

          {/* Webhook tester button */}
          <button
            onClick={onOpenWebhookModal}
            className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-colors cursor-pointer"
            title="Simulate Stripe Webhooks"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Webhook</span>
          </button>

          {/* Direct Support CTA */}
          <button
            onClick={onQuickDonate}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-lg shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
            <span>Back</span>
          </button>
        </div>
      </div>
    </header>
  );
};
