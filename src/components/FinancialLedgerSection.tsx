import React, { useState, useEffect } from 'react';
import { DollarSign, Download, ArrowUpRight, ArrowDownLeft, FileText, CheckCircle2 } from 'lucide-react';

interface LedgerEntry {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  status: 'settled' | 'pending';
}

export const FinancialLedgerSection: React.FC = () => {
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, netBalance: 0 });
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  useEffect(() => {
    fetch('/api/ledger')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLedger(data.ledger || []);
          setSummary(data.summary || { totalIncome: 0, totalExpenses: 0, netBalance: 0 });
        }
      })
      .catch((err) => console.error('Failed to load ledger:', err));
  }, []);

  const filteredEntries = ledger.filter((entry) => {
    if (filter === 'income') return entry.type === 'income';
    if (filter === 'expense') return entry.type === 'expense';
    return true;
  });

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount (USD)', 'Status'];
    const rows = ledger.map((e) => [
      e.date,
      e.type,
      `"${e.category}"`,
      `"${e.description.replace(/"/g, '""')}"`,
      e.amount,
      e.status,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `amonomics_sustainability_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="public-ledger" className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Collective Transparency</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Public Accounting &amp; Expense Ledger
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            Complete, verifiable records of every community dollar received and disbursed toward CI test matrixes, security audits, and maintainer stipends.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
            Total Pledges In
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              ${summary.totalIncome.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-400">verified Stripe receipts</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
            Total Disbursements Out
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-rose-400 font-mono">
              ${summary.totalExpenses.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-400">compute &amp; triage</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
            Sustainability Net Runway
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-cyan-400 font-mono">
              ${summary.netBalance.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-400">reserve buffer</span>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden divide-y divide-zinc-800/80">
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/70 text-xs font-mono text-zinc-400">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-1 rounded cursor-pointer ${filter === 'all' ? 'bg-zinc-800 text-white' : 'hover:text-zinc-200'}`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setFilter('income')}
              className={`px-2 py-1 rounded cursor-pointer ${filter === 'income' ? 'bg-zinc-800 text-emerald-400' : 'hover:text-zinc-200'}`}
            >
              Income
            </button>
            <button
              onClick={() => setFilter('expense')}
              className={`px-2 py-1 rounded cursor-pointer ${filter === 'expense' ? 'bg-zinc-800 text-rose-400' : 'hover:text-zinc-200'}`}
            >
              Expenses
            </button>
          </div>
          <span className="text-[11px] text-zinc-500">100% On-Record</span>
        </div>

        <div className="divide-y divide-zinc-800/60 max-h-72 overflow-y-auto">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-zinc-900/40 transition-colors text-xs"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    entry.type === 'income'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {entry.type === 'income' ? (
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white">{entry.category}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{entry.date}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{entry.description}</p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-mono font-bold ${
                    entry.type === 'income' ? 'text-emerald-400' : 'text-zinc-300'
                  }`}
                >
                  {entry.type === 'income' ? '+' : '-'}${entry.amount}
                </span>
                <span className="text-[10px] text-zinc-500 block font-mono">
                  {entry.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
