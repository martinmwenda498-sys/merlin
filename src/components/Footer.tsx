import { Building2, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { ChurchBankAccount } from '../types/church';

interface FooterProps {
  bankAccounts: ChurchBankAccount[];
  onNavigate: (view: 'home' | 'sermons' | 'programs' | 'giving' | 'gallery' | 'prayer' | 'admin') => void;
}

export function Footer({ bankAccounts, onNavigate }: FooterProps) {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800/80 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Church Wordmark & Vision */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-stone-100">
              Grace Sanctuary Church
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              A Christ-centered spiritual home anchored in biblical truth, joyful worship, unshakeable faith, and genuine love for our community and nation.
            </p>
            <div className="text-xs text-stone-500 font-serif italic pt-1">
              "To know Christ and to make Him known."
            </div>
          </div>

          {/* Col 2: Service Times & Location */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-stone-100 uppercase tracking-wider font-mono text-[11px] text-amber-400">
              Service Schedules
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <strong className="text-stone-200">Sunday 1st Service:</strong> 08:00 AM – 10:00 AM
              </li>
              <li>
                <strong className="text-stone-200">Sunday 2nd Service:</strong> 10:30 AM – 01:00 PM
              </li>
              <li>
                <strong className="text-stone-200">Wednesday Midweek:</strong> 05:30 PM – 07:00 PM
              </li>
              <li>
                <strong className="text-stone-200">Friday Youth Kesha:</strong> 08:00 PM – 11:30 PM
              </li>
            </ul>
            <div className="pt-2 text-stone-400 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
              <span>Cathedral Way, Off Uhuru Highway, Nairobi, Kenya</span>
            </div>
          </div>

          {/* Col 3: Church Bank Giving Accounts */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-stone-100 uppercase tracking-wider font-mono text-[11px] text-amber-400">
              Verified Giving Accounts
            </h4>
            <div className="space-y-2 text-stone-400">
              {bankAccounts.map((b) => (
                <div key={b.id} className="p-2 rounded bg-stone-900 border border-stone-800/80">
                  <div className="text-[11px] font-semibold text-stone-200">{b.bankName}</div>
                  <div className="font-mono text-[10px] text-emerald-400">
                    Paybill: {b.paybillNumber} · Acc: {b.accountNumber}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Quick Navigation & Admin Access */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-stone-100 uppercase tracking-wider font-mono text-[11px] text-amber-400">
              Quick Portals
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('giving')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  M-Pesa STK Push Tithes & Offerings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sermons')}
                  className="hover:text-stone-100 transition-colors"
                >
                  Sermon Library & Study Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('programs')}
                  className="hover:text-stone-100 transition-colors"
                >
                  Church Events & Revival Schedules
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-stone-100 transition-colors"
                >
                  Church Gatherings Photo Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('prayer')}
                  className="hover:text-stone-100 transition-colors"
                >
                  Prayer Petitions & Pastoral Care
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-amber-400 hover:underline font-semibold"
                >
                  Church Admin & Accounting Login
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Grace Sanctuary Church. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-[11px]">
            <span>Empowered by faith and community generosity</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
