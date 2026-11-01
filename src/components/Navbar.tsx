import { AdminUser } from '../types/church';
import { ShieldCheck, User } from 'lucide-react';

interface NavbarProps {
  activeView: 'home' | 'sermons' | 'programs' | 'giving' | 'gallery' | 'prayer' | 'admin';
  setActiveView: (view: 'home' | 'sermons' | 'programs' | 'giving' | 'gallery' | 'prayer' | 'admin') => void;
  currentAdmin: AdminUser | null;
}

export function Navbar({ activeView, setActiveView, currentAdmin }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        
        {/* Zone 1: Brand title, one line, wordmark in display face */}
        <button
          onClick={() => setActiveView('home')}
          className="text-lg sm:text-xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100 hover:text-amber-800 dark:hover:text-amber-400 whitespace-nowrap shrink-0 transition-colors cursor-pointer text-left"
        >
          Grace Sanctuary Church
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-300">
          <button
            onClick={() => setActiveView('sermons')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'sermons'
                ? 'text-amber-800 dark:text-amber-400 font-semibold underline underline-offset-4 decoration-amber-500'
                : 'hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Sermons & Media
          </button>
          <button
            onClick={() => setActiveView('programs')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'programs'
                ? 'text-amber-800 dark:text-amber-400 font-semibold underline underline-offset-4 decoration-amber-500'
                : 'hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Programs & Events
          </button>
          <button
            onClick={() => setActiveView('giving')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'giving'
                ? 'text-amber-800 dark:text-amber-400 font-semibold underline underline-offset-4 decoration-amber-500'
                : 'hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Tithes & Offerings
          </button>
          <button
            onClick={() => setActiveView('gallery')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'gallery'
                ? 'text-amber-800 dark:text-amber-400 font-semibold underline underline-offset-4 decoration-amber-500'
                : 'hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Photo Gallery
          </button>
          <button
            onClick={() => setActiveView('prayer')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'prayer'
                ? 'text-amber-800 dark:text-amber-400 font-semibold underline underline-offset-4 decoration-amber-500'
                : 'hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Prayer Wall
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {currentAdmin ? (
            <button
              onClick={() => setActiveView('admin')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin: {currentAdmin.name.split(' ')[0]}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('admin')}
                className="py-1.5 px-2.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 hidden sm:inline-flex items-center gap-1"
              >
                <User className="w-3 h-3" />
                <span>Admin Login</span>
              </button>
              <button
                onClick={() => setActiveView('giving')}
                className="py-2 px-3.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
              >
                Give Tithes & Offering
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav rail */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-stone-200 dark:border-stone-800 text-[11px] font-medium text-stone-600 dark:text-stone-400">
        <button
          onClick={() => setActiveView('home')}
          className={`py-1 px-2 ${activeView === 'home' ? 'text-amber-700 dark:text-amber-400 font-bold' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveView('sermons')}
          className={`py-1 px-2 ${activeView === 'sermons' ? 'text-amber-700 dark:text-amber-400 font-bold' : ''}`}
        >
          Sermons
        </button>
        <button
          onClick={() => setActiveView('programs')}
          className={`py-1 px-2 ${activeView === 'programs' ? 'text-amber-700 dark:text-amber-400 font-bold' : ''}`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveView('giving')}
          className={`py-1 px-2 ${activeView === 'giving' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''}`}
        >
          Giving
        </button>
        <button
          onClick={() => setActiveView('gallery')}
          className={`py-1 px-2 ${activeView === 'gallery' ? 'text-amber-700 dark:text-amber-400 font-bold' : ''}`}
        >
          Gallery
        </button>
        <button
          onClick={() => setActiveView('admin')}
          className={`py-1 px-2 ${activeView === 'admin' ? 'text-amber-700 dark:text-amber-400 font-bold' : ''}`}
        >
          Admin
        </button>
      </div>
    </header>
  );
}
