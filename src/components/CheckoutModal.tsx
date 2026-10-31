import React, { useState, useEffect } from 'react';
import { X, Lock, CreditCard, ShieldCheck, CheckCircle2, Loader2, Sparkles, AlertCircle, RefreshCw, Check, Building2, ExternalLink } from 'lucide-react';
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
  initialTestCard?: { number: string; exp: string; cvc: string; type: string } | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  project,
  checkoutData,
  onSuccess,
  initialTestCard,
}) => {
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [zip, setZip] = useState('94103');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [hostedCheckoutUrl, setHostedCheckoutUrl] = useState<string | null>(null);

  // 3D Secure verification simulation state
  const [show3DSModal, setShow3DSModal] = useState(false);
  const [is3DSAuthenticating, setIs3DSAuthenticating] = useState(false);

  useEffect(() => {
    if (initialTestCard) {
      setCardNumber(initialTestCard.number);
      setExpiry(initialTestCard.exp);
      setCvc(initialTestCard.cvc);
    }
  }, [initialTestCard]);

  if (!isOpen) return null;

  const selectTestCardPreset = (type: 'success' | '3ds' | 'declined' | 'insufficient' | 'expired') => {
    setErrorMessage(null);
    setErrorDetails(null);
    if (type === 'success') {
      setCardNumber('4242 •••• •••• 4242');
      setExpiry('12/28');
      setCvc('123');
      setZip('94103');
    } else if (type === '3ds') {
      setCardNumber('4000 •••• •••• 3184');
      setExpiry('12/28');
      setCvc('123');
      setZip('94103');
    } else if (type === 'declined') {
      setCardNumber('4000 •••• •••• 0002');
      setExpiry('12/28');
      setCvc('123');
      setZip('94103');
    } else if (type === 'insufficient') {
      setCardNumber('4000 •••• •••• 0115');
      setExpiry('12/28');
      setCvc('123');
      setZip('94103');
    } else if (type === 'expired') {
      setCardNumber('4000 •••• •••• 0069');
      setExpiry('01/20');
      setCvc('123');
      setZip('94103');
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);
    setErrorDetails(null);

    // Normalize card digits
    const digits = cardNumber.replace(/\D/g, '');

    // Test Card Scenario 1: Declined Card (ending in 0002)
    if (digits.endsWith('0002')) {
      await new Promise((r) => setTimeout(r, 800));
      setIsProcessing(false);
      setErrorMessage('Your card was declined by the issuer.');
      setErrorDetails('Stripe Error: card_declined (Decline Code: generic_decline). The cardholder should contact their issuing bank or use another card.');
      return;
    }

    // Test Card Scenario 2: Insufficient Funds (ending in 0115)
    if (digits.endsWith('0115')) {
      await new Promise((r) => setTimeout(r, 800));
      setIsProcessing(false);
      setErrorMessage('Your card has insufficient funds.');
      setErrorDetails('Stripe Error: insufficient_funds (Status 402 Payment Required). Please select a different payment card or add funds.');
      return;
    }

    // Test Card Scenario 3: Expired Card (ending in 0069 or expiry year in the past)
    if (digits.endsWith('0069') || expiry.endsWith('20') || expiry.endsWith('21')) {
      await new Promise((r) => setTimeout(r, 600));
      setIsProcessing(false);
      setErrorMessage('Your card has expired.');
      setErrorDetails('Stripe Error: expired_card (Status 400 Bad Request). The expiration date provided is in the past.');
      return;
    }

    // Test Card Scenario 4: 3D Secure Strong Customer Authentication (SCA)
    if (digits.endsWith('3184')) {
      await new Promise((r) => setTimeout(r, 700));
      setIsProcessing(false);
      setShow3DSModal(true);
      return;
    }

    // Standard Success Flow
    await executeSuccessfulPayment();
  };

  const executeSuccessfulPayment = async () => {
    try {
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
      setProcessingStep('Authorizing payment with Stripe test network...');
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
          stripeSessionId: sessionData.sessionId,
          aiThankYouNote: aiNote,
        }),
      });

      const backerData = await backerRes.json();
      if (!backerData.success) {
        throw new Error('Failed to record backer');
      }

      setIsProcessing(false);
      setShow3DSModal(false);
      onSuccess(backerData.backer);
    } catch (err: any) {
      console.error('Payment flow failed:', err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden my-6">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              S
            </div>
            <span className="font-semibold text-white text-sm">
              Stripe Sandbox Checkout — {project.repo}
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
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
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
              <span className="text-xs text-zinc-400 block font-mono">
                {checkoutData.frequency === 'monthly' ? '/month' : 'one-time'}
              </span>
            </div>
          </div>

          {/* Test Cards Quick-Fill Toolbar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">Sandbox Test Scenarios:</span>
              <span className="text-[10px] text-emerald-400 font-semibold">1-Click Autofill</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => selectTestCardPreset('success')}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer"
              >
                ✓ Success (Visa)
              </button>
              <button
                type="button"
                onClick={() => selectTestCardPreset('3ds')}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors cursor-pointer"
              >
                ⚡ 3DS / SCA
              </button>
              <button
                type="button"
                onClick={() => selectTestCardPreset('declined')}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
              >
                ✕ Decline
              </button>
              <button
                type="button"
                onClick={() => selectTestCardPreset('insufficient')}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 transition-colors cursor-pointer"
              >
                $ Insufficient
              </button>
              <button
                type="button"
                onClick={() => selectTestCardPreset('expired')}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors cursor-pointer"
              >
                ⌛ Expired
              </button>
            </div>
          </div>

          {/* Business Profile Autofill Pill */}
          <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-semibold text-white flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Merchant: Amonomics Open Source Technologies</span>
              </span>
              <p className="text-[10px] text-zinc-400 font-mono">Statement Descriptor: AMONOMICS*OSS</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              USD ($)
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

            {/* Error Message with Stripe Diagnostics */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1 animate-fade-in">
                <div className="flex items-center space-x-2 font-bold text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                {errorDetails && (
                  <p className="text-[11px] text-rose-200/90 font-mono pl-6 leading-relaxed">
                    {errorDetails}
                  </p>
                )}
              </div>
            )}

            {/* Processing State status */}
            {isProcessing && (
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-3 animate-pulse">
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
                  <span>Authorizing with Stripe Sandbox...</span>
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

      {/* 3D Secure Authentication Challenge Modal Simulation */}
      {show3DSModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-amber-500/50 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm text-white">
                  Bank 3D Secure (SCA) Authentication
                </span>
              </div>
              <button
                onClick={() => setShow3DSModal(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <p>
                Stripe requires Strong Customer Authentication (SCA) for this transaction:
              </p>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[11px] space-y-1">
                <div>Merchant: <strong>Amonomics Open Source Technologies</strong></div>
                <div>Amount: <strong>${checkoutData.amount} USD</strong></div>
                <div>Card: <strong>Visa ending in 3184</strong></div>
              </div>
              <p className="text-[11px] text-zinc-400">
                Click <strong>"Simulate 3DS Complete"</strong> to authorize or <strong>"Fail 3DS"</strong> to test customer decline.
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShow3DSModal(false);
                  setErrorMessage('3D Secure verification failed or cancelled by user.');
                  setErrorDetails('Stripe Error: authentication_required. The customer failed or abandoned the 3D Secure verification step.');
                }}
                className="flex-1 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-rose-300 transition-colors cursor-pointer"
              >
                Fail Challenge
              </button>

              <button
                type="button"
                disabled={is3DSAuthenticating}
                onClick={async () => {
                  setIs3DSAuthenticating(true);
                  await executeSuccessfulPayment();
                  setIs3DSAuthenticating(false);
                }}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-xs font-bold text-zinc-950 shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                {is3DSAuthenticating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Simulate 3DS Complete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
