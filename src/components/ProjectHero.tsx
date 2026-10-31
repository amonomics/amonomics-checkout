import React from 'react';
import { Star, GitFork, AlertCircle, CheckCircle2, ShieldCheck, Heart, ExternalLink, Code2, Cpu } from 'lucide-react';
import { Project } from '../types';

interface ProjectHeroProps {
  project: Project;
  onSelectTier: () => void;
}

export const ProjectHero: React.FC<ProjectHeroProps> = ({ project, onSelectTier }) => {
  const percentFunded = Math.min(
    100,
    Math.round((project.currentMonthlyFunding / project.monthlyGoal) * 100)
  );

  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 via-zinc-900/50 to-zinc-950 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
      {/* Decorative ambient lights */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -z-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        {/* Left: Project identity & description */}
        <div className="flex-1 space-y-4">
          {/* Top badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Sprint v2.8</span>
            </span>

            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{project.primaryLanguage}</span>
            </span>

            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{project.license}</span>
            </span>
          </div>

          {/* Title & Tagline */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>{project.name}</span>
            </h1>
            <p className="mt-1 text-sm font-mono text-emerald-400/90">
              github.com/{project.repo}
            </p>
            <p className="mt-3 text-base text-zinc-300 max-w-2xl leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* GitHub Live Metrics */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-xs font-mono text-zinc-300">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
              <span className="font-semibold text-white">{project.stars.toLocaleString()}</span>
              <span className="text-zinc-500">stars</span>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-xs font-mono text-zinc-300">
              <GitFork className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-white">{project.forks.toLocaleString()}</span>
              <span className="text-zinc-500">forks</span>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-xs font-mono text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-white">{project.prsMerged.toLocaleString()}</span>
              <span className="text-zinc-500">PRs merged</span>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-xs font-mono text-zinc-300">
              <AlertCircle className="w-3.5 h-3.5 text-violet-400" />
              <span className="font-semibold text-white">{project.openIssues}</span>
              <span className="text-zinc-500">open issues</span>
            </div>
          </div>

          {/* Maintainers */}
          <div className="pt-2 flex items-center space-x-3 text-xs text-zinc-400">
            <span className="font-medium text-zinc-300">Maintained by:</span>
            <div className="flex items-center space-x-2">
              {project.maintainers.map((m) => (
                <div
                  key={m.github}
                  className="inline-flex items-center space-x-1.5 px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-4 h-4 rounded-full object-cover ring-1 ring-emerald-500/30"
                  />
                  <span className="text-zinc-200 font-medium">{m.name}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">@{m.github}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Monthly Sustainability Progress Card */}
        <div className="lg:w-88 w-full p-5 rounded-xl bg-zinc-950/90 border border-zinc-800/90 shadow-inner flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Monthly Sustainability
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              {percentFunded}% Sustained
            </span>
          </div>

          {/* Amount and target */}
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                ${project.currentMonthlyFunding.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-zinc-400">
                / ${project.monthlyGoal.toLocaleString()} mo
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Supported by <strong className="text-emerald-300 font-mono">{project.backersCount}</strong> open-source developers & companies.
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-1000 ease-out shadow-sm shadow-emerald-500/50"
                style={{ width: `${percentFunded}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-zinc-500">
              <span>$0</span>
              <span>Need: ${(project.monthlyGoal - project.currentMonthlyFunding).toLocaleString()} to break even</span>
              <span>${project.monthlyGoal.toLocaleString()}</span>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={onSelectTier}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-zinc-950" />
            <span>Fund This Repository</span>
          </button>
        </div>
      </div>
    </section>
  );
};
