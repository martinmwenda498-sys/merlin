import { useState } from 'react';
import { 
  HeartHandshake, 
  Plus, 
  Lock, 
  Globe, 
  CheckCircle, 
  X, 
  MessageSquareQuote,
  Sparkles,
  Send
} from 'lucide-react';
import { PrayerRequest } from '../types/church';

interface PrayerWallProps {
  prayers: PrayerRequest[];
  onSubmitPrayer: (prayer: PrayerRequest) => void;
  onPrayForRequest: (id: string) => void;
}

export function PrayerWall({ prayers, onSubmitPrayer, onPrayForRequest }: PrayerWallProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [prayedSet, setPrayedSet] = useState<Set<string>>(new Set());

  // Form states
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState<PrayerRequest['category']>('Healing & Health');
  const [title, setTitle] = useState('');
  const [request, setRequest] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);
  const [submittedAlert, setSubmittedAlert] = useState(false);

  const categories: Array<PrayerRequest['category']> = [
    'Healing & Health',
    'Family & Marriage',
    'Finances & Career',
    'Spiritual Growth',
    'Thanksgiving',
    'Other',
  ];

  // Only public requests on the wall
  const publicPrayers = prayers.filter((p) => !p.isConfidential);
  const filtered = publicPrayers.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handlePray = (id: string) => {
    if (prayedSet.has(id)) return;
    onPrayForRequest(id);
    setPrayedSet((prev) => new Set(prev).add(id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !request.trim()) {
      alert('Please provide a prayer title and request details.');
      return;
    }

    const newPrayer: PrayerRequest = {
      id: `pr-${Date.now()}`,
      requesterName: name.trim() || 'Anonymous Brother/Sister',
      requesterContact: contact.trim() || undefined,
      category: category,
      title: title.trim(),
      request: request.trim(),
      date: new Date().toISOString().split('T')[0],
      isConfidential: isConfidential,
      prayedCount: 1,
      adminResponse: 'The Pastoral Intercessory Team is carrying your request before the Throne of Grace. "The prayer of a righteous person is powerful and effective." — James 5:16',
      status: 'active',
    };

    onSubmitPrayer(newPrayer);
    setIsModalOpen(false);
    setSubmittedAlert(true);
    setTimeout(() => setSubmittedAlert(false), 5000);

    // Reset
    setName('');
    setContact('');
    setTitle('');
    setRequest('');
    setIsConfidential(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-serif">
            Pastoral Care & Intercession
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-stone-900 dark:text-stone-100 mt-2 tracking-tight">
            Community Prayer Wall
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-2 text-sm sm:text-base max-w-2xl leading-relaxed">
            "Bear one another's burdens, and so fulfill the law of Christ" — Galatians 6:2. Submit requests to our pastoral intercessors and pray for fellow brothers and sisters.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-3 px-5 rounded-xl bg-amber-800 hover:bg-amber-900 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Prayer Request</span>
          </button>
        </div>
      </div>

      {submittedAlert && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Your prayer petition has been received by the pastoral intercessory team. We are standing in faith with you!</span>
        </div>
      )}

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`py-2 px-3.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
          }`}
        >
          All Requests ({publicPrayers.length})
        </button>
        {categories.map((c) => {
          const count = publicPrayers.filter((p) => p.category === c).length;
          return (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`py-2 px-3.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === c
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              {c} ({count})
            </button>
          );
        })}
      </div>

      {/* Prayer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((prayer) => {
          const hasPrayed = prayedSet.has(prayer.id);
          return (
            <div
              key={prayer.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-serif font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    {prayer.category}
                  </span>
                  <span>{prayer.date}</span>
                </div>

                <h3 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100">
                  {prayer.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed italic">
                  "{prayer.request}"
                </p>

                <div className="text-xs text-stone-500">
                  Petitioner: <strong className="text-stone-800 dark:text-stone-200">{prayer.requesterName}</strong>
                </div>

                {prayer.adminResponse && (
                  <div className="p-3 bg-amber-50/70 dark:bg-stone-850 rounded-xl border border-amber-200/50 dark:border-stone-750 text-xs text-stone-700 dark:text-stone-300 space-y-1">
                    <span className="font-semibold text-amber-900 dark:text-amber-300 block text-[11px] uppercase tracking-wider">
                      Pastoral Team Intercession & Word
                    </span>
                    <p className="leading-relaxed">{prayer.adminResponse}</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-mono">
                  {prayer.prayedCount + (hasPrayed ? 1 : 0)} prayers offered
                </span>

                <button
                  onClick={() => handlePray(prayer.id)}
                  disabled={hasPrayed}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    hasPrayed
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-default'
                      : 'bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 cursor-pointer'
                  }`}
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
                  <span>{hasPrayed ? 'Prayed With You' : 'I Am Praying For This'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 my-8 text-stone-900 dark:text-stone-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-serif">
                  Pastoral Care Intercession
                </span>
                <h3 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 mt-0.5">
                  Submit Prayer Request
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-stone-800 dark:text-stone-200">
                  Prayer Petition Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Healing for Mama or Job Interview Favor"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-800 dark:text-stone-200">
                  Prayer Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PrayerRequest['category'])}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-800 dark:text-stone-200">
                  Your Prayer Petition Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  placeholder="Share details of the prayer need so pastors and intercessors can stand in specific agreement..."
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-stone-800 dark:text-stone-200">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sister Mercy"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-stone-800 dark:text-stone-200">
                    Phone / Email (For pastoral contact)
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="07xx xxx xxx"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Confidentiality Toggle */}
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="confidential-req"
                    checked={isConfidential}
                    onChange={(e) => setIsConfidential(e.target.checked)}
                    className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                  />
                  <label htmlFor="confidential-req" className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 cursor-pointer">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Confidential (Pastoral Staff & Elders Only)</span>
                  </label>
                </div>
                <p className="text-[11px] text-stone-500 pl-6">
                  If checked, this request will NOT appear on the public prayer wall. It will be sent directly and privately to the Senior Pastor.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-4 text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-amber-800 hover:bg-amber-900 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 rounded-lg transition-colors font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Prayer Petition</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
