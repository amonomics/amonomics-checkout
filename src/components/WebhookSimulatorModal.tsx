import React, { useState } from 'react';
import { X, Activity, Play, Terminal, CheckCircle2, Copy, Check, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

interface WebhookSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WebhookSimulatorModal: React.FC<WebhookSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [eventType, setEventType] = useState<string>('checkout.session.completed');
  const [isSending, setIsSending] = useState(false);
  const [responseLog, setResponseLog] = useState<any>(null);
  const [copiedCli, setCopiedCli] = useState(false);

  if (!isOpen) return null;

  const samplePayloads: Record<string, any> = {
    'checkout.session.completed': {
      id: 'cs_test_a1b2c3d4e5f6',
      object: 'checkout.session',
      amount_total: 5000,
      currency: 'usd',
      customer_details: {
        email: 'developer@acme.org',
        name: 'Jordan Sparks',
      },
      metadata: {
        projectId: 'amonomics-core',
        tierTitle: 'CI Infrastructure Pillar ⚡',
        impactArea: 'CI/CD Matrix Runners',
        frequency: 'monthly',
      },
      payment_status: 'paid',
      status: 'complete',
    },
    'customer.subscription.created': {
      id: 'sub_test_99887766',
      object: 'subscription',
      billing_cycle_anchor: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor(Date.now() / 1000) + 30 * 86400,
      customer: 'cus_test_12345678',
      items: {
        data: [{ price: { unit_amount: 5000, currency: 'usd', recurring: { interval: 'month' } } }],
      },
      status: 'active',
    },
    'payment_intent.succeeded': {
      id: 'pi_test_392819283',
      object: 'payment_intent',
      amount: 1500,
      currency: 'usd',
      status: 'succeeded',
      charges: {
        data: [{ paid: true, receipt_url: 'https://pay.stripe.com/receipts/test_123' }],
      },
    },
  };

  const handleDispatch = async () => {
    setIsSending(true);
    setResponseLog(null);

    try {
      const res = await fetch('/api/stripe-webhook-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          payload: samplePayloads[eventType] || samplePayloads['checkout.session.completed'],
        }),
      });

      const data = await res.json();
      setResponseLog(data);
    } catch (err: any) {
      setResponseLog({ error: err.message || 'Webhook simulation error' });
    } finally {
      setIsSending(false);
    }
  };

  const cliSnippet = `stripe listen --forward-to http://localhost:3000/api/webhook --events checkout.session.completed`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white text-sm">
              Stripe Webhook & Event Dispatch Simulator
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <p className="text-xs text-zinc-400 leading-relaxed">
            Test how <code className="text-emerald-400 font-mono">amonomics-checkout</code> processes Stripe webhooks, verifies payment clearance, and triggers automated Gemini AI appreciation letter generation.
          </p>

          {/* Event Picker & Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                Simulated Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="bg-zinc-900 text-xs font-mono text-white border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
              >
                <option value="checkout.session.completed">checkout.session.completed</option>
                <option value="customer.subscription.created">customer.subscription.created</option>
                <option value="payment_intent.succeeded">payment_intent.succeeded</option>
              </select>
            </div>

            <button
              onClick={handleDispatch}
              disabled={isSending}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-zinc-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-zinc-950" />
                  <span>Send Simulated Webhook</span>
                </>
              )}
            </button>
          </div>

          {/* Payload Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Event Payload (Stripe Object)</span>
              <span className="text-[10px] text-zinc-500">api_version: 2024-11-20.acacia</span>
            </div>
            <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto max-h-48">
              <code>{JSON.stringify(samplePayloads[eventType], null, 2)}</code>
            </pre>
          </div>

          {/* Server Response Log */}
          {responseLog && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Server Endpoint Response (Status 200 OK)</span>
              </div>
              <pre className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30 text-xs font-mono text-emerald-300 overflow-x-auto max-h-48">
                <code>{JSON.stringify(responseLog, null, 2)}</code>
              </pre>
            </div>
          )}

          {/* Local CLI Instructions */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-300">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Stripe CLI Local Forwarding Command</span>
            </div>
            <p className="text-xs text-zinc-400">
              To test webhooks with live events from Stripe Dashboard on your local dev server:
            </p>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <code className="text-xs font-mono text-cyan-300 overflow-x-auto mr-2">
                {cliSnippet}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(cliSnippet);
                  setCopiedCli(true);
                  setTimeout(() => setCopiedCli(false), 2000);
                }}
                className="p-1.5 text-zinc-400 hover:text-white rounded transition-colors shrink-0 cursor-pointer"
              >
                {copiedCli ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
