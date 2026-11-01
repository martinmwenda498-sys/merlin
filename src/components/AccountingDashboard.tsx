import { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Eye, 
  FileSpreadsheet, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { GivingTransaction, OfferingType, ChurchBankAccount } from '../types/church';
import { OFFERING_TYPES } from '../data/defaultData';

interface AccountingDashboardProps {
  transactions: GivingTransaction[];
  bankAccounts: ChurchBankAccount[];
  onOpenReceipt?: (tx: GivingTransaction) => void;
}

export function AccountingDashboard({
  transactions,
  bankAccounts,
  onOpenReceipt,
}: AccountingDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [bankFilter, setBankFilter] = useState<string>('all');
  const [selectedTxForModal, setSelectedTxForModal] = useState<GivingTransaction | null>(null);

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        tx.transactionCode.toLowerCase().includes(query) ||
        tx.donorName.toLowerCase().includes(query) ||
        tx.phoneNumber.includes(query) ||
        (tx.note && tx.note.toLowerCase().includes(query));

      // Type filter
      const matchesType = typeFilter === 'all' || tx.offeringType === typeFilter;

      // Bank filter
      const matchesBank = bankFilter === 'all' || tx.bankAccountId === bankFilter;

      return matchesSearch && matchesType && matchesBank;
    });
  }, [transactions, searchQuery, typeFilter, bankFilter]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalCollected = transactions.reduce((acc, t) => acc + t.amount, 0);
    const tithesTotal = transactions.filter((t) => t.offeringType === 'tithe').reduce((acc, t) => acc + t.amount, 0);
    const buildingTotal = transactions.filter((t) => t.offeringType === 'building_fund').reduce((acc, t) => acc + t.amount, 0);
    const missionsTotal = transactions.filter((t) => t.offeringType === 'missions' || t.offeringType === 'benevolence').reduce((acc, t) => acc + t.amount, 0);
    const offeringsTotal = transactions.filter((t) => t.offeringType === 'offering' || t.offeringType === 'thanksgiving').reduce((acc, t) => acc + t.amount, 0);
    const totalTransactions = transactions.length;

    // Type breakdown for charts
    const breakdown = OFFERING_TYPES.map((type) => {
      const typeTxs = transactions.filter((t) => t.offeringType === type.id);
      const sum = typeTxs.reduce((acc, t) => acc + t.amount, 0);
      const percentage = totalCollected > 0 ? (sum / totalCollected) * 100 : 0;
      return {
        ...type,
        total: sum,
        count: typeTxs.length,
        percentage: Math.round(percentage * 10) / 10,
      };
    }).sort((a, b) => b.total - a.total);

    return {
      totalCollected,
      tithesTotal,
      buildingTotal,
      missionsTotal,
      offeringsTotal,
      totalTransactions,
      breakdown,
    };
  }, [transactions]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Transaction Code', 'Date Time', 'Donor', 'Phone', 'Offering Type', 'Bank Account', 'Amount (KES)', 'Status', 'Notes'];
    const rows = filtered.map((t) => [
      t.transactionCode,
      `"${t.timestamp}"`,
      `"${t.donorName}"`,
      `"${t.phoneNumber}"`,
      `"${t.offeringType}"`,
      `"${t.bankAccountName}"`,
      t.amount,
      t.status,
      `"${t.note || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `grace_sanctuary_giving_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getOfferingBadgeColor = (type: OfferingType) => {
    switch (type) {
      case 'tithe':
        return 'text-amber-800 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60';
      case 'building_fund':
        return 'text-indigo-800 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60';
      case 'missions':
      case 'benevolence':
        return 'text-emerald-800 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60';
      case 'thanksgiving':
        return 'text-rose-800 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60';
      default:
        return 'text-stone-800 bg-stone-100 dark:text-stone-300 dark:bg-stone-800 border-stone-200 dark:border-stone-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Accounting Audit Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-mono">
            Treasury & Stewardship Ledger
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900 dark:text-stone-100 mt-1">
            Giving Accounting & Verification
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
            Real-time reconciliation of M-Pesa STK push donations and direct bank paybill receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="py-2 px-3 text-xs font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-750 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV Ledger</span>
          </button>
          <button
            onClick={() => window.print()}
            className="py-2 px-3 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Financial Audit</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
          <span className="text-xs text-stone-500 uppercase tracking-wider block font-sans">
            Total Reconciled Giving
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 dark:text-stone-100 tabular-nums">
              KES {metrics.totalCollected.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              {metrics.totalTransactions} Gifts
            </span>
          </div>
          <div className="text-[11px] text-stone-500">
            Across {bankAccounts.length} designated church bank accounts
          </div>
        </div>

        {/* Tithes Total */}
        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
          <span className="text-xs text-stone-500 uppercase tracking-wider block font-sans">
            Holy Tithes (10%)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-700 dark:text-amber-400 tabular-nums">
              KES {metrics.tithesTotal.toLocaleString()}
            </span>
            <span className="text-xs text-stone-500 font-mono">
              {metrics.totalCollected > 0 ? Math.round((metrics.tithesTotal / metrics.totalCollected) * 100) : 0}%
            </span>
          </div>
          <div className="text-[11px] text-stone-500">
            Main Sanctuary Operations & Ministry
          </div>
        </div>

        {/* Building & Development Fund */}
        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
          <span className="text-xs text-stone-500 uppercase tracking-wider block font-sans">
            Building & Sanctuary Fund
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-indigo-700 dark:text-indigo-400 tabular-nums">
              KES {metrics.buildingTotal.toLocaleString()}
            </span>
            <span className="text-xs text-stone-500 font-mono">
              {metrics.totalCollected > 0 ? Math.round((metrics.buildingTotal / metrics.totalCollected) * 100) : 0}%
            </span>
          </div>
          <div className="text-[11px] text-stone-500">
            Target KES 1.5M (Phase 1 Education Wing)
          </div>
        </div>

        {/* Benevolence & Missions */}
        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
          <span className="text-xs text-stone-500 uppercase tracking-wider block font-sans">
            Missions & Benevolence
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
              KES {metrics.missionsTotal.toLocaleString()}
            </span>
            <span className="text-xs text-stone-500 font-mono">
              {metrics.totalCollected > 0 ? Math.round((metrics.missionsTotal / metrics.totalCollected) * 100) : 0}%
            </span>
          </div>
          <div className="text-[11px] text-stone-500">
            Food baskets, hospital bills, outreach
          </div>
        </div>
      </div>

      {/* Breakdown Progress Bars */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Giving Stream Allocation Breakdown
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.breakdown.slice(0, 4).map((item) => (
            <div key={item.id} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-700 dark:text-stone-300 font-medium truncate">{item.label}</span>
                <span className="font-mono text-stone-900 dark:text-stone-100 font-bold tabular-nums">
                  KES {item.total.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-amber-600 dark:bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(item.percentage, 3)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-stone-500">
                <span>{item.percentage}% of total</span>
                <span>{item.count} contribution{item.count === 1 ? '' : 's'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by donor name, phone, M-Pesa ID (e.g. SH83DK...)"
            className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Offering Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by offering type"
            className="py-2 px-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
          >
            <option value="all">All Offering Types</option>
            {OFFERING_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>

          {/* Bank Filter */}
          <select
            value={bankFilter}
            onChange={(e) => setBankFilter(e.target.value)}
            aria-label="Filter by church bank account"
            className="py-2 px-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
          >
            <option value="all">All Bank Accounts</option>
            {bankAccounts.map((b) => (
              <option key={b.id} value={b.id}>{b.bankName} ({b.paybillNumber})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4">Receipt / Code</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Donor Details</th>
                <th className="py-3 px-4">Offering Type</th>
                <th className="py-3 px-4">Bank Treasury</th>
                <th className="py-3 px-4 text-right">Amount (KES)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-500">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors">
                    {/* Transaction Code */}
                    <td className="py-3 px-4 font-mono font-semibold text-stone-900 dark:text-stone-100">
                      {tx.transactionCode}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-400 whitespace-nowrap">
                      {tx.timestamp}
                    </td>

                    {/* Donor */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-stone-900 dark:text-stone-100">
                        {tx.donorName}
                      </div>
                      <div className="text-[11px] font-mono text-stone-500">
                        {tx.phoneNumber}
                      </div>
                      {tx.note && (
                        <div className="text-[10px] text-stone-400 italic truncate max-w-[180px]">
                          "{tx.note}"
                        </div>
                      )}
                    </td>

                    {/* Offering Type */}
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${getOfferingBadgeColor(tx.offeringType)}`}>
                        {OFFERING_TYPES.find((o) => o.id === tx.offeringType)?.label || tx.offeringType}
                      </span>
                    </td>

                    {/* Bank Account */}
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-400">
                      <div className="truncate max-w-[150px] font-medium text-stone-800 dark:text-stone-200">
                        {tx.bankAccountName}
                      </div>
                      <span className="text-[10px] text-stone-500 uppercase font-mono">
                        {tx.paymentMethod.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                      {tx.amount.toLocaleString()}.00
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Reconciled</span>
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedTxForModal(tx)}
                        className="py-1 px-2 text-[11px] font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800 rounded hover:bg-stone-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Ledger Footer */}
        <div className="p-3 bg-stone-50 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
          <span>Showing {filtered.length} of {transactions.length} records</span>
          <span className="font-mono">
            Total Selected: KES {filtered.reduce((s, t) => s + t.amount, 0).toLocaleString()}.00
          </span>
        </div>
      </div>

      {/* Transaction Detail View Modal */}
      {selectedTxForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-stone-900 dark:text-stone-100 space-y-4">
            <div className="text-center pb-3 border-b border-stone-200 dark:border-stone-800">
              <span className="text-[11px] uppercase tracking-widest text-amber-700 dark:text-amber-400 font-serif">
                Grace Sanctuary Church • Audit Certificate
              </span>
              <h3 className="text-lg font-serif font-semibold mt-1">Official Giving Receipt</h3>
              <p className="text-xs font-mono text-stone-500 mt-0.5">Code: {selectedTxForModal.transactionCode}</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-500">Donor Name:</span>
                <span className="font-medium text-stone-900 dark:text-stone-100">{selectedTxForModal.donorName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-500">Phone:</span>
                <span className="font-mono text-stone-900 dark:text-stone-100">{selectedTxForModal.phoneNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-500">Offering Type:</span>
                <span className="font-semibold text-amber-800 dark:text-amber-400">
                  {OFFERING_TYPES.find((o) => o.id === selectedTxForModal.offeringType)?.label || selectedTxForModal.offeringType}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-500">Bank Account Credited:</span>
                <span className="text-stone-900 dark:text-stone-100">{selectedTxForModal.bankAccountName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-500">Date & Time:</span>
                <span className="text-stone-900 dark:text-stone-100">{selectedTxForModal.timestamp}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-500">Method:</span>
                <span className="text-stone-900 dark:text-stone-100 uppercase font-mono">{selectedTxForModal.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-500">Status:</span>
                <span className="text-emerald-600 font-semibold uppercase">{selectedTxForModal.status}</span>
              </div>
              {selectedTxForModal.note && (
                <div className="py-1">
                  <span className="text-stone-500 block mb-0.5">Note:</span>
                  <span className="italic text-stone-700 dark:text-stone-300">"{selectedTxForModal.note}"</span>
                </div>
              )}
              <div className="pt-2 flex justify-between items-baseline">
                <span className="text-sm font-semibold">Total Amount</span>
                <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  KES {selectedTxForModal.amount.toLocaleString()}.00
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setSelectedTxForModal(null)}
                className="flex-1 py-2 text-xs font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
