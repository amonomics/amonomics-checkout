import React, { useState } from 'react';
import { X, BookOpen, Terminal, Shield, Zap, Copy, Check, ExternalLink, Code2 } from 'lucide-react';

interface DevDocsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevDocsDrawer: React.FC<DevDocsDrawerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'env' | 'api'>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const envContent = `# Production & Local Environment Blueprint (.env.local)
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...
GEMINI_API_KEY=AIzaSy...
GITHUB_TOKEN=ghp_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl h-full bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">
              amonomics-checkout — Project Blueprint & Docs
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-800 px-6 bg-zinc-950/40">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'architecture'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Architecture & Flow
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'env'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Environment & Security
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'api'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            API Endpoints & Contracts
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-zinc-300 leading-relaxed font-sans">
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Micro-Funding Pipeline</span>
              </h4>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] leading-relaxed text-zinc-400 space-y-2">
                <div className="text-emerald-400 font-bold">Flow Overview:</div>
                <p>1. Supporter selects project repository & funding tier ($5 - $150 or custom).</p>
                <p>2. Backend initiates Stripe Checkout Session (/api/checkout).</p>
                <p>3. Supporter completes payment via Card or Express Pay (Apple/Google Pay).</p>
                <p>4. Payment clearance triggers Gemini 3.8 Flash appreciation engine (/api/thank-you).</p>
                <p>5. Backer receives personalized maintainer letter, impact metric, code tribute, and badge.</p>
                <p>6. Supporter is immortalized on the live Hall of Fame Backers Wall.</p>
              </div>

              <h4 className="text-sm font-bold text-white pt-2">Zero Hardcoded Secrets Guarantee</h4>
              <p className="text-zinc-400">
                All payment processing and generative AI communications happen strictly on server routes. The browser client receives only sanitized session IDs and generated appreciation content.
              </p>
            </div>
          )}

          {activeTab === 'env' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Environment Blueprint (.env.local)</h4>
                <button
                  onClick={() => copyText(envContent, 'env')}
                  className="flex items-center space-x-1 text-xs text-emerald-400 hover:underline cursor-pointer"
                >
                  {copiedKey === 'env' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'env' ? 'Copied' : 'Copy Template'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-emerald-400/90 overflow-x-auto">
                <code>{envContent}</code>
              </pre>

              <div className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-1.5">
                <span className="font-semibold text-white">Security Checklist:</span>
                <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                  <li>Verify <code className="text-cyan-400">.env*.local</code> is present in <code className="text-cyan-400">.gitignore</code>.</li>
                  <li>In Google AI Studio, <code className="text-emerald-400">GEMINI_API_KEY</code> is automatically injected from user secrets.</li>
                  <li>In Vercel production, configure keys in Project Settings &gt; Environment Variables.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Server Routes</h4>

              <div className="space-y-3 font-mono text-[11px]">
                {/* Route 1 */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      POST
                    </span>
                    <span className="text-white font-bold">/api/checkout</span>
                  </div>
                  <p className="text-zinc-400 font-sans">
                    Initializes Stripe checkout session for one-time gifts or monthly sustaining subscriptions.
                  </p>
                </div>

                {/* Route 2 */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      POST
                    </span>
                    <span className="text-white font-bold">/api/thank-you</span>
                  </div>
                  <p className="text-zinc-400 font-sans">
                    Invokes Gemini 3.8 Flash model to generate personalized maintainer letters, code tributes, and tangible compute impact metrics.
                  </p>
                </div>

                {/* Route 3 */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold text-[10px]">
                      GET
                    </span>
                    <span className="text-white font-bold">/api/backers</span>
                  </div>
                  <p className="text-zinc-400 font-sans">
                    Fetches real-time community supporters, sponsor tiers, and AI appreciation quotes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
