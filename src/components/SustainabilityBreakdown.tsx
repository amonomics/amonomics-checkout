import React, { useState } from 'react';
import { DollarSign, Cpu, Clock, ShieldAlert, BarChart3, Info, CheckCircle2 } from 'lucide-react';
import { Project } from '../types';

interface SustainabilityBreakdownProps {
  project: Project;
}

export const SustainabilityBreakdown: React.FC<SustainabilityBreakdownProps> = ({ project }) => {
  const [testAmount, setTestAmount] = useState<number>(50);

  const totalBudget = project.sustainabilityNeeds.reduce(
    (acc, curr) => acc + curr.costMonthly,
    0
  );

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Radical Financial Transparency</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Where Does Every Dollar Go?
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            A transparent monthly cost model showing exact infrastructure, security fuzzing, and maintainer time needed to keep <span className="text-white font-medium">{project.repo}</span> healthy.
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs font-mono text-zinc-500 uppercase">Total Monthly Target</span>
          <p className="text-2xl font-black text-white font-mono">
            ${totalBudget.toLocaleString()} <span className="text-xs text-zinc-400 font-sans">/ mo</span>
          </p>
        </div>
      </div>

      {/* Breakdown Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {project.sustainabilityNeeds.map((need, idx) => {
          const percentOfBudget = Math.round((need.costMonthly / totalBudget) * 100);

          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                    <span>{need.category}</span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {need.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-white font-mono">
                    ${need.costMonthly}
                  </span>
                  <span className="text-[10px] text-zinc-500 block font-mono">
                    {percentOfBudget}% of target
                  </span>
                </div>
              </div>

              {/* Progress visual */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${percentOfBudget * 1.5}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span
                    className={
                      need.urgency === 'critical'
                        ? 'text-amber-400 font-bold'
                        : need.urgency === 'moderate'
                        ? 'text-cyan-400'
                        : 'text-zinc-500'
                    }
                  >
                    Status: {need.urgency.toUpperCase()}
                  </span>
                  <span className="text-zinc-500">Fixed Cost</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Micro-Funding Simulator */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Interactive Impact Calculator</h4>
          </div>
          <p className="text-xs text-zinc-400 max-w-md">
            Drag the slider to see how your pledge directly translates into tangible CI compute and bug triage time.
          </p>
        </div>

        <div className="flex-1 max-w-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-mono">Simulated Pledge:</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              ${testAmount} / month
            </span>
          </div>

          <input
            type="range"
            min="5"
            max="250"
            step="5"
            value={testAmount}
            onChange={(e) => setTestAmount(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500 cursor-pointer"
          />

          <div className="text-[11px] font-mono text-zinc-300 bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 flex items-center justify-between">
            <span>Enables:</span>
            <span className="text-emerald-300 font-bold">
              ~{(testAmount * 24).toLocaleString()} CI runner minutes + {(testAmount * 0.2).toFixed(1)} hrs review
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
