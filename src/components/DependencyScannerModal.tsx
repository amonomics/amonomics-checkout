import React, { useState } from 'react';
import { X, Sparkles, Box, AlertTriangle, ShieldCheck, ArrowRight, Loader2, RefreshCw, Layers } from 'lucide-react';

interface DependencyScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPledgeBundle: (amount: number) => void;
}

const SAMPLE_TEMPLATES: Record<string, string> = {
  'Node.js Microservice': JSON.stringify(
    {
      name: 'telemetry-microservice',
      dependencies: {
        express: '^4.21.2',
        dotenv: '^17.2.3',
        'canvas-confetti': '^1.9.4',
        esbuild: '^0.25.0',
        'lucide-react': '^0.546.0',
        ioredis: '^5.4.1',
      },
    },
    null,
    2
  ),
  'Next.js Fullstack App': JSON.stringify(
    {
      name: 'nextjs-saas-platform',
      dependencies: {
        next: '^15.1.0',
        react: '^19.0.0',
        'tailwind-merge': '^2.5.0',
        clsx: '^2.1.1',
        zod: '^3.23.8',
        superjson: '^2.2.1',
      },
    },
    null,
    2
  ),
};

export const DependencyScannerModal: React.FC<DependencyScannerModalProps> = ({
  isOpen,
  onClose,
  onPledgeBundle,
}) => {
  const [packageJson, setPackageJson] = useState(SAMPLE_TEMPLATES['Node.js Microservice']);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleScan = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/scan-dependencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageJsonContent: packageJson }),
      });
      const data = await res.json();
      if (data.success) {
        setScanResult(data.scanResult);
      }
    } catch (err) {
      console.error('Dependency scan failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden my-8">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 -z-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center space-x-2">
            <Box className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Gemini 3.8 Flash • AI Dependency Sustainability & Debt Scanner
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
              Audit Upstream Dependency Debt
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Paste your <code className="text-emerald-400 font-mono">package.json</code>. Gemini inspects the supply chain bus factor, identifies underfunded critical packages, and recommends bundle support.
            </p>
          </div>

          {/* Template pills */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-zinc-500 font-mono">Presets:</span>
            {Object.keys(SAMPLE_TEMPLATES).map((templateName) => (
              <button
                key={templateName}
                onClick={() => setPackageJson(SAMPLE_TEMPLATES[templateName])}
                className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px] border border-zinc-700 transition-colors cursor-pointer"
              >
                {templateName}
              </button>
            ))}
          </div>

          {/* Text Area */}
          <div className="space-y-1.5">
            <textarea
              rows={6}
              value={packageJson}
              onChange={(e) => setPackageJson(e.target.value)}
              className="w-full bg-zinc-950 font-mono text-xs text-emerald-400/90 border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-amber-500 resize-none"
              placeholder="Paste package.json here..."
            />
          </div>

          {/* Scan Action */}
          <div className="flex justify-between items-center">
            <p className="text-[11px] text-zinc-500 font-mono">
              Parses dependencies &amp; queries OSS sustainability health
            </p>

            <button
              onClick={handleScan}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning Dependency Graph...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Scan Dependency Sustainability</span>
                </>
              )}
            </button>
          </div>

          {/* Results Box */}
          {scanResult && !isLoading && (
            <div className="p-5 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                    Ecosystem Sustainability Debt Score
                  </span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-3xl font-black text-amber-400 font-mono">
                      {scanResult.debtScore}/100
                    </span>
                    <span className="text-xs text-zinc-400">
                      {scanResult.debtScore > 60 ? '⚠️ High Upstream Risk' : 'Healthy Dependency Graph'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                    Recommended Upstream Bundle
                  </span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    ${scanResult.recommendedBundlePledge} <span className="text-xs text-zinc-400">/ mo</span>
                  </span>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-zinc-300 leading-relaxed font-sans bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
                {scanResult.healthSummary}
              </p>

              {/* Critical Packages List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Identified Single-Maintainer / Critical Packages:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {scanResult.criticalPackages?.map((pkg: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-white">
                          {pkg.name}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                            pkg.riskLevel === 'high'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {pkg.riskLevel} risk
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                        <span>Bus Factor: {pkg.busFactor}</span>
                        <span>{pkg.monthlyFundingEstimate}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight">
                        {pkg.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rationale and Bundle CTA */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-emerald-200">
                  <span className="font-bold block">One-Click Ecosystem Bundle Pledge:</span>
                  <span className="text-zinc-300 font-mono text-[11px]">
                    {scanResult.oneClickPledgeRationale}
                  </span>
                </div>

                <button
                  onClick={() => {
                    onPledgeBundle(scanResult.recommendedBundlePledge);
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
                >
                  <span>Pledge ${scanResult.recommendedBundlePledge}/mo Bundle</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
