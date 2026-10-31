import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProjectHero } from './components/ProjectHero';
import { TierSelector } from './components/TierSelector';
import { SustainabilityBreakdown } from './components/SustainabilityBreakdown';
import { IssueBountiesSection } from './components/IssueBountiesSection';
import { FinancialLedgerSection } from './components/FinancialLedgerSection';
import { BackersWall } from './components/BackersWall';
import { CheckoutModal } from './components/CheckoutModal';
import { ThankYouModal } from './components/ThankYouModal';
import { WebhookSimulatorModal } from './components/WebhookSimulatorModal';
import { DevDocsDrawer } from './components/DevDocsDrawer';
import { AIAuditModal } from './components/AIAuditModal';
import { AIRoiAdvisorModal } from './components/AIRoiAdvisorModal';
import { DependencyScannerModal } from './components/DependencyScannerModal';
import { ReadmeBadgeModal } from './components/ReadmeBadgeModal';
import { CorporateInvoiceModal } from './components/CorporateInvoiceModal';
import { ChangelogTributeModal } from './components/ChangelogTributeModal';
import { DigitalBackerPassModal } from './components/DigitalBackerPassModal';
import { Project, Backer } from './types';
import { Coffee, Github, Box, Code2, Building2, GitCommit, Shield, FileText } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [backers, setBackers] = useState<Backer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{
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
  }>({
    amount: 50,
    frequency: 'monthly',
    tierTitle: 'CI Infrastructure Pillar ⚡',
    tierId: 'sponsor',
    donorName: '',
    donorEmail: '',
    donorGithub: '',
    customMessage: '',
    isAnonymous: false,
    impactArea: 'CI/CD Matrix Runners',
  });

  const [activeThankYouBacker, setActiveThankYouBacker] = useState<Backer | null>(null);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isRoiAdvisorOpen, setIsRoiAdvisorOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [activePassBacker, setActivePassBacker] = useState<Backer | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // AI Recommendation applied states
  const [externalTierId, setExternalTierId] = useState<string | undefined>(undefined);
  const [externalAmount, setExternalAmount] = useState<number | undefined>(undefined);
  const [externalDonorName, setExternalDonorName] = useState<string | undefined>(undefined);

  // Fetch initial data
  useEffect(() => {
    async function initData() {
      try {
        const [projRes, bkrRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/backers'),
        ]);

        const projData = await projRes.json();
        const bkrData = await bkrRes.json();

        if (projData.success && projData.projects?.length > 0) {
          setProjects(projData.projects);
          setSelectedProject(projData.projects[0]);
        }

        if (bkrData.success && bkrData.backers) {
          setBackers(bkrData.backers);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initData();
  }, []);

  const handleStartCheckout = (data: typeof checkoutData) => {
    setCheckoutData(data);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (newBacker: Backer) => {
    setIsCheckoutOpen(false);
    setBackers((prev) => [newBacker, ...prev]);

    if (selectedProject) {
      setSelectedProject((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          backersCount: prev.backersCount + 1,
          currentMonthlyFunding:
            newBacker.frequency === 'monthly'
              ? prev.currentMonthlyFunding + newBacker.amount
              : prev.currentMonthlyFunding,
        };
      });
    }

    setActiveThankYouBacker(newBacker);
    setIsThankYouOpen(true);
  };

  const handleApplyRoiRecommendation = (tierId: string, amount: number, companyName: string) => {
    setExternalTierId(tierId);
    setExternalAmount(amount);
    setExternalDonorName(companyName);
    scrollToTiers();
  };

  const handlePledgeBundle = (amount: number) => {
    setExternalTierId('custom');
    setExternalAmount(amount);
    setCheckoutData((prev) => ({
      ...prev,
      amount,
      frequency: 'monthly',
      tierTitle: `Upstream Ecosystem Bundle ($${amount}/mo)`,
      tierId: 'custom',
      impactArea: 'Ecosystem Dependency Bus-Factor Support',
    }));
    setIsCheckoutOpen(true);
  };

  const scrollToTiers = () => {
    const el = document.getElementById('sponsor-tiers');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading || !selectedProject) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center animate-pulse">
          <Coffee className="w-5 h-5 text-emerald-400" />
        </div>
        <p className="text-xs font-mono text-zinc-400">Loading amonomics-checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 bg-grid-pattern text-zinc-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Glow highlight */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial-glow pointer-events-none -z-10" />

      {/* Top Navigation */}
      <Header
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={(p) => setSelectedProject(p)}
        onOpenWebhookModal={() => setIsWebhookModalOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenInvoice={() => setIsInvoiceOpen(true)}
        onOpenChangelog={() => setIsChangelogOpen(true)}
        onQuickDonate={scrollToTiers}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Project Hero & Sustainability Meter */}
        <ProjectHero project={selectedProject} onSelectTier={scrollToTiers} />

        {/* Support Tiers & Supporter Customization */}
        <TierSelector
          onStartCheckout={handleStartCheckout}
          onOpenAudit={() => setIsAuditOpen(true)}
          onOpenRoiAdvisor={() => setIsRoiAdvisorOpen(true)}
          externalSelectedTierId={externalTierId}
          externalAmount={externalAmount}
          externalDonorName={externalDonorName}
        />

        {/* Milestone & Issue Micro-Bounties */}
        <IssueBountiesSection />

        {/* Radical Financial Transparency Breakdown */}
        <SustainabilityBreakdown project={selectedProject} />

        {/* Public Accounting & Expense Ledger */}
        <FinancialLedgerSection />

        {/* Backers Hall of Fame */}
        <BackersWall
          backers={backers}
          onOpenLetter={(b) => {
            setActivePassBacker(b);
            setIsPassModalOpen(true);
          }}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-white">amonomics-checkout</p>
              <p className="text-xs text-zinc-400">
                Industry-leading open-source sustainability platform powered by Stripe, GitHub & Gemini 3.8 Flash.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-400">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Box className="w-3.5 h-3.5 text-amber-400" />
              <span>Debt Scanner</span>
            </button>
            <button
              onClick={() => setIsBadgesOpen(true)}
              className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Badges</span>
            </button>
            <button
              onClick={() => setIsInvoiceOpen(true)}
              className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Corporate Invoice</span>
            </button>
            <button
              onClick={() => setIsChangelogOpen(true)}
              className="hover:text-purple-400 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <GitCommit className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Changelog</span>
            </button>
            <button
              onClick={() => setIsAuditOpen(true)}
              className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Health Audit</span>
            </button>
            <button
              onClick={() => setIsDocsOpen(true)}
              className="hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Architecture Specs
            </button>
          </div>

          <p className="text-[11px] font-mono text-zinc-500">
            Zero Hardcoded Secrets • PCI-DSS Level 1 • 100% Verified OSS
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        project={selectedProject}
        checkoutData={checkoutData}
        onSuccess={handleCheckoutSuccess}
      />

      <ThankYouModal
        isOpen={isThankYouOpen}
        onClose={() => setIsThankYouOpen(false)}
        backer={activeThankYouBacker}
      />

      <WebhookSimulatorModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
      />

      <DevDocsDrawer isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

      <AIAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        project={selectedProject}
      />

      <AIRoiAdvisorModal
        isOpen={isRoiAdvisorOpen}
        onClose={() => setIsRoiAdvisorOpen(false)}
        onApplyRecommendation={handleApplyRoiRecommendation}
      />

      <DependencyScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onPledgeBundle={handlePledgeBundle}
      />

      <ReadmeBadgeModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        project={selectedProject}
      />

      <CorporateInvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />

      <ChangelogTributeModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
        project={selectedProject}
      />

      <DigitalBackerPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        backer={activePassBacker}
      />
    </div>
  );
}
