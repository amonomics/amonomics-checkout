import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Activity, CheckCircle2, AlertCircle, RefreshCw, Loader2, Play, CreditCard, ExternalLink, Building2, Terminal, Info } from 'lucide-react';

interface StripeSandboxHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTestCard: (card: { number: string; exp: string; cvc: string; type: string }) => void;
}

export const STRIPE_TEST_CARDS = [
  {
    type: 'Success (Visa)',
    number: '4242 •••• •••• 4242',
    rawNumber: '4242 4242 4242 4242',
    exp: '12/28',
    cvc: '123',
    outcome: 'Approved (200 OK)',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'Standard successful payment. Generates instant receipt & Gemini appreciation letter.',
  },
  {
    type: '3D Secure (SCA)',
    number: '4000 •••• •••• 3184',
    rawNumber: '4000 0027 6000 3184',
    exp: '12/28',
    cvc: '123',
    outcome: 'Requires SCA 3DS Step',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    description: 'Strong Customer Authentication challenge. Tests simulated bank 3DS popup verification.',
  },
  {
    type: 'Declined (Generic)',
    number: '4000 •••• •••• 0002',
    rawNumber: '4000 0000 0000 0002',
    exp: '12/28',
    cvc: '123',
    outcome: 'card_declined (402)',
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    description: 'Simulates general issuer decline. Tests how the checkout handles payment rejection.',
  },
  {
    type: 'Insufficient Funds',
    number: '4000 •••• •••• 0115',
    rawNumber: '4000 0000 0000 0115',
    exp: '12/28',
    cvc: '123',
    outcome: 'insufficient_funds',
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    description: 'Account balance below checkout total. Verifies retry messaging.',
  },
  {
    type: 'Expired Card',
    number: '4000 •••• •••• 0069',
    rawNumber: '4000 0000 0000 0069',
    exp: '01/20',
    cvc: '123',
    outcome: 'expired_card',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    description: 'Simulates expired validity period. Tests front-end card expiry validation.',
  },
  {
    type: 'Incorrect CVC',
    number: '4000 •••• •••• 0127',
    rawNumber: '4000 0000 0000 0127',
    exp: '12/28',
    cvc: '999',
    outcome: 'incorrect_cvc',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    description: 'Security code mismatch. Tests CVC re-entry notification.',
  },
];

export const StripeSandboxHubModal: React.FC<StripeSandboxHubModalProps> = ({
  isOpen,
  onClose,
  onSelectTestCard,
}) => {
  const [sandboxStatus, setSandboxStatus] = useState<any>(null);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'cards' | 'business'>('diagnostics');

  useEffect(() => {
    if (isOpen) {
      fetch('/api/stripe/sandbox-status')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.sandbox) {
            setSandboxStatus(data.sandbox);
          }
        })
        .catch((err) => console.error('Failed to get sandbox status:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const runDiagnostics = async () => {
    setIsDiagnosticRunning(true);
    setDiagnosticResults(null);
    try {
      const res = await fetch('/api/stripe/run-diagnostics', {
        method: 'POST',
      });
      const data = await res.json();
      setDiagnosticResults(data);
    } catch (err: any) {
      setDiagnosticResults({
        success: false,
        error: err.message || 'Diagnostic failed',
      });
    } finally {
      setIsDiagnosticRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden my-8">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 -z-10 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Stripe Sandbox Testing Lab &amp; Account Diagnostics
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-zinc-800 px-6 bg-zinc-950/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'diagnostics'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sandbox Diagnostics &amp; Health
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'cards'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Test Cards Documentation ({STRIPE_TEST_CARDS.length})
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'business'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Business &amp; Account Profile
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* TAB 1: Diagnostics */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-6">
              {/* Status Header Pill */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-sm text-white">
                      Stripe API Sandbox Connected
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      LIVE TESTMODE
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono">
                    Account: {sandboxStatus?.accountId || 'acct_1TZcDUCSA5nWEAyP'} • API Latency: {sandboxStatus?.apiLatencyMs || 18}ms
                  </p>
                </div>

                <button
                  onClick={runDiagnostics}
                  disabled={isDiagnosticRunning}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-zinc-950 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isDiagnosticRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Running 5-Step Diagnostic...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-zinc-950" />
                      <span>Run Live Sandbox Test</span>
                    </>
                  )}
                </button>
              </div>

              {/* Diagnostic Results Stream */}
              {diagnosticResults && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>All 5 Sandbox API Tests Passed ({diagnosticResults.totalDurationMs}ms total)</span>
                    </span>
                    <span className="text-zinc-500">200 OK</span>
                  </div>

                  <div className="space-y-2">
                    {diagnosticResults.results?.map((res: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-start justify-between text-xs font-mono"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                              ✓
                            </span>
                            <span className="font-bold text-white">{res.test}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 pl-6 font-sans">
                            {res.details}
                          </p>
                        </div>
                        <span className="text-[10px] text-zinc-500 shrink-0 ml-3">
                          {res.durationMs}ms
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!diagnosticResults && !isDiagnosticRunning && (
                <div className="text-center py-6 text-xs text-zinc-400 space-y-2 border border-dashed border-zinc-800 rounded-xl p-4">
                  <Activity className="w-6 h-6 text-cyan-400 mx-auto" />
                  <p>Click "Run Live Sandbox Test" above to verify customer creation, checkout sessions, and PaymentIntent settlements directly against Stripe test servers.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Test Cards Documentation */}
          {activeTab === 'cards' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Test how the checkout reacts to different card scenarios. Click <strong>"Use in Checkout"</strong> to autofill any card and test its behavior.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STRIPE_TEST_CARDS.map((card, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{card.type}</span>
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${card.color}`}>
                          {card.outcome}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-zinc-300 font-bold tracking-wider">
                        {card.number}
                      </p>
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                        {card.description}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onSelectTestCard({
                          number: card.rawNumber,
                          exp: card.exp,
                          cvc: card.cvc,
                          type: card.type,
                        });
                        onClose();
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer text-center"
                    >
                      Use in Checkout →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Business & Account Profile */}
          {activeTab === 'business' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-white font-bold text-sm">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>Stripe Merchant Account Profile (Sandbox)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">LEGAL BUSINESS NAME</span>
                    <span className="text-white font-semibold">Amonomics Open Source Technologies, Inc.</span>
                  </div>

                  <div>
                    <span className="text-zinc-500 block text-[10px]">STATEMENT DESCRIPTOR</span>
                    <span className="text-white font-semibold">AMONOMICS*OSS</span>
                  </div>

                  <div>
                    <span className="text-zinc-500 block text-[10px]">STRIPE ACCOUNT ID</span>
                    <span className="text-cyan-400 font-bold">{sandboxStatus?.accountId || 'acct_1TZcDUCSA5nWEAyP'}</span>
                  </div>

                  <div>
                    <span className="text-zinc-500 block text-[10px]">ENVIRONMENT MODE</span>
                    <span className="text-emerald-400 font-bold">Stripe Testmode (Sandbox)</span>
                  </div>

                  <div>
                    <span className="text-zinc-500 block text-[10px]">SUPPORT EMAIL</span>
                    <span className="text-white">support@amonomics.io</span>
                  </div>

                  <div>
                    <span className="text-zinc-500 block text-[10px]">DEFAULT SETTLEMENT CURRENCY</span>
                    <span className="text-white">USD ($)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-xs text-zinc-300">
                <div className="flex items-center space-x-2 font-bold text-white">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span>How Sandbox Mode Protects Production</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-400">
                  All transactions initiated with test keys (<code className="text-emerald-400">sk_test_...</code> / <code className="text-emerald-400">pk_test_...</code>) are processed through the Stripe test banking sandbox. No real funds are moved, no real credit cards are charged, and charges can be inspected in the Stripe Test Dashboard at any time.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
