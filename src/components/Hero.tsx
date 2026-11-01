import { 
  ArrowRight, 
  Play, 
  Smartphone, 
  Calendar, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Heart,
  Sparkles,
  Users
} from 'lucide-react';
import { Sermon, ChurchEvent, GivingTransaction } from '../types/church';

interface HeroProps {
  latestSermon: Sermon | undefined;
  nextEvent: ChurchEvent | undefined;
  onNavigate: (view: 'home' | 'sermons' | 'programs' | 'giving' | 'gallery' | 'prayer' | 'admin') => void;
  recentTransactionsCount: number;
}

export function Hero({ latestSermon, nextEvent, onNavigate, recentTransactionsCount }: HeroProps) {
  return (
    <div className="space-y-12">
      {/* Operational Utility Ribbon (§3 Pattern A) */}
      <div className="bg-stone-900 text-stone-200 text-xs py-2.5 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Sunday Celebration: 8:00 AM & 10:30 AM</span>
            </span>
            <span className="text-stone-600 hidden sm:inline">|</span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Cathedral Way, Nairobi</span>
            </span>
            <span className="text-stone-600 hidden md:inline">|</span>
            <span className="text-emerald-400 hidden md:inline">
              M-Pesa STK Push Instant Tithes & Offering Active
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={() => onNavigate('prayer')}
              className="text-stone-300 hover:text-white underline underline-offset-2 transition-colors"
            >
              Need Prayer?
            </button>
            <span className="text-stone-600">·</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-stone-400 hover:text-amber-400 transition-colors"
            >
              Pastoral Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Hero Marquee Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-stone-950 border border-stone-800 shadow-xl min-h-[500px] flex items-center">
          
          {/* Architectural Background Photography with Fallback */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1920&q=80"
              alt="Grace Sanctuary Church Sanctuary"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-35 scale-105"
            />
            {/* Measured Scrim Overlay for WCAG AA 4.5:1 Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-950/40" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-3xl p-6 sm:p-12 lg:p-16 space-y-6 text-stone-100">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs text-amber-400 font-serif">
              <span>A House of Prayer, Healing & Covenant Grace</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-medium leading-[1.15] text-stone-100 tracking-tight">
              A Christ-Centered Sanctuary for All Generations
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-stone-300 max-w-2xl leading-relaxed">
              Welcome to Grace Sanctuary Church. We are a family devoted to authentic biblical discipleship, fervent prayer, joyful worship, and practical community benevolence across Nairobi and beyond.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('giving')}
                className="py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-950/50 flex items-center gap-2.5 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-emerald-200" />
                <span>Give Tithes & Offering (M-Pesa)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('sermons')}
                className="py-3.5 px-6 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-100 border border-stone-700 font-medium text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer backdrop-blur-sm"
              >
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Watch Latest Sermon</span>
              </button>
            </div>

            {/* Quick Proof Strip */}
            <div className="pt-6 border-t border-stone-800/80 grid grid-cols-3 gap-4 max-w-md text-xs">
              <div>
                <span className="block font-mono text-lg font-bold text-amber-400">2</span>
                <span className="text-stone-400 text-[11px]">Sunday Services</span>
              </div>
              <div>
                <span className="block font-mono text-lg font-bold text-amber-400">100%</span>
                <span className="text-stone-400 text-[11px]">Audited Giving</span>
              </div>
              <div>
                <span className="block font-mono text-lg font-bold text-amber-400">{recentTransactionsCount}+</span>
                <span className="text-stone-400 text-[11px]">Community Gifts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Featured Action Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Tithes & Offerings Direct Giving */}
          <div 
            onClick={() => onNavigate('giving')}
            className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                Direct M-Pesa STK Push
              </span>
              <h3 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                Tithes, Offerings & Building Fund
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Enter your phone number to receive a secure instant Safaricom PIN prompt on your handset, linked to verified church bank accounts.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span>Give Securely Now</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Latest Anointed Message */}
          <div 
            onClick={() => onNavigate('sermons')}
            className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <Play className="w-5 h-5 fill-amber-700 dark:fill-amber-400" />
              </div>
              <span className="text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-mono font-semibold">
                Latest Anointed Message
              </span>
              <h3 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                {latestSermon ? latestSermon.title : 'The Unshakeable Covenant of Grace'}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                By {latestSermon?.preacher || 'Senior Pastor David Mwenda'} · {latestSermon?.scripture || 'Hebrews 12:28'}. Listen to audio podcast or download scripture outline notes.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <span>Listen to Sermon</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Upcoming Church Event */}
          <div 
            onClick={() => onNavigate('programs')}
            className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-400 font-mono font-semibold">
                Next Church Gathering
              </span>
              <h3 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                {nextEvent ? nextEvent.title : 'Annual Kingdom Revival 2026'}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {nextEvent?.date} · {nextEvent?.time} at {nextEvent?.location || 'Sanctuary Main Auditorium'}. Reserve your seat and RSVP online.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
              <span>View Programs & RSVP</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
