import { useState, useEffect } from 'react';
import { 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Download, 
  Share2, 
  X, 
  Clock, 
  Building2,
  Lock
} from 'lucide-react';
import { GivingTransaction, OfferingType, ChurchBankAccount } from '../types/church';

interface MpesaStkModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  offeringType: OfferingType;
  offeringLabel: string;
  donorName: string;
  phoneNumber: string;
  email?: string;
  note?: string;
  bankAccount: ChurchBankAccount;
  onSuccess: (transaction: GivingTransaction) => void;
}

export function MpesaStkModal({
  isOpen,
  onClose,
  amount,
  offeringLabel,
  offeringType,
  donorName,
  phoneNumber,
  email,
  note,
  bankAccount,
  onSuccess,
}: MpesaStkModalProps) {
  const [step, setStep] = useState<'prompting' | 'pin_input' | 'processing' | 'success' | 'failed'>('prompting');
  const [pin, setPin] = useState('');
  const [timer, setTimer] = useState(60);
  const [completedTx, setCompletedTx] = useState<GivingTransaction | null>(null);
  const [smsNotification, setSmsNotification] = useState<string | null>(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('prompting');
      setPin('');
      setTimer(60);
      setCompletedTx(null);
      setSmsNotification(null);

      // Auto-advance to pin prompt after 1.8 seconds simulation
      const timerId = setTimeout(() => {
        setStep('pin_input');
      }, 1600);
      return () => clearTimeout(timerId);
    }
  }, [isOpen]);

  // Countdown timer during PIN input
  useEffect(() => {
    if (isOpen && step === 'pin_input' && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setStep('failed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, step, timer]);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  const handleCancel = () => {
    onClose();
  };

  const handleAuthorizePin = () => {
    if (pin.length !== 4) return;
    setStep('processing');

    // Simulate Safaricom Daraja API processing & bank account crediting
    setTimeout(() => {
      const randomLetters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const randomSuffix = randomLetters.charAt(Math.floor(Math.random() * randomLetters.length)) +
        randomLetters.charAt(Math.floor(Math.random() * randomLetters.length));
      const code = `SH${randomDigits}${randomSuffix}`;
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      const newTx: GivingTransaction = {
        id: `tx-${Date.now()}`,
        transactionCode: code,
        mpesaReceiptNumber: code,
        donorName: donorName.trim() || 'Church Member',
        phoneNumber: phoneNumber,
        email: email,
        amount: amount,
        offeringType: offeringType,
        bankAccountId: bankAccount.id,
        bankAccountName: `${bankAccount.bankName} (${bankAccount.paybillNumber})`,
        timestamp: `${dateStr} ${timeStr}`,
        status: 'completed',
        note: note,
        paymentMethod: 'mpesa_stk',
      };

      setCompletedTx(newTx);
      setSmsNotification(
        `${code} Confirmed. Ksh ${amount.toLocaleString()}.00 sent to ${bankAccount.accountName.toUpperCase()} for ${offeringLabel} on ${dateStr} at ${timeStr}. M-PESA balance updated.`
      );
      setStep('success');
      onSuccess(newTx);
    }, 2400);
  };

  const formattedPhone = phoneNumber.startsWith('+')
    ? phoneNumber
    : phoneNumber.startsWith('0')
    ? `+254 ${phoneNumber.substring(1)}`
    : `+254 ${phoneNumber}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl text-stone-100 overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
              M
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-stone-400 font-mono">Safaricom M-Pesa Express</p>
              <h3 className="text-sm font-semibold text-stone-100">Secure STK Push Giving</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: Prompting */}
          {step === 'prompting' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse">
                <Smartphone className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-stone-100">Sending M-PESA Prompt</h4>
                <p className="text-sm text-stone-400 mt-1 max-w-xs mx-auto">
                  Connecting to Safaricom Daraja API for <span className="font-mono text-emerald-400 font-medium">{formattedPhone}</span>...
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-800/80 rounded-full text-xs text-stone-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Awaiting STK handset handshake</span>
              </div>
            </div>
          )}

          {/* STEP 2: Phone STK Simulation Prompt & PIN Pad */}
          {step === 'pin_input' && (
            <div className="space-y-4">
              {/* Phone Dialog Frame */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 shadow-inner">
                <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800/80 pb-2 mb-3">
                  <span className="font-mono uppercase text-emerald-400 font-medium">SIM Toolkit Prompt</span>
                  <span className="flex items-center gap-1 font-mono text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{timer}s</span>
                  </span>
                </div>

                <div className="text-sm text-stone-200 leading-relaxed space-y-2">
                  <p>
                    Do you want to pay <strong className="text-emerald-400 font-mono">KES {amount.toLocaleString()}</strong> to{' '}
                    <strong className="text-stone-100">{bankAccount.accountName}</strong>?
                  </p>
                  <p className="text-xs text-stone-400">
                    Paybill: <span className="font-mono text-stone-300">{bankAccount.paybillNumber}</span> · Acc:{' '}
                    <span className="font-mono text-stone-300">{offeringType.toUpperCase()}-{phoneNumber.slice(-4)}</span>
                  </p>
                  <p className="text-xs text-stone-400">
                    Offering: <span className="text-stone-300 font-medium">{offeringLabel}</span>
                  </p>
                </div>

                {/* PIN Display Input */}
                <div className="mt-4 pt-3 border-t border-stone-800/80">
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1.5">
                    Enter M-PESA PIN (4 Digits):
                  </label>
                  <div className="flex items-center justify-center gap-3 py-3 bg-stone-900 border border-stone-700/80 rounded-lg">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className={`w-4 h-4 rounded-full border transition-all ${
                          pin.length > index
                            ? 'bg-emerald-400 border-emerald-400 scale-110 shadow-sm shadow-emerald-500/50'
                            : 'border-stone-600 bg-stone-800'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-stone-500 text-center mt-1.5">
                    Your PIN is encrypted and sent directly to Safaricom network
                  </p>
                </div>
              </div>

              {/* Number Keypad */}
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleKeyPress(digit)}
                    className="h-11 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-stone-600 font-mono text-lg font-medium text-stone-100 transition-colors shadow-sm flex items-center justify-center"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  onClick={handleClear}
                  className="h-11 rounded-lg bg-stone-800/60 hover:bg-stone-700/60 text-xs text-stone-400 uppercase tracking-wider transition-colors font-medium flex items-center justify-center"
                >
                  Clear
                </button>
                <button
                  onClick={() => handleKeyPress('0')}
                  className="h-11 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-stone-600 font-mono text-lg font-medium text-stone-100 transition-colors shadow-sm flex items-center justify-center"
                >
                  0
                </button>
                <button
                  onClick={handleBackspace}
                  className="h-11 rounded-lg bg-stone-800/60 hover:bg-stone-700/60 text-xs text-stone-400 uppercase tracking-wider transition-colors font-medium flex items-center justify-center"
                >
                  Del
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2.5 px-4 text-xs font-medium text-stone-400 hover:text-stone-200 bg-stone-800 hover:bg-stone-750 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAuthorizePin}
                  disabled={pin.length !== 4}
                  className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    pin.length === 4
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 cursor-pointer'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize Ksh {amount.toLocaleString()}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Processing */}
          {step === 'processing' && (
            <div className="py-10 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                <ShieldCheck className="w-7 h-7 text-emerald-400 absolute inset-0 m-auto" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-stone-100">Securing Giving Transaction</h4>
                <p className="text-sm text-stone-400 mt-1 max-w-sm mx-auto">
                  Authorizing M-PESA debit and crediting {bankAccount.bankName} church treasury...
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Official Church Giving Certificate */}
          {step === 'success' && completedTx && (
            <div className="space-y-5">
              {/* Safaricom SMS Simulation Ribbon */}
              {smsNotification && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl flex items-start gap-3">
                  <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-emerald-200/90 leading-relaxed font-mono">
                    <p className="font-semibold text-emerald-300 mb-0.5 uppercase tracking-wide">
                      Safaricom M-Pesa SMS Confirmation
                    </p>
                    <p>{smsNotification}</p>
                  </div>
                </div>
              )}

              {/* Church Official Receipt Box */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 space-y-4 print:bg-white print:text-black">
                <div className="text-center pb-4 border-b border-stone-800">
                  <span className="text-[11px] uppercase tracking-widest text-amber-400/90 font-serif">
                    Grace Sanctuary Church • Official E-Receipt
                  </span>
                  <h4 className="text-xl font-serif font-semibold text-stone-100 mt-1">
                    Tithes & Offerings Certificate
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    "God loves a cheerful giver" — 2 Corinthians 9:7
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-500 block">Receipt / M-Pesa ID</span>
                    <span className="font-mono text-stone-200 font-semibold">{completedTx.transactionCode}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Date & Time</span>
                    <span className="text-stone-200">{completedTx.timestamp}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Donor Name</span>
                    <span className="text-stone-200 font-medium">{completedTx.donorName}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Phone</span>
                    <span className="text-stone-200 font-mono">{formattedPhone}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Offering Designated</span>
                    <span className="text-emerald-400 font-semibold">{offeringLabel}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Credited Bank Account</span>
                    <span className="text-stone-200">{bankAccount.bankName} (Paybill {bankAccount.paybillNumber})</span>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-900/90 rounded-lg flex items-center justify-between border border-stone-800">
                  <div>
                    <span className="text-xs text-stone-400 uppercase tracking-wider block">Total Amount Received</span>
                    <span className="text-xs text-stone-500">{bankAccount.accountName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      KES {completedTx.amount.toLocaleString()}.00
                    </span>
                    <span className="text-[11px] text-emerald-500/80 block">Verified & Reconciled</span>
                  </div>
                </div>

                {note && (
                  <div className="text-xs text-stone-400 italic bg-stone-900/40 p-2.5 rounded border border-stone-800/60">
                    <span className="font-semibold text-stone-300 not-italic">Note / Prayer:</span> "{note}"
                  </div>
                )}

                <div className="pt-2 text-center text-[11px] text-stone-500">
                  This transaction has been logged in the Grace Sanctuary Church Accounting Ledger. A copy has been saved for church records.
                </div>
              </div>

              {/* Post-giving Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => window.print()}
                  className="flex-1 min-w-[130px] py-2 px-3 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => {
                    const text = `Grace Sanctuary Church Receipt: ${completedTx.transactionCode} | KES ${completedTx.amount} for ${offeringLabel}. God bless your cheerful giving!`;
                    navigator.clipboard.writeText(text);
                    alert('Receipt details copied to clipboard!');
                  }}
                  className="flex-1 min-w-[130px] py-2 px-3 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy Receipt</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors text-center"
                >
                  Done & Return to Giving Portal
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Timeout / Failed */}
          {step === 'failed' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-stone-100">STK Push Timed Out</h4>
                <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                  The M-PESA authorization prompt was not completed within 60 seconds. No funds have been deducted from your phone.
                </p>
              </div>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setStep('pin_input');
                    setPin('');
                    setTimer(60);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
