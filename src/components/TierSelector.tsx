import React, { useState, useEffect } from 'react';
import { Coffee, Bug, Zap, Shield, Sparkles, Check, ArrowRight, Github, User, Mail, MessageSquare, Target, CheckCircle2, Loader2, Bot } from 'lucide-react';
import { SupportTier } from '../types';

export const TIERS: SupportTier[] = [
  {
    id: 'coffee',
    title: 'Warm Espresso ☕',
    amount: 5,
    icon: 'coffee',
    description: 'Fuel late-night PR reviews and bug triages.',
    perks: [
      'Name listed in Backers Hall of Fame',
      'Personalized Gemini AI appreciation letter',
      'Official Backer badge for your GitHub profile',
    ],
    impactArea: 'Maintainer Espresso & Energy',
    colorScheme: {
      badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      border: 'hover:border-amber-500/50',
      glow: 'shadow-amber-500/10',
    },
  },
  {
    id: 'booster',
    title: 'Debug Champion 🐛',
    amount: 15,
    icon: 'bug',
    description: 'Sponsor interactive documentation & reproducible bug reproduction.',
    perks: [
      'All Espresso perks included',
      'Custom code snippet tribute in thank-you dispatch',
      'Supporter role in project GitHub Discussions',
      'Funds 350 CI runner minutes on every PR',
    ],
    impactArea: 'Documentation & Benchmarks',
    colorScheme: {
      badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      border: 'hover:border-emerald-500/50',
      glow: 'shadow-emerald-500/10',
    },
  },
  {
    id: 'sponsor',
    title: 'CI Infrastructure Pillar ⚡',
    amount: 50,
    popular: true,
    icon: 'zap',
    description: 'Directly subsidize multi-platform macOS, ARM64 & Linux continuous build matrix.',
    perks: [
      'All Champion perks included',
      'Permanent logo / GitHub avatar on README sponsor grid',
      'Priority tag on submitted issues & PR reviews',
      'Custom AI thank-you letter from lead maintainer',
      'Generates 1,200 CI runner minutes',
    ],
    impactArea: 'CI/CD Matrix Runners',
    colorScheme: {
      badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      border: 'border-cyan-500/60 shadow-lg shadow-cyan-500/10',
      glow: 'shadow-cyan-500/20',
    },
  },
  {
    id: 'enterprise',
    title: 'Enterprise Guardian 🛡️',
    amount: 150,
    icon: 'shield',
    description: 'Ensure foundational security auditing, CVE triage, and dedicated maintainer hours.',
    perks: [
      'All Pillar perks included',
      'Dedicated sponsor spotlight in monthly changelog',
      'Direct Discord / Slack channel with maintainers',
      'Company logo hyperlinked on project landing page',
      'Sponsors 10 hours of core maintainer review',
    ],
    impactArea: 'Dedicated Maintainer Hours',
    colorScheme: {
      badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
      border: 'hover:border-purple-500/50',
      glow: 'shadow-purple-500/10',
    },
  },
];

interface TierSelectorProps {
  onStartCheckout: (data: {
    amount: number;
    frequency: 'once' | 'monthly';
    tierTitle: string;
    tierId: string;
    donorName: string;
    donorEmail: string;
    donorGithub: string;
    customMessage: string;
    isAnonymous: boolean;
    impactArea: string;
  }) => void;
  onOpenAudit: () => void;
  onOpenRoiAdvisor: () => void;
  externalSelectedTierId?: string;
  externalAmount?: number;
  externalDonorName?: string;
}

export const TierSelector: React.FC<TierSelectorProps> = ({
  onStartCheckout,
  onOpenAudit,
  onOpenRoiAdvisor,
  externalSelectedTierId,
  externalAmount,
  externalDonorName,
}) => {
  const [selectedTierId, setSelectedTierId] = useState<string>('sponsor');
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('monthly');
  const [customAmount, setCustomAmount] = useState<string>('75');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // Supporter details
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorGithub, setDonorGithub] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [impactArea, setImpactArea] = useState<string>('CI/CD Matrix Runners');

  // GitHub user lookup verification state
  const [isVerifyingGithub, setIsVerifyingGithub] = useState(false);
  const [verifiedGithubUser, setVerifiedGithubUser] = useState<any>(null);

  useEffect(() => {
    if (externalSelectedTierId) {
      setSelectedTierId(externalSelectedTierId);
      setIsCustom(false);
    }
    if (externalAmount) {
      setCustomAmount(String(externalAmount));
    }
    if (externalDonorName) {
      setDonorName(externalDonorName);
    }
  }, [externalSelectedTierId, externalAmount, externalDonorName]);

  // Debounced GitHub user verification
  useEffect(() => {
    const handle = donorGithub.replace('@', '').trim();
    if (!handle || isAnonymous) {
      setVerifiedGithubUser(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsVerifyingGithub(true);
      try {
        const res = await fetch(`/api/github/user/${encodeURIComponent(handle)}`);
        const data = await res.json();
        if (data.success && data.user) {
          setVerifiedGithubUser(data.user);
          if (!donorName && data.user.name) {
            setDonorName(data.user.name);
          }
        } else {
          setVerifiedGithubUser(null);
        }
      } catch (err) {
        setVerifiedGithubUser(null);
      } finally {
        setIsVerifyingGithub(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [donorGithub, isAnonymous]);

  const selectedTier = TIERS.find((t) => t.id === selectedTierId) || TIERS[1];
  const finalAmount = isCustom ? Math.max(1, parseFloat(customAmount) || 5) : selectedTier.amount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartCheckout({
      amount: finalAmount,
      frequency,
      tierTitle: isCustom ? `Custom Patron ($${finalAmount})` : selectedTier.title,
      tierId: isCustom ? 'custom' : selectedTier.id,
      donorName: isAnonymous ? 'Anonymous Supporter' : (donorName.trim() || 'Generous Builder'),
      donorEmail: donorEmail.trim(),
      donorGithub: isAnonymous ? '' : donorGithub.replace('@', '').trim(),
      customMessage: customMessage.trim(),
      isAnonymous,
      impactArea,
    });
  };

  return (
    <section id="sponsor-tiers" className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Support Tiers & Sustainability</span>
            </span>

            {/* AI Advisor Trigger Buttons */}
            <button
              onClick={onOpenRoiAdvisor}
              type="button"
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Sponsor ROI Advisor</span>
            </button>

            <button
              onClick={onOpenAudit}
              type="button"
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Health Audit</span>
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Choose Your Impact Level
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            Select a tier to fund compute, security audits, and developer hours. Every pledge unlocks a unique Gemini AI-generated appreciation letter.
          </p>
        </div>

        {/* Frequency Toggle: Once vs Monthly */}
        <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-xl self-start md:self-auto">
          <button
            type="button"
            onClick={() => setFrequency('monthly')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              frequency === 'monthly'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Monthly Sustaining</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-zinc-950/20 rounded font-mono">
              Recurring
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFrequency('once')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              frequency === 'once'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>One-Time Gift</span>
          </button>
        </div>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TIERS.map((tier) => {
          const isSelected = !isCustom && selectedTierId === tier.id;

          return (
            <div
              key={tier.id}
              onClick={() => {
                setIsCustom(false);
                setSelectedTierId(tier.id);
                setImpactArea(tier.impactArea);
              }}
              className={`relative rounded-xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-900/90 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                  : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-900/40 hover:border-zinc-700'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-emerald-400 text-zinc-950 shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                    {tier.icon === 'coffee' && <Coffee className="w-5 h-5 text-amber-400" />}
                    {tier.icon === 'bug' && <Bug className="w-5 h-5 text-emerald-400" />}
                    {tier.icon === 'zap' && <Zap className="w-5 h-5 text-cyan-400" />}
                    {tier.icon === 'shield' && <Shield className="w-5 h-5 text-purple-400" />}
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-white">
                      ${tier.amount}
                    </span>
                    <span className="text-xs text-zinc-400 block font-mono">
                      {frequency === 'monthly' ? '/month' : 'one-time'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base">{tier.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                {/* Perks */}
                <ul className="space-y-1.5 pt-2 border-t border-zinc-800/60">
                  {tier.perks.map((perk, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 mt-3">
                <div
                  className={`w-full py-2 text-center rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-zinc-950 font-bold'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  {isSelected ? 'Selected Tier' : 'Select Tier'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Amount Option */}
      <div
        onClick={() => setIsCustom(true)}
        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isCustom
            ? 'bg-zinc-900/90 border-emerald-500 ring-1 ring-emerald-500/50'
            : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 font-mono font-bold">
            $
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Custom Contribution</h4>
            <p className="text-xs text-zinc-400">
              Support any amount that suits your team or budget.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 font-mono text-sm">
              $
            </span>
            <input
              type="number"
              min="1"
              value={customAmount}
              onChange={(e) => {
                setIsCustom(true);
                setCustomAmount(e.target.value);
              }}
              onFocus={() => setIsCustom(true)}
              className="w-32 bg-zinc-950 text-white font-mono font-bold text-sm pl-7 pr-3 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="75"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsCustom(true)}
            className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${
              isCustom ? 'bg-emerald-500 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-300'
            }`}
          >
            Use Custom
          </button>
        </div>
      </div>

      {/* Backer Details & Custom Note Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
        <div className="flex items-center space-x-2 border-b border-zinc-800/80 pb-3">
          <Target className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Supporter Profile & AI Dispatch Customization
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Supporter Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>Your Name / Team</span>
            </label>
            <input
              type="text"
              disabled={isAnonymous}
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder={isAnonymous ? 'Anonymous Supporter' : 'e.g. Linus Tech, Acme Corp'}
              className="w-full bg-zinc-950 text-xs text-white border border-zinc-800 rounded-lg px-3 py-2.5 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            />
          </div>

          {/* GitHub Username with live verification */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
                <Github className="w-3.5 h-3.5 text-zinc-400" />
                <span>GitHub Username (Token Verified)</span>
              </label>
              {isVerifyingGithub && (
                <span className="text-[10px] font-mono text-zinc-400 flex items-center space-x-1">
                  <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                  <span>Checking...</span>
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 font-mono text-xs">
                @
              </span>
              <input
                type="text"
                disabled={isAnonymous}
                value={donorGithub}
                onChange={(e) => setDonorGithub(e.target.value)}
                placeholder="sjenkins-dev"
                className="w-full bg-zinc-950 text-xs text-white font-mono border border-zinc-800 rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>

            {/* Verified GitHub Card Badge */}
            {verifiedGithubUser && !isAnonymous && (
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-2.5 animate-fade-in mt-1">
                <img
                  src={verifiedGithubUser.avatar_url}
                  alt={verifiedGithubUser.login}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-400"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-white truncate">
                      {verifiedGithubUser.name || verifiedGithubUser.login}
                    </span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {verifiedGithubUser.followers} followers • {verifiedGithubUser.public_repos} repos
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span>Email (Stripe receipt)</span>
            </label>
            <input
              type="email"
              required
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              placeholder="developer@company.com"
              className="w-full bg-zinc-950 text-xs text-white border border-zinc-800 rounded-lg px-3 py-2.5 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Impact Area and Anonymous Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Direct Funding Allocation (Optional Preference)
            </label>
            <select
              value={impactArea}
              onChange={(e) => setImpactArea(e.target.value)}
              className="w-full bg-zinc-950 text-xs text-zinc-200 border border-zinc-800 rounded-lg px-3 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="CI/CD Matrix Runners">CI/CD Matrix Runners (macOS, ARM64, Linux)</option>
              <option value="Dedicated Maintainer Hours">Dedicated Maintainer Hours (PR Triage & Reviews)</option>
              <option value="Security & CVE Auditing">Security & CVE Auditing (Fuzzing, Static Scans)</option>
              <option value="Documentation & Benchmarks">Documentation, Playgrounds & Benchmarks</option>
              <option value="Maintainer Espresso & Energy">Maintainer Espresso & Community Energy</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              id="anonymous-checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="anonymous-checkbox" className="text-xs text-zinc-300 cursor-pointer select-none">
              Make this pledge anonymous (Hide name & GitHub handle on the public wall)
            </label>
          </div>
        </div>

        {/* Custom Heartfelt Message */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
            <span>Message to Maintainers (Gemini AI incorporates this in your thank-you letter)</span>
          </label>
          <textarea
            rows={2}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="e.g. Thanks for the quick fix on issue #142! Saved our telemetry ingestion pipeline."
            className="w-full bg-zinc-950 text-xs text-white border border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        {/* Summary Banner and Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-zinc-800/80">
          <div className="text-xs text-zinc-400">
            Total pledge:{' '}
            <span className="text-lg font-bold text-white font-mono">
              ${finalAmount}
            </span>{' '}
            <span className="text-zinc-400">
              ({frequency === 'monthly' ? 'billed monthly' : 'one-time charge'}) via Stripe
            </span>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-teal-300 text-zinc-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <span>Proceed to Stripe Checkout</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </form>
    </section>
  );
};
