import { useState } from 'react';
import { 
  Building2, 
  Smartphone, 
  CreditCard, 
  Check, 
  Copy, 
  Heart, 
  Info, 
  Lock, 
  ShieldCheck, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { OfferingType, ChurchBankAccount, GivingTransaction } from '../types/church';
import { OFFERING_TYPES } from '../data/defaultData';
import { MpesaStkModal } from './MpesaStkModal';

interface GivingPortalProps {
  bankAccounts: ChurchBankAccount[];
  onNewTransaction: (tx: GivingTransaction) => void;
  onNavigateToAccounting?: () => void;
}

export function GivingPortal({ 
  bankAccounts, 
  onNewTransaction, 
  onNavigateToAccounting 
}: GivingPortalProps) {
  const [selectedOffering, setSelectedOffering] = useState<OfferingType>('tithe');
  const [selectedBankId, setSelectedBankId] = useState<string>(bankAccounts[0]?.id || 'acc-kcb-main');
  const [amount, setAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>('2500');
  const [phoneNumber, setPhoneNumber] = useState<string>('0712345678');
  const [donorName, setDonorName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);
  const [isStkModalOpen, setIsStkModalOpen] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const selectedOfferingInfo = OFFERING_TYPES.find((o) => o.id === selectedOffering) || OFFERING_TYPES[0];
  const selectedBank = bankAccounts.find((b) => b.id === selectedBankId) || bankAccounts[0];

  const quickAmounts = [500, 1000, 2500, 5000, 10000, 25000];

  const handleAmountChip = (val: number) => {
    setAmount(val);
    setCustomAmount(val.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    const parsed = parseInt(val, 10);
    setAmount(isNaN(parsed) ? 0 : parsed);
  };

  const handleCopyDetails = (bank: ChurchBankAccount) => {
    const text = `Grace Sanctuary Church Banking Details:\nBank: ${bank.bankName}\nPaybill: ${bank.paybillNumber}\nAccount No: ${bank.accountNumber}\nAccount Name: ${bank.accountName}\nBranch: ${bank.branch}`;
    navigator.clipboard.writeText(text);
    setCopiedBankId(bank.id);
    setTimeout(() => setCopiedBankId(null), 2500);
  };

  const validateAndTriggerStk = () => {
    // Validate phone number
    const cleanPhone = phoneNumber.trim().replace(/\s+/g, '');
    const kenyaPhoneRegex = /^(?:\+254|0)?([17]\d{8})$/;
    if (!kenyaPhoneRegex.test(cleanPhone)) {
      setPhoneError('Please enter a valid Safaricom/Kenyan phone number (e.g. 0712345678 or 0110123456)');
      return;
    }
    setPhoneError(null);

    if (amount < 10) {
      alert('Minimum giving amount is KES 10.');
      return;
    }

    setIsStkModalOpen(true);
  };

  const handleTransactionSuccess = (tx: GivingTransaction) => {
    onNewTransaction(tx);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Title & Editorial Framing */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-serif">
          Stewardship & Covenant Partnership
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-stone-900 dark:text-stone-100 mt-2 tracking-tight">
          Tithes & Offerings Sanctuary
        </h1>
        <p className="text-stone-600 dark:text-stone-400 mt-3 text-base sm:text-lg leading-relaxed">
          Honoring God with our substance, sustaining kingdom ministries, church building development, and benevolent outreach to those in need.
        </p>

        {/* Biblical Promise Quote */}
        <div className="mt-5 p-4 rounded-xl bg-amber-50/60 dark:bg-stone-900/60 border border-amber-200/60 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-xs sm:text-sm font-serif italic max-w-2xl mx-auto">
          {selectedOfferingInfo.scriptureReference}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: The Giving Interactive Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-7">
          
          {/* 1. Offering Designation */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                1. Specify Offering Category
              </label>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                For accounting & ministry tracking
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {OFFERING_TYPES.map((type) => {
                const isSelected = selectedOffering === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setSelectedOffering(type.id);
                      if (type.suggestedAccount) {
                        setSelectedBankId(type.suggestedAccount);
                      }
                    }}
                    className={`py-2.5 px-3 rounded-lg text-xs font-medium text-left transition-all border ${
                      isSelected
                        ? 'bg-amber-900/10 dark:bg-amber-400/10 border-amber-800 dark:border-amber-400 text-amber-900 dark:text-amber-300 font-semibold shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="truncate">{type.label}</div>
                  </button>
                );
              })}
            </div>

            <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
              {selectedOfferingInfo.description}
            </p>
          </div>

          {/* 2. Amount Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                2. Giving Amount (KES)
              </label>
              <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                Kenyan Shillings
              </span>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {quickAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleAmountChip(val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                    amount === val && customAmount === val.toString()
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  KES {val.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Amount input */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-stone-500 font-mono">
                KES
              </span>
              <input
                type="text"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Enter custom amount"
                className="w-full pl-14 pr-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-xl font-mono text-lg font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          {/* 3. Church Bank Account Destination */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                3. Dedicated Church Bank Treasury
              </label>
              <span className="text-xs text-stone-500">
                Linked verified Paybill accounts
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {bankAccounts.map((bank) => {
                const isSelected = selectedBankId === bank.id;
                return (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => setSelectedBankId(bank.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {bank.bankName}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                    </div>
                    <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 mt-1">
                      Paybill: <span className="font-semibold text-stone-800 dark:text-stone-200">{bank.paybillNumber}</span>
                    </div>
                    <div className="text-[10px] text-stone-500 truncate mt-0.5">
                      {bank.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Donor & Phone Information */}
          <div className="space-y-4 pt-1 border-t border-stone-200 dark:border-stone-800">
            <div>
              <label className="block text-sm font-semibold text-stone-900 dark:text-stone-100 mb-1.5">
                4. Your M-Pesa Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-stone-400 font-mono">
                  🇰🇪
                </span>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setPhoneError(null);
                  }}
                  placeholder="0712 345 678 or 0110 123 456"
                  className={`w-full pl-11 pr-4 py-2.5 bg-stone-50 dark:bg-stone-950 border rounded-xl font-mono text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                    phoneError ? 'border-red-500 ring-1 ring-red-500' : 'border-stone-200 dark:border-stone-700'
                  }`}
                />
              </div>
              {phoneError && (
                <p className="mt-1 text-xs text-red-500">{phoneError}</p>
              )}
              <p className="mt-1 text-xs text-stone-500">
                A Safaricom STK prompt will appear on this handset asking for your 4-digit M-Pesa PIN.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Full Name (Optional for receipt)
                </label>
                <input
                  type="text"
                  disabled={isAnonymous}
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder={isAnonymous ? 'Giving Anonymously' : 'e.g. Deaconess Grace / Martin'}
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Email for E-Statement (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. martin@gmail.com"
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Prayer Request or Dedication Note (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Thanksgiving for business breakthrough, or Tithe for October"
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="anonymous-give"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
              />
              <label htmlFor="anonymous-give" className="text-xs text-stone-600 dark:text-stone-400 select-none">
                Give anonymously (ledger will log as "Anonymous Believer" for privacy)
              </label>
            </div>
          </div>

          {/* Primary CTA Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={validateAndTriggerStk}
              className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Smartphone className="w-5 h-5 text-emerald-200" />
              <span>Send M-Pesa STK Push (KES {amount.toLocaleString()})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-[11px] text-stone-500 dark:text-stone-400 mt-2 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Encrypted 256-bit SSL Safaricom Daraja API • Instant Bank Credit</span>
            </p>
          </div>
        </div>

        {/* Right Col: Church Bank Direct Details & Financial Transparency (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Summary Card */}
          <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 border border-stone-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                Offering Breakdown
              </span>
              <span className="text-xs text-stone-400">Audited Treasury</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-400">Designation</span>
                <span className="font-semibold text-stone-100">{selectedOfferingInfo.label}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-400">Church Bank</span>
                <span className="text-stone-200 font-mono text-xs">{selectedBank.bankName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-400">Paybill Number</span>
                <span className="font-mono text-emerald-400 font-bold">{selectedBank.paybillNumber}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-400">Account Reference</span>
                <span className="font-mono text-stone-200 text-xs">{selectedOffering.toUpperCase()}-{phoneNumber.slice(-4) || 'GIFT'}</span>
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-between items-baseline">
                <span className="text-stone-300 font-medium text-sm">Contribution</span>
                <span className="text-2xl font-bold font-mono text-amber-400">
                  KES {amount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 text-xs text-stone-400 leading-relaxed">
              Upon clicking the button, your phone will wake with the Safaricom PIN dialog. Once verified, you will immediately receive an official church electronic receipt and tax certificate.
            </div>
          </div>

          {/* Church Bank Paybill Reference Cards for Direct Manual Payment */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  Manual Bank Paybills
                </h3>
              </div>
              <span className="text-[11px] text-stone-500">Copy to M-Pesa</span>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              If you prefer paying manually from your Safaricom menu, use the verified church banking coordinates below:
            </p>

            <div className="space-y-3">
              {bankAccounts.map((acc) => (
                <div 
                  key={acc.id}
                  className="p-3.5 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                      {acc.bankName}
                    </span>
                    <button
                      onClick={() => handleCopyDetails(acc)}
                      className="text-xs text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      {copiedBankId === acc.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-stone-500 text-[10px] block">Paybill Number</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{acc.paybillNumber}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] block">Account Number</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200 truncate block">{acc.accountNumber}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-stone-500 truncate">
                    Account Name: <span className="text-stone-700 dark:text-stone-300 font-medium">{acc.accountName}</span>
                  </div>
                </div>
              ))}
            </div>

            {onNavigateToAccounting && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onNavigateToAccounting}
                  className="w-full py-2.5 px-4 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Church Giving Accounting Ledger & Transparency</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* M-Pesa STK Push PIN Prompt Modal */}
      <MpesaStkModal
        isOpen={isStkModalOpen}
        onClose={() => setIsStkModalOpen(false)}
        amount={amount}
        offeringType={selectedOffering}
        offeringLabel={selectedOfferingInfo.label}
        donorName={isAnonymous ? 'Anonymous Believer' : (donorName.trim() || 'Church Member')}
        phoneNumber={phoneNumber}
        email={email}
        note={note}
        bankAccount={selectedBank}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
}
