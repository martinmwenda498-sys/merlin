/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ChurchStorage } from './utils/storage';
import { 
  ChurchProgram, 
  ChurchEvent, 
  Sermon, 
  GalleryPhoto, 
  GivingTransaction, 
  ChurchBankAccount, 
  PrayerRequest, 
  AdminUser 
} from './types/church';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { GivingPortal } from './components/GivingPortal';
import { GalleryView } from './components/GalleryView';
import { SermonView } from './components/SermonView';
import { ProgramsView } from './components/ProgramsView';
import { PrayerWall } from './components/PrayerWall';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'sermons' | 'programs' | 'giving' | 'gallery' | 'prayer' | 'admin'>('home');

  // Persistent States
  const [programs, setPrograms] = useState<ChurchProgram[]>(() => ChurchStorage.getPrograms());
  const [events, setEvents] = useState<ChurchEvent[]>(() => ChurchStorage.getEvents());
  const [sermons, setSermons] = useState<Sermon[]>(() => ChurchStorage.getSermons());
  const [photos, setPhotos] = useState<GalleryPhoto[]>(() => ChurchStorage.getGallery());
  const [transactions, setTransactions] = useState<GivingTransaction[]>(() => ChurchStorage.getTransactions());
  const [bankAccounts, setBankAccounts] = useState<ChurchBankAccount[]>(() => ChurchStorage.getBankAccounts());
  const [prayers, setPrayers] = useState<PrayerRequest[]>(() => ChurchStorage.getPrayers());
  const [admins, setAdmins] = useState<AdminUser[]>(() => ChurchStorage.getAdmins());
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => ChurchStorage.getCurrentAdmin());

  // Toast / Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Sync to localStorage
  useEffect(() => {
    ChurchStorage.savePrograms(programs);
  }, [programs]);

  useEffect(() => {
    ChurchStorage.saveEvents(events);
  }, [events]);

  useEffect(() => {
    ChurchStorage.saveSermons(sermons);
  }, [sermons]);

  useEffect(() => {
    ChurchStorage.saveGallery(photos);
  }, [photos]);

  useEffect(() => {
    ChurchStorage.saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    ChurchStorage.savePrayers(prayers);
  }, [prayers]);

  useEffect(() => {
    ChurchStorage.saveAdmins(admins);
  }, [admins]);

  useEffect(() => {
    ChurchStorage.setCurrentAdmin(currentAdmin);
  }, [currentAdmin]);

  // Handlers
  const handleNewTransaction = (tx: GivingTransaction) => {
    setTransactions((prev) => [tx, ...prev]);
    showToast(`Payment Confirmed! Receipt #${tx.transactionCode} for KES ${tx.amount.toLocaleString()} received.`);
  };

  const handleUploadPhoto = (photo: GalleryPhoto) => {
    setPhotos((prev) => [photo, ...prev]);
    showToast(`"${photo.title}" added to gathering gallery!`);
  };

  const handleLikePhoto = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleRsvpEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, attendeesCount: e.attendeesCount + 1 } : e))
    );
    showToast('Seat reserved! We look forward to fellowship with you.');
  };

  const handleSubmitPrayer = (prayer: PrayerRequest) => {
    setPrayers((prev) => [prayer, ...prev]);
    showToast('Prayer petition received. Pastoral team is interceding.');
  };

  const handlePrayForRequest = (prayerId: string) => {
    setPrayers((prev) =>
      prev.map((p) => (p.id === prayerId ? { ...p, prayedCount: p.prayedCount + 1 } : p))
    );
  };

  const handleLoginAdmin = (admin: AdminUser) => {
    setCurrentAdmin(admin);
    showToast(`Welcome back, ${admin.name}!`);
    setActiveView('admin');
  };

  const handleLogoutAdmin = () => {
    setCurrentAdmin(null);
    showToast('Signed out of administrative console.');
    setActiveView('home');
  };

  const handleRegisterAdmin = (newAdmin: AdminUser) => {
    setAdmins((prev) => [...prev, newAdmin]);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-4 bg-stone-900 text-stone-100 dark:bg-amber-500 dark:text-stone-950 rounded-xl shadow-2xl border border-stone-800 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-sm">
          {toastMessage}
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        currentAdmin={currentAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'home' && (
          <div className="space-y-16">
            <Hero
              latestSermon={sermons[0]}
              nextEvent={events[0]}
              onNavigate={setActiveView}
              recentTransactionsCount={transactions.length}
            />

            {/* Home Snapshot: Sermons Excerpt */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-end justify-between pb-4 border-b border-stone-200 dark:border-stone-800 mb-8">
                <div>
                  <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-serif">
                    Spiritual Food
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900 dark:text-stone-100 mt-1">
                    Recent Anointed Teachings
                  </h2>
                </div>
                <button
                  onClick={() => setActiveView('sermons')}
                  className="text-xs font-semibold text-amber-800 dark:text-amber-400 hover:underline"
                >
                  View All Sermons →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sermons.slice(0, 4).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setActiveView('sermons')}
                    className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
                  >
                    <div className="text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      {s.series}
                    </div>
                    <h3 className="font-serif font-semibold text-base text-stone-900 dark:text-stone-100 line-clamp-1">
                      {s.title}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                      {s.summary}
                    </p>
                    <div className="pt-2 text-xs text-stone-500 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center">
                      <span className="font-medium text-stone-700 dark:text-stone-300">{s.preacher}</span>
                      <span className="font-serif italic">{s.scripture}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Home Snapshot: Gathering Photo Highlights */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-end justify-between pb-4 border-b border-stone-200 dark:border-stone-800 mb-8">
                <div>
                  <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-serif">
                    Community Fellowship
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900 dark:text-stone-100 mt-1">
                    Life in the Sanctuary
                  </h2>
                </div>
                <button
                  onClick={() => setActiveView('gallery')}
                  className="text-xs font-semibold text-amber-800 dark:text-amber-400 hover:underline"
                >
                  Browse Full Gallery ({photos.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.slice(0, 3).map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setActiveView('gallery')}
                    className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="aspect-4/3 bg-stone-950 overflow-hidden relative">
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-stone-950/80 backdrop-blur-sm rounded text-[11px] font-mono text-amber-400">
                        {photo.album}
                      </div>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h4 className="font-serif font-semibold text-sm text-stone-900 dark:text-stone-100 group-hover:text-amber-700 transition-colors">
                        {photo.title}
                      </h4>
                      <p className="text-xs text-stone-500 line-clamp-1">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Home Snapshot: Giving & Stewardship Callout */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 text-stone-100 p-8 sm:p-12 border border-stone-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3 max-w-xl">
                  <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono">
                    Faithful Biblical Stewardship
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold">
                    Honor God with Your Tithes & Offerings
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    Enjoy seamless, encrypted M-Pesa STK push giving that triggers an instant PIN prompt on your phone, credited directly into Grace Sanctuary Bank accounts with real-time electronic tax receipts.
                  </p>
                </div>
                <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setActiveView('giving')}
                    className="py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                  >
                    Give via M-Pesa STK Push
                  </button>
                  <button
                    onClick={() => setActiveView('programs')}
                    className="py-3.5 px-6 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 font-medium text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    View Service Times
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeView === 'sermons' && (
          <SermonView sermons={sermons} />
        )}

        {activeView === 'programs' && (
          <ProgramsView
            programs={programs}
            events={events}
            onRsvpEvent={handleRsvpEvent}
          />
        )}

        {activeView === 'giving' && (
          <GivingPortal
            bankAccounts={bankAccounts}
            onNewTransaction={handleNewTransaction}
            onNavigateToAccounting={() => setActiveView('admin')}
          />
        )}

        {activeView === 'gallery' && (
          <GalleryView
            photos={photos}
            onUploadPhoto={handleUploadPhoto}
            onLikePhoto={handleLikePhoto}
          />
        )}

        {activeView === 'prayer' && (
          <PrayerWall
            prayers={prayers}
            onSubmitPrayer={handleSubmitPrayer}
            onPrayForRequest={handlePrayForRequest}
          />
        )}

        {activeView === 'admin' && (
          <AdminPortal
            currentAdmin={currentAdmin}
            admins={admins}
            onLogin={handleLoginAdmin}
            onLogout={handleLogoutAdmin}
            onRegisterAdmin={handleRegisterAdmin}
            programs={programs}
            onUpdatePrograms={setPrograms}
            events={events}
            onUpdateEvents={setEvents}
            sermons={sermons}
            onUpdateSermons={setSermons}
            photos={photos}
            onUpdatePhotos={setPhotos}
            transactions={transactions}
            bankAccounts={bankAccounts}
            prayers={prayers}
            onUpdatePrayers={setPrayers}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        bankAccounts={bankAccounts}
        onNavigate={setActiveView}
      />
    </div>
  );
}
