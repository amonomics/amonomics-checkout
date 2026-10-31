import React, { useState } from 'react';
import { X, Lock, CreditCard, ShieldCheck, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Project, Backer } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  checkoutData: {
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
  };
  onSuccess: (backer: Backer) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  project,
  checkoutData,
  onSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [zip, setZip] = useState('94103');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hostedCheckoutUrl, setHostedCheckoutUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Step 1: Create checkout session via server Stripe API
      setProcessingStep('Creating secure Stripe session via API...');
      const sessionRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          amount: checkoutData.amount,
          frequency: checkoutData.frequency,
          tierTitle: checkoutData.tierTitle,
          tierId: checkoutData.tierId,
          donorName: checkoutData.donorName,
          donorEmail: checkoutData.donorEmail,
          donorGithub: checkoutData.donorGithub,
          customMessage: checkoutData.customMessage,
          isAnonymous: checkoutData.isAnonymous,
          impactArea: checkoutData.impactArea,
        }),
      });

      const sessionData = await sessionRes.json();
      if (!sessionData.success) {
        throw new Error(sessionData.error || 'Failed to create checkout session');
      }

      if (sessionData.hostedCheckoutUrl) {
        setHostedCheckoutUrl(sessionData.hostedCheckoutUrl);
      }

      // Step 2: Simulate Stripe payment verification & authorization
      setProcessingStep('Authorizing payment with Stripe network...');
      await new Promise((r) => setTimeout(r, 900));

      // Step 3: Trigger Gemini AI appreciation generator
      setProcessingStep('Connecting with Gemini AI to compose maintainer appreciation note...');
      const thankYouRes = await fetch('/api/thank-you', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          donorName: checkoutData.donorName,
          donorGithub: checkoutData.donorGithub,
          amount: checkoutData.amount,
          frequency: checkoutData.frequency,
          tierTitle: checkoutData.tierTitle,
          customMessage: checkoutData.customMessage,
          isAnonymous: checkoutData.isAnonymous,
          impactArea: checkoutData.impactArea,
        }),
      });

      const thankYouData = await thankYouRes.json();
      const aiNote = thankYouData.aiNote;

      // Step 4: Record backer to backend store
      setProcessingStep('Finalizing backer credentials and pass...');
      const backerRes = await fetch('/api/backers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          amount: checkoutData.amount,
          frequency: checkoutData.frequency,
          tierTitle: checkoutData.tierTitle,
          tierId: checkoutData.tierId,
          donorName: checkoutData.donorName,
          donorGithub: checkoutData.donorGithub,
          isAnonymous: checkoutData.isAnonymous,
          customMessage: checkoutData.customMessage,
          impactArea: checkoutData.impactArea,
          aiThankYouNote: aiNote,
        }),
      });

      const backerData = await backerRes.json();
      if (!backerData.success) {
        throw new Error('Failed to record backer');
      }

      setIsProcessing(false);
      onSuccess(backerData.backer);
    } catch (err: any) {
      console.error('Payment flow failed:', err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              S
            </div>
            <span className="font-semibold text-white text-sm">
              Stripe Checkout — {project.repo}
            </span>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Order Summary Pill */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-mono">Pledge Summary</p>
              <h4 className="text-base font-bold text-white mt-0.5">
                {checkoutData.tierTitle}
              </h4>
              <p className="text-xs text-emerald-400 mt-0.5">
                {checkoutData.impactArea}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white font-mono">
                ${checkoutData.amount}
              </span>
              <span className="text-xs text-zinc-400 block">
                {checkoutData.frequency === 'monthly' ? '/month' : 'one-time'}
              </span>
            </div>
          </div>

          {/* Test Mode Badge */}
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Stripe Test Environment Active:</strong> Pre-filled with valid test token. No real billing occurs.
            </span>
          </div>

          {/* Quick Pay Buttons Simulation */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handlePay}
              className="py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-white font-semibold text-xs border border-zinc-700 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>Pay</span>
              <span className="text-zinc-400 font-normal">Express</span>
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handlePay}
              className="py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-white font-semibold text-xs border border-zinc-700 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <span className="text-cyan-400 font-bold">G</span>
              <span>Pay</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-zinc-800 w-full" />
            <span className="bg-zinc-900 px-3 text-[11px] uppercase tracking-wider text-zinc-500 font-semibold absolute">
              Or pay with card
            </span>
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePay} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                Card Information
              </label>
              <div className="rounded-lg border border-zinc-700 bg-zinc-950 overflow-hidden divide-y divide-zinc-800">
                <div className="flex items-center px-3 py-2.5">
                  <CreditCard className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                    placeholder="Card number"
                  />
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                    TEST
                  </span>
                </div>
                <div className="grid grid-cols-3 divide-x divide-zinc-800">
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="bg-transparent text-xs text-white font-mono px-3 py-2.5 focus:outline-none"
                    placeholder="MM / YY"
                  />
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="bg-transparent text-xs text-white font-mono px-3 py-2.5 focus:outline-none"
                    placeholder="CVC"
                  />
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="bg-transparent text-xs text-white font-mono px-3 py-2.5 focus:outline-none"
                    placeholder="ZIP"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Processing State status */}
            {isProcessing && (
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-3">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400 shrink-0" />
                <span className="font-mono">{processingStep}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-teal-300 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Checkout...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    Pay ${checkoutData.amount} {checkoutData.frequency === 'monthly' ? '/ month' : ''}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Security footnote */}
          <div className="flex items-center justify-center space-x-4 text-[11px] text-zinc-500">
            <span className="flex items-center space-x-1">
              <Lock className="w-3 h-3 text-zinc-400" />
              <span>256-bit SSL</span>
            </span>
            <span>•</span>
            <span>PCI DSS Level 1</span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <Sparkles className="w-3 h-3" />
              <span>AI Thank-You Enabled</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
