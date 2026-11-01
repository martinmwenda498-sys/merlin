import { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Calendar, 
  Clock, 
  BookOpen, 
  Image as ImageIcon, 
  DollarSign, 
  MessageSquare, 
  Upload, 
  Lock, 
  Eye, 
  FolderPlus,
  HeartHandshake
} from 'lucide-react';
import { 
  AdminUser, 
  ChurchProgram, 
  ChurchEvent, 
  Sermon, 
  GalleryPhoto, 
  GivingTransaction, 
  ChurchBankAccount, 
  PrayerRequest 
} from '../types/church';
import { AccountingDashboard } from './AccountingDashboard';

interface AdminPortalProps {
  currentAdmin: AdminUser | null;
  admins: AdminUser[];
  onLogin: (admin: AdminUser) => void;
  onLogout: () => void;
  onRegisterAdmin: (newAdmin: AdminUser) => void;
  programs: ChurchProgram[];
  onUpdatePrograms: (programs: ChurchProgram[]) => void;
  events: ChurchEvent[];
  onUpdateEvents: (events: ChurchEvent[]) => void;
  sermons: Sermon[];
  onUpdateSermons: (sermons: Sermon[]) => void;
  photos: GalleryPhoto[];
  onUpdatePhotos: (photos: GalleryPhoto[]) => void;
  transactions: GivingTransaction[];
  bankAccounts: ChurchBankAccount[];
  prayers: PrayerRequest[];
  onUpdatePrayers: (prayers: PrayerRequest[]) => void;
}

export function AdminPortal({
  currentAdmin,
  admins,
  onLogin,
  onLogout,
  onRegisterAdmin,
  programs,
  onUpdatePrograms,
  events,
  onUpdateEvents,
  sermons,
  onUpdateSermons,
  photos,
  onUpdatePhotos,
  transactions,
  bankAccounts,
  prayers,
  onUpdatePrayers,
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'accounting' | 'programs' | 'events' | 'sermons' | 'gallery' | 'prayers'>('accounting');

  // Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<AdminUser['role']>('Senior Pastor');
  const [authError, setAuthError] = useState<string | null>(null);

  // Program Form
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false);
  const [progTitle, setProgTitle] = useState('');
  const [progDay, setProgDay] = useState<ChurchProgram['dayOfWeek']>('Sunday');
  const [progTime, setProgTime] = useState('');
  const [progVenue, setProgVenue] = useState('');
  const [progTarget, setProgTarget] = useState<ChurchProgram['targetGroup']>('All Congregation');
  const [progDesc, setProgDesc] = useState('');
  const [progLeader, setProgLeader] = useState('');
  const [progStreaming, setProgStreaming] = useState(true);

  // Event Form
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDate, setEvtDate] = useState('');
  const [evtTime, setEvtTime] = useState('');
  const [evtLoc, setEvtLoc] = useState('');
  const [evtDesc, setEvtDesc] = useState('');
  const [evtCat, setEvtCat] = useState<ChurchEvent['category']>('Revival');
  const [evtSpeaker, setEvtSpeaker] = useState('');
  const [evtBanner, setEvtBanner] = useState('');
  const [evtThemeVerse, setEvtThemeVerse] = useState('');

  // Sermon Form
  const [isAddSermonOpen, setIsAddSermonOpen] = useState(false);
  const [sermonTitle, setSermonTitle] = useState('');
  const [sermonPreacher, setSermonPreacher] = useState('');
  const [sermonScripture, setSermonScripture] = useState('');
  const [sermonSeries, setSermonSeries] = useState('');
  const [sermonSummary, setSermonSummary] = useState('');
  const [sermonNotes, setSermonNotes] = useState('');

  // Photo Admin Upload Form
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoAlbum, setPhotoAlbum] = useState<GalleryPhoto['album']>('Sunday Worship');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);

  // Prayer response state
  const [replyingPrayerId, setReplyingPrayerId] = useState<string | null>(null);
  const [pastoralReply, setPastoralReply] = useState('');

  // Handle Login
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (authMode === 'login') {
      const match = admins.find((a) => a.email.toLowerCase() === email.toLowerCase().trim());
      if (match) {
        onLogin(match);
      } else {
        // Allow login with demo or any email for seamless preview
        const newAdmin: AdminUser = {
          id: `admin-${Date.now()}`,
          name: email.split('@')[0].replace('.', ' '),
          email: email.trim(),
          role: 'Church Administrator',
          createdAt: new Date().toISOString().split('T')[0],
        };
        onRegisterAdmin(newAdmin);
        onLogin(newAdmin);
      }
    } else {
      if (!fullName.trim() || !email.trim()) {
        setAuthError('Please fill in your name and email.');
        return;
      }
      const newAdmin: AdminUser = {
        id: `admin-${Date.now()}`,
        name: fullName.trim(),
        email: email.trim(),
        role: role,
        createdAt: new Date().toISOString().split('T')[0],
      };
      onRegisterAdmin(newAdmin);
      onLogin(newAdmin);
    }
  };

  const handleQuickDemoLogin = (roleSelect: AdminUser['role']) => {
    const demo = admins.find((a) => a.role === roleSelect) || admins[0];
    if (demo) {
      onLogin(demo);
    }
  };

  // PROGRAM HANDLERS
  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progTitle.trim() || !progTime.trim()) return;

    const newProg: ChurchProgram = {
      id: `prog-${Date.now()}`,
      title: progTitle.trim(),
      dayOfWeek: progDay,
      time: progTime.trim(),
      venue: progVenue.trim() || 'Main Sanctuary',
      targetGroup: progTarget,
      description: progDesc.trim() || 'Weekly service gathering.',
      leader: progLeader.trim() || currentAdmin?.name || 'Pastoral Team',
      isWeekly: true,
      streamingAvailable: progStreaming,
    };

    onUpdatePrograms([newProg, ...programs]);
    setIsAddProgramOpen(false);
    setProgTitle('');
    setProgTime('');
    setProgVenue('');
    setProgDesc('');
  };

  const handleDeleteProgram = (id: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      onUpdatePrograms(programs.filter((p) => p.id !== id));
    }
  };

  // EVENT HANDLERS
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle.trim() || !evtDate.trim()) return;

    const newEvt: ChurchEvent = {
      id: `evt-${Date.now()}`,
      title: evtTitle.trim(),
      date: evtDate,
      time: evtTime.trim() || '9:00 AM',
      location: evtLoc.trim() || 'Grace Sanctuary Main Auditorium',
      description: evtDesc.trim(),
      category: evtCat,
      speaker: evtSpeaker.trim() || currentAdmin?.name || 'Sanctuary Pastoral Team',
      bannerImage: evtBanner.trim() || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80',
      registrationOpen: true,
      attendeesCount: 0,
      themeVerse: evtThemeVerse.trim() || undefined,
    };

    onUpdateEvents([newEvt, ...events]);
    setIsAddEventOpen(false);
    setEvtTitle('');
    setEvtDate('');
    setEvtTime('');
    setEvtDesc('');
    setEvtSpeaker('');
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Delete this event?')) {
      onUpdateEvents(events.filter((e) => e.id !== id));
    }
  };

  // SERMON HANDLERS
  const handleCreateSermon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sermonTitle.trim() || !sermonScripture.trim()) return;

    const notesList = sermonNotes
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    const newSermon: Sermon = {
      id: `sermon-${Date.now()}`,
      title: sermonTitle.trim(),
      preacher: sermonPreacher.trim() || currentAdmin?.name || 'Pastor',
      preacherRole: currentAdmin?.role || 'Pastoral Team',
      date: new Date().toISOString().split('T')[0],
      scripture: sermonScripture.trim(),
      series: sermonSeries.trim() || 'Sunday Messages',
      duration: '45 mins',
      summary: sermonSummary.trim() || 'Anointed message on God’s grace and truth.',
      fullNotes: notesList.length > 0 ? notesList : ['1. Anointed exposition of scripture.'],
      keyVerses: [sermonScripture.trim()],
    };

    onUpdateSermons([newSermon, ...sermons]);
    setIsAddSermonOpen(false);
    setSermonTitle('');
    setSermonScripture('');
    setSermonSeries('');
    setSermonSummary('');
    setSermonNotes('');
  };

  const handleDeleteSermon = (id: string) => {
    if (confirm('Delete this sermon?')) {
      onUpdateSermons(sermons.filter((s) => s.id !== id));
    }
  };

  // PHOTO HANDLERS
  const handlePhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoDataUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAdminPhotoUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim() || !photoDataUrl) return;

    const newPhoto: GalleryPhoto = {
      id: `photo-${Date.now()}`,
      title: photoTitle.trim(),
      album: photoAlbum,
      imageUrl: photoDataUrl,
      date: new Date().toISOString().split('T')[0],
      uploadedBy: currentAdmin?.name || 'Church Admin',
      uploaderRole: 'Admin',
      approved: true,
      caption: photoCaption.trim() || 'Uploaded by Church Administration',
      likes: 1,
    };

    onUpdatePhotos([newPhoto, ...photos]);
    setIsAddPhotoOpen(false);
    setPhotoTitle('');
    setPhotoCaption('');
    setPhotoDataUrl(null);
  };

  const handleDeletePhoto = (id: string) => {
    if (confirm('Delete this photo from gallery?')) {
      onUpdatePhotos(photos.filter((p) => p.id !== id));
    }
  };

  // PRAYER RESPONSE HANDLER
  const handleSendPastoralResponse = (prayerId: string) => {
    if (!pastoralReply.trim()) return;
    const updated = prayers.map((p) => {
      if (p.id === prayerId) {
        return {
          ...p,
          adminResponse: pastoralReply.trim(),
          prayedCount: p.prayedCount + 1,
        };
      }
      return p;
    });
    onUpdatePrayers(updated);
    setReplyingPrayerId(null);
    setPastoralReply('');
  };

  // NOT LOGGED IN: Show Admin Auth Screen
  if (!currentAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-serif">
              Administrative & Pastoral Portal
            </span>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 dark:text-stone-100">
              {authMode === 'login' ? 'Church Admin Login' : 'Create Admin Account'}
            </h2>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Manage church programs, events, sermon media, approve gallery photos, and audit M-Pesa & bank giving transactions.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-lg text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
            {authMode === 'register' && (
              <>
                <div>
                  <label className="block font-semibold mb-1 text-stone-800 dark:text-stone-200">
                    Full Name & Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Senior Pastor David Mwenda"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-stone-800 dark:text-stone-200">
                    Administrative Church Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as AdminUser['role'])}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Senior Pastor">Senior Pastor</option>
                    <option value="Church Administrator">Church Administrator</option>
                    <option value="Finance Deacon">Finance Deacon</option>
                    <option value="Media Director">Media Director</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block font-semibold mb-1 text-stone-800 dark:text-stone-200">
                Official Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pastor.david@gracesanctuary.org"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-stone-800 dark:text-stone-200">
                Admin Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 rounded-xl font-semibold transition-colors cursor-pointer text-xs"
            >
              {authMode === 'login' ? 'Sign In to Admin Dashboard' : 'Complete Account Registration'}
            </button>
          </form>

          {/* Mode Switch */}
          <div className="pt-2 text-center text-xs text-stone-500">
            {authMode === 'login' ? (
              <p>
                Need to create a new administrative account?{' '}
                <button
                  onClick={() => setAuthMode('register')}
                  className="text-amber-700 dark:text-amber-400 font-semibold hover:underline"
                >
                  Create Admin Account
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-amber-700 dark:text-amber-400 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Login Affordance */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 text-center space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono block">
              Quick One-Click Demo Access
            </span>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Senior Pastor')}
                className="py-1.5 px-3 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-[11px] font-medium"
              >
                Log In as Senior Pastor
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Finance Deacon')}
                className="py-1.5 px-3 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-[11px] font-medium"
              >
                Log In as Finance Deacon
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Media Director')}
                className="py-1.5 px-3 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-[11px] font-medium"
              >
                Log In as Media Director
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN ADMIN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Admin Status Top Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
            {currentAdmin.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">{currentAdmin.name}</h2>
              <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-mono">
                {currentAdmin.role}
              </span>
            </div>
            <p className="text-xs text-stone-500">{currentAdmin.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLogout}
            className="py-2 px-3 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Nav Tabs for Admin CMS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200 dark:border-stone-800 text-xs">
        <button
          onClick={() => setActiveTab('accounting')}
          className={`py-2 px-4 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'accounting'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-500" />
          <span>Giving & Financial Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('programs')}
          className={`py-2 px-4 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'programs'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Weekly Programs ({programs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`py-2 px-4 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'events'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span>Church Events ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sermons')}
          className={`py-2 px-4 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'sermons'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-rose-500" />
          <span>Sermons & Media ({sermons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`py-2 px-4 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'gallery'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-teal-500" />
          <span>Gallery Moderation ({photos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('prayers')}
          className={`py-2 px-4 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'prayers'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-amber-500" />
          <span>Pastoral Prayers ({prayers.length})</span>
        </button>
      </div>

      {/* 1. GIVING & ACCOUNTING TAB */}
      {activeTab === 'accounting' && (
        <AccountingDashboard
          transactions={transactions}
          bankAccounts={bankAccounts}
        />
      )}

      {/* 2. PROGRAMS & ACTIVITIES CMS */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-semibold text-stone-900 dark:text-stone-100">
                Church Programs & Weekly Services
              </h3>
              <p className="text-xs text-stone-500">Configure service times, target groups, and livestream links</p>
            </div>
            <button
              onClick={() => setIsAddProgramOpen(true)}
              className="py-2 px-4 rounded-lg bg-stone-900 dark:bg-amber-500 hover:bg-stone-800 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Program</span>
            </button>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-3 px-4">Program Title</th>
                    <th className="py-3 px-4">Day & Time</th>
                    <th className="py-3 px-4">Venue</th>
                    <th className="py-3 px-4">Target Group</th>
                    <th className="py-3 px-4">Leader / Minister</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {programs.map((prog) => (
                    <tr key={prog.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                      <td className="py-3 px-4 font-semibold text-stone-900 dark:text-stone-100">
                        {prog.title}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-amber-700 dark:text-amber-400">{prog.dayOfWeek}</span> · {prog.time}
                      </td>
                      <td className="py-3 px-4 text-stone-600 dark:text-stone-400">{prog.venue}</td>
                      <td className="py-3 px-4 text-stone-600 dark:text-stone-400">{prog.targetGroup}</td>
                      <td className="py-3 px-4 text-stone-600 dark:text-stone-400">{prog.leader}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProgram(prog.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded transition-colors"
                          title="Delete Program"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Program Modal */}
          {isAddProgramOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-stone-900 dark:text-stone-100">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-stone-800">
                  <h4 className="text-base font-serif font-semibold">Add New Church Program</h4>
                  <button onClick={() => setIsAddProgramOpen(false)}><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleCreateProgram} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Program Title *</label>
                    <input
                      type="text"
                      required
                      value={progTitle}
                      onChange={(e) => setProgTitle(e.target.value)}
                      placeholder="e.g. Wednesday Midweek Communion"
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Day of Week</label>
                      <select
                        value={progDay}
                        onChange={(e) => setProgDay(e.target.value as ChurchProgram['dayOfWeek'])}
                        className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                      >
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Time Schedule *</label>
                      <input
                        type="text"
                        required
                        value={progTime}
                        onChange={(e) => setProgTime(e.target.value)}
                        placeholder="05:30 PM – 07:00 PM"
                        className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Venue</label>
                      <input
                        type="text"
                        value={progVenue}
                        onChange={(e) => setProgVenue(e.target.value)}
                        placeholder="Main Sanctuary / Youth Hall"
                        className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Target Group</label>
                      <select
                        value={progTarget}
                        onChange={(e) => setProgTarget(e.target.value as ChurchProgram['targetGroup'])}
                        className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                      >
                        <option value="All Congregation">All Congregation</option>
                        <option value="Youth & Teens">Youth & Teens</option>
                        <option value="Women Ministry">Women Ministry</option>
                        <option value="Men of Honor">Men of Honor</option>
                        <option value="Children">Children</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Leader / Coordinating Minister</label>
                    <input
                      type="text"
                      value={progLeader}
                      onChange={(e) => setProgLeader(e.target.value)}
                      placeholder="e.g. Senior Pastor David Mwenda"
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Program Description</label>
                    <textarea
                      rows={2}
                      value={progDesc}
                      onChange={(e) => setProgDesc(e.target.value)}
                      placeholder="Summary of spiritual focus..."
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddProgramOpen(false)}
                      className="flex-1 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 font-semibold rounded-lg"
                    >
                      Save Program
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. CHURCH EVENTS CMS */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-semibold text-stone-900 dark:text-stone-100">
                Church Events & Conferences
              </h3>
              <p className="text-xs text-stone-500">Publish upcoming revivals, seminars, and camps</p>
            </div>
            <button
              onClick={() => setIsAddEventOpen(true)}
              className="py-2 px-4 rounded-lg bg-stone-900 dark:bg-amber-500 hover:bg-stone-800 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-semibold text-amber-700 dark:text-amber-400">{evt.category}</span>
                  <span>{evt.attendeesCount} RSVP</span>
                </div>
                <h4 className="font-serif font-semibold text-lg text-stone-900 dark:text-stone-100">
                  {evt.title}
                </h4>
                <p className="text-xs text-stone-500">
                  {evt.date} · {evt.time}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                  {evt.description}
                </p>
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center text-xs">
                  <span className="text-stone-500">{evt.speaker}</span>
                  <button
                    onClick={() => handleDeleteEvent(evt.id)}
                    className="text-stone-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Event Modal */}
          {isAddEventOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-stone-900 dark:text-stone-100 my-8">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-stone-800">
                  <h4 className="text-base font-serif font-semibold">Publish Church Event</h4>
                  <button onClick={() => setIsAddEventOpen(false)}><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Event Title *</label>
                    <input
                      type="text"
                      required
                      value={evtTitle}
                      onChange={(e) => setEvtTitle(e.target.value)}
                      placeholder="e.g. Easter Praise & Breakthrough Revival"
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Event Date *</label>
                      <input
                        type="date"
                        required
                        value={evtDate}
                        onChange={(e) => setEvtDate(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Time Schedule</label>
                      <input
                        type="text"
                        value={evtTime}
                        onChange={(e) => setEvtTime(e.target.value)}
                        placeholder="5:30 PM Daily"
                        className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Category</label>
                      <select
                        value={evtCat}
                        onChange={(e) => setEvtCat(e.target.value as ChurchEvent['category'])}
                        className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                      >
                        <option value="Revival">Revival</option>
                        <option value="Conference">Conference</option>
                        <option value="Community Outreach">Community Outreach</option>
                        <option value="Youth Camp">Youth Camp</option>
                        <option value="Worship Night">Worship Night</option>
                        <option value="Fellowship">Fellowship</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Minister / Speaker</label>
                      <input
                        type="text"
                        value={evtSpeaker}
                        onChange={(e) => setEvtSpeaker(e.target.value)}
                        placeholder="e.g. Bishop Kibet"
                        className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Venue / Location</label>
                    <input
                      type="text"
                      value={evtLoc}
                      onChange={(e) => setEvtLoc(e.target.value)}
                      placeholder="Grace Sanctuary Cathedral Grounds"
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Theme Scripture Verse</label>
                    <input
                      type="text"
                      value={evtThemeVerse}
                      onChange={(e) => setEvtThemeVerse(e.target.value)}
                      placeholder="e.g. Isaiah 43:19 — Behold, I will do a new thing..."
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Banner Image URL</label>
                    <input
                      type="text"
                      value={evtBanner}
                      onChange={(e) => setEvtBanner(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Event Description</label>
                    <textarea
                      rows={3}
                      value={evtDesc}
                      onChange={(e) => setEvtDesc(e.target.value)}
                      placeholder="Details about registration, transport, meals, and vision..."
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddEventOpen(false)}
                      className="flex-1 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 font-semibold rounded-lg"
                    >
                      Publish Event
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. SERMONS & MEDIA CMS */}
      {activeTab === 'sermons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-semibold text-stone-900 dark:text-stone-100">
                Sermon Archive & Media Uploads
              </h3>
              <p className="text-xs text-stone-500">Upload preachings, study guides, scripture notes, and recordings</p>
            </div>
            <button
              onClick={() => setIsAddSermonOpen(true)}
              className="py-2 px-4 rounded-lg bg-stone-900 dark:bg-amber-500 hover:bg-stone-800 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Sermon Message</span>
            </button>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-3 px-4">Message Title</th>
                    <th className="py-3 px-4">Preacher</th>
                    <th className="py-3 px-4">Scripture Passage</th>
                    <th className="py-3 px-4">Series</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {sermons.map((sermon) => (
                    <tr key={sermon.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                      <td className="py-3 px-4 font-semibold text-stone-900 dark:text-stone-100">
                        {sermon.title}
                      </td>
                      <td className="py-3 px-4 text-stone-700 dark:text-stone-300">{sermon.preacher}</td>
                      <td className="py-3 px-4 font-serif italic text-stone-600 dark:text-stone-400">{sermon.scripture}</td>
                      <td className="py-3 px-4 text-amber-700 dark:text-amber-400">{sermon.series}</td>
                      <td className="py-3 px-4 text-stone-500">{sermon.date}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteSermon(sermon.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded transition-colors"
                          title="Delete Sermon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Sermon Modal */}
          {isAddSermonOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-stone-900 dark:text-stone-100 my-8">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-stone-800">
                  <h4 className="text-base font-serif font-semibold">Publish Anointed Sermon</h4>
                  <button onClick={() => setIsAddSermonOpen(false)}><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleCreateSermon} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Sermon Title *</label>
                    <input
                      type="text"
                      required
                      value={sermonTitle}
                      onChange={(e) => setSermonTitle(e.target.value)}
                      placeholder="e.g. Supernatural Multiplication Through Giving"
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Preacher Name</label>
                      <input
                        type="text"
                        value={sermonPreacher}
                        onChange={(e) => setSermonPreacher(e.target.value)}
                        placeholder="Pastor David Mwenda"
                        className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Scripture Reference *</label>
                      <input
                        type="text"
                        required
                        value={sermonScripture}
                        onChange={(e) => setSermonScripture(e.target.value)}
                        placeholder="Luke 6:38, Malachi 3:10"
                        className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Sermon Series Name</label>
                    <input
                      type="text"
                      value={sermonSeries}
                      onChange={(e) => setSermonSeries(e.target.value)}
                      placeholder="e.g. Kingdom Economics & Honor"
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Summary Exegesis</label>
                    <textarea
                      rows={2}
                      value={sermonSummary}
                      onChange={(e) => setSermonSummary(e.target.value)}
                      placeholder="Brief core truth for congregation..."
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Full Sermon Notes (One point per line)</label>
                    <textarea
                      rows={4}
                      value={sermonNotes}
                      onChange={(e) => setSermonNotes(e.target.value)}
                      placeholder="1. God is the Source of all increase&#10;2. The principle of the tenth honors the King&#10;3. Sowing generously in love and joy"
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddSermonOpen(false)}
                      className="flex-1 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 font-semibold rounded-lg"
                    >
                      Upload Sermon
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. PHOTO GALLERY MODERATION */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-semibold text-stone-900 dark:text-stone-100">
                Photo Gallery Moderation & Management
              </h3>
              <p className="text-xs text-stone-500">Upload official sanctuary pictures and review community uploads</p>
            </div>
            <button
              onClick={() => setIsAddPhotoOpen(true)}
              className="py-2 px-4 rounded-lg bg-stone-900 dark:bg-amber-500 hover:bg-stone-800 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Admin Upload Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 bg-stone-950">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] bg-stone-950/80 text-amber-400 font-mono">
                    {photo.album}
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <h4 className="font-semibold text-xs text-stone-900 dark:text-stone-100 truncate">
                    {photo.title}
                  </h4>
                  <div className="text-[11px] text-stone-500 flex justify-between">
                    <span>By: {photo.uploadedBy}</span>
                    <span>{photo.date}</span>
                  </div>
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-end">
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="text-stone-400 hover:text-red-600 p-1"
                      title="Remove from gallery"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Admin Photo Upload Modal */}
          {isAddPhotoOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-stone-900 dark:text-stone-100">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-stone-800">
                  <h4 className="text-base font-serif font-semibold">Upload Photo to Gallery</h4>
                  <button onClick={() => setIsAddPhotoOpen(false)}><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleAdminPhotoUpload} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Select Photo File *</label>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={handlePhotoFile}
                      className="w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Photo Title *</label>
                    <input
                      type="text"
                      required
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      placeholder="e.g. Easter Baptisms Celebration"
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Album Category</label>
                    <select
                      value={photoAlbum}
                      onChange={(e) => setPhotoAlbum(e.target.value as GalleryPhoto['album'])}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                    >
                      <option value="Sunday Worship">Sunday Worship</option>
                      <option value="Youth Fellowship">Youth Fellowship</option>
                      <option value="Missions & Outreach">Missions & Outreach</option>
                      <option value="Baptisms & Dedications">Baptisms & Dedications</option>
                      <option value="Sanctuary & Community">Sanctuary & Community</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Caption</label>
                    <textarea
                      rows={2}
                      value={photoCaption}
                      onChange={(e) => setPhotoCaption(e.target.value)}
                      placeholder="Scripture or memory..."
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddPhotoOpen(false)}
                      className="flex-1 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 font-semibold rounded-lg"
                    >
                      Publish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. PASTORAL PRAYER REQUESTS */}
      {activeTab === 'prayers' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-serif font-semibold text-stone-900 dark:text-stone-100">
              Pastoral Care & Member Prayer Requests
            </h3>
            <p className="text-xs text-stone-500">Includes private confidential pastoral requests and community petitions</p>
          </div>

          <div className="space-y-4">
            {prayers.map((prayer) => (
              <div
                key={prayer.id}
                className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-amber-700 dark:text-amber-400">
                      {prayer.category}
                    </span>
                    {prayer.isConfidential && (
                      <span className="text-[10px] font-medium bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Confidential (Pastors Only)</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-stone-500">{prayer.date}</span>
                </div>

                <h4 className="font-serif font-semibold text-base text-stone-900 dark:text-stone-100">
                  {prayer.title}
                </h4>

                <p className="text-xs text-stone-700 dark:text-stone-300 italic">
                  "{prayer.request}"
                </p>

                <div className="text-xs text-stone-500">
                  Petitioner: <strong className="text-stone-800 dark:text-stone-200">{prayer.requesterName}</strong>
                  {prayer.requesterContact && (
                    <span className="ml-3 font-mono text-stone-600 dark:text-stone-400">
                      Contact: {prayer.requesterContact}
                    </span>
                  )}
                </div>

                {prayer.adminResponse ? (
                  <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-lg text-xs space-y-1">
                    <span className="font-semibold text-stone-800 dark:text-stone-200 text-[11px] uppercase tracking-wider block">
                      Pastoral Response Sent:
                    </span>
                    <p className="text-stone-600 dark:text-stone-400">{prayer.adminResponse}</p>
                  </div>
                ) : (
                  <div className="pt-2">
                    {replyingPrayerId === prayer.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={pastoralReply}
                          onChange={(e) => setPastoralReply(e.target.value)}
                          placeholder="Type pastoral prayer response and scripture encouragement..."
                          className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setReplyingPrayerId(null)}
                            className="py-1 px-3 bg-stone-100 dark:bg-stone-800 rounded text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSendPastoralResponse(prayer.id)}
                            className="py-1 px-3 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 font-semibold rounded text-xs"
                          >
                            Send Pastoral Encouragement
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingPrayerId(prayer.id)}
                        className="py-1 px-3 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 hover:underline rounded text-xs font-medium"
                      >
                        Reply as Pastor
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
