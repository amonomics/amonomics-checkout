import React, { useState } from 'react';
import { X, Building2, FileText, CheckCircle2, ArrowRight, Loader2, Download, Printer } from 'lucide-react';

interface CorporateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CorporateInvoiceModal: React.FC<CorporateInvoiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [companyName, setCompanyName] = useState('Acme Enterprises, Inc.');
  const [billingEmail, setBillingEmail] = useState('ap@acme.com');
  const [taxId, setTaxId] = useState('US-EIN 12-3456789');
  const [poNumber, setPoNumber] = useState('PO-2026-8841');
  const [tierTitle, setTierTitle] = useState('Enterprise Guardian 🛡️ ($150/mo)');
  const [amount, setAmount] = useState('1800'); // Annualized $150 * 12
  const [billingInterval, setBillingInterval] = useState('annually');
  const [billingAddress, setBillingAddress] = useState('100 Market St, Suite 400, San Francisco, CA 94105');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<any>(null);

  if (!isOpen) return null;

  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/corporate-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          billingEmail,
          taxId,
          poNumber,
          tierTitle,
          amount,
          billingInterval,
          billingAddress,
        }),
      });

      const data = await res.json();
      if (data.success && data.invoice) {
        setGeneratedInvoice(data.invoice);
      }
    } catch (err) {
      console.error('Invoice creation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden my-8">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 -z-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Corporate Invoicing &amp; PO Procurement (Net-30)
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
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Request Corporate Sponsorship Invoice
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              For teams requiring formal W-9 compliance, VAT/tax deductions, Purchase Orders, and wire/ACH payment terms.
            </p>
          </div>

          {!generatedInvoice ? (
            <form onSubmit={handleGenerateInvoice} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Company Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-zinc-950 text-xs text-white border border-zinc-800 rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Accounts Payable Email
                  </label>
                  <input
                    type="email"
                    required
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    className="w-full bg-zinc-950 text-xs text-white border border-zinc-800 rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Tax ID / VAT / US-EIN
                  </label>
                  <input
                    type="text"
                    required
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full bg-zinc-950 text-xs text-white font-mono border border-zinc-800 rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Purchase Order (PO) Number
                  </label>
                  <input
                    type="text"
                    required
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    className="w-full bg-zinc-950 text-xs text-white font-mono border border-zinc-800 rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Sponsorship Tier
                  </label>
                  <select
                    value={tierTitle}
                    onChange={(e) => {
                      setTierTitle(e.target.value);
                      if (e.target.value.includes('150')) setAmount('1800');
                      if (e.target.value.includes('50')) setAmount('600');
                    }}
                    className="w-full bg-zinc-950 text-xs text-zinc-200 border border-zinc-800 rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Enterprise Guardian 🛡️ ($150/mo)">Enterprise Guardian ($1,800/yr)</option>
                    <option value="CI Infrastructure Pillar ⚡ ($50/mo)">CI Infrastructure Pillar ($600/yr)</option>
                    <option value="Custom Foundation Partner ($500/mo)">Custom Foundation Partner ($6,000/yr)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Total Amount (USD)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-zinc-950 text-xs text-white font-mono font-bold border border-zinc-800 rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Billing Physical Address
                </label>
                <textarea
                  rows={2}
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  className="w-full bg-zinc-950 text-xs text-white border border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-zinc-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Stripe Corporate Invoice...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Issue Net-30 Corporate Invoice</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 rounded-xl bg-zinc-950 border border-emerald-500/40 space-y-5 animate-fade-in">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Invoice Issued &amp; Ready for Accounts Payable</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                <div>
                  <span className="text-zinc-500 block">Invoice Number:</span>
                  <span className="text-white font-bold">{generatedInvoice.id}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">PO Number:</span>
                  <span className="text-white font-bold">{generatedInvoice.poNumber}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Total Due:</span>
                  <span className="text-emerald-400 font-bold text-base">
                    ${generatedInvoice.amount} USD
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Payment Terms:</span>
                  <span className="text-white font-bold">Net-30 (Due {generatedInvoice.dueDate})</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                A formal tax-deductible invoice copy has been dispatched to{' '}
                <strong className="text-white">{generatedInvoice.billingEmail}</strong> with ACH/wire transfer coordinates.
              </p>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-zinc-950 text-center transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
