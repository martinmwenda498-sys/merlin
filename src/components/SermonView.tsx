import { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  FileText, 
  Download, 
  Share2, 
  Search, 
  BookOpen, 
  Video, 
  Headphones, 
  Clock, 
  User, 
  Calendar,
  Check
} from 'lucide-react';
import { Sermon } from '../types/church';

interface SermonViewProps {
  sermons: Sermon[];
}

export function SermonView({ sermons }: SermonViewProps) {
  const [selectedSermonId, setSelectedSermonId] = useState<string>(sermons[0]?.id || '');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeMediaTab, setActiveMediaTab] = useState<'audio' | 'video' | 'notes'>('audio');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSeries, setSelectedSeries] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeSermon = sermons.find((s) => s.id === selectedSermonId) || sermons[0];

  const seriesList = Array.from(new Set(sermons.map((s) => s.series)));

  const filteredSermons = sermons.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.preacher.toLowerCase().includes(q) ||
      s.scripture.toLowerCase().includes(q);
    const matchesSeries = selectedSeries === 'all' || s.series === selectedSeries;
    return matchesSearch && matchesSeries;
  });

  // Simulated duration in seconds (45 mins = 2700s)
  const durationSec = 2700;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= durationSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseInt(e.target.value, 10));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleShare = () => {
    if (!activeSermon) return;
    const text = `Listen to "${activeSermon.title}" by ${activeSermon.preacher} (${activeSermon.scripture}) at Grace Sanctuary Church.`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (!activeSermon) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-serif">
          The Living Word of God
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-stone-900 dark:text-stone-100 mt-2 tracking-tight">
          Sermons & Media Archive
        </h1>
        <p className="text-stone-600 dark:text-stone-400 mt-2 text-sm sm:text-base leading-relaxed">
          Listen to anointed expositions, download biblical study notes, and grow in your walk of discipleship.
        </p>
      </div>

      {/* Featured Active Sermon Player Box */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Player / Media Area (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Media Mode Tabs */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl w-fit">
              <button
                onClick={() => setActiveMediaTab('audio')}
                className={`py-1.5 px-3.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeMediaTab === 'audio'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Audio Podcast</span>
              </button>
              <button
                onClick={() => setActiveMediaTab('video')}
                className={`py-1.5 px-3.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeMediaTab === 'video'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Recording</span>
              </button>
              <button
                onClick={() => setActiveMediaTab('notes')}
                className={`py-1.5 px-3.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeMediaTab === 'notes'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Study Outline</span>
              </button>
            </div>

            {/* Media Presentation Display */}
            {activeMediaTab === 'audio' && (
              <div className="p-6 bg-stone-900 text-stone-100 rounded-2xl border border-stone-800 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400">
                    Series: {activeSermon.series}
                  </span>
                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{activeSermon.duration}</span>
                  </span>
                </div>

                {/* Animated Waveform Visualization */}
                <div className="h-16 flex items-center justify-between gap-1 px-2 py-3 bg-stone-950/60 rounded-xl border border-stone-800/80">
                  {Array.from({ length: 32 }).map((_, i) => {
                    const height = isPlaying
                      ? Math.sin((i + currentTime * 2) * 0.4) * 20 + 26
                      : Math.sin(i * 0.5) * 12 + 18;
                    return (
                      <div
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-200 ${
                          isPlaying ? 'bg-amber-400' : 'bg-stone-700'
                        }`}
                        style={{ height: `${Math.max(6, height)}px` }}
                      />
                    );
                  })}
                </div>

                {/* Scrubber Slider */}
                <div className="space-y-1.5">
                  <input
                    type="range"
                    min="0"
                    max={durationSec}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-stone-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(durationSec)}</span>
                  </div>
                </div>

                {/* Player Controls */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setCurrentTime((t) => Math.max(0, t - 15))}
                      className="p-2 text-stone-400 hover:text-white transition-colors"
                      title="Rewind 15 seconds"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={togglePlay}
                      className="w-12 h-12 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-stone-950" /> : <Play className="w-5 h-5 fill-stone-950 translate-x-0.5" />}
                    </button>

                    <button
                      onClick={() => setCurrentTime((t) => Math.min(durationSec, t + 15))}
                      className="p-2 text-stone-400 hover:text-white transition-colors"
                      title="Fast forward 15 seconds"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 transition-colors flex items-center gap-1.5"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeMediaTab === 'video' && (
              <div className="aspect-video bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 flex items-center justify-center relative">
                <div className="text-center p-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                    <Video className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-semibold text-stone-100">Sunday Service Video Stream</h4>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Recorded in 4K at the Sanctuary Altar during the second service celebration.
                  </p>
                  <button
                    onClick={() => alert('Starting full HD video stream playback...')}
                    className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-semibold inline-flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-stone-950" />
                    <span>Watch Full Sermon Video</span>
                  </button>
                </div>
              </div>
            )}

            {activeMediaTab === 'notes' && (
              <div className="p-6 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 max-h-[360px] overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-750">
                  <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                    Sermon Key Points & Exegesis
                  </span>
                  <span className="text-xs text-stone-500 font-serif italic">{activeSermon.scripture}</span>
                </div>
                <div className="space-y-2.5">
                  {activeSermon.fullNotes.map((note, idx) => (
                    <div key={idx} className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sermon Details & Scripture Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs text-amber-700 dark:text-amber-400 font-serif font-medium uppercase tracking-wider">
              {activeSermon.series}
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
              {activeSermon.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 pb-2 border-b border-stone-200 dark:border-stone-800">
              <span className="flex items-center gap-1.5 font-medium text-stone-800 dark:text-stone-200">
                <User className="w-3.5 h-3.5" />
                <span>{activeSermon.preacher}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{activeSermon.date}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{activeSermon.scripture}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {activeSermon.summary}
            </p>

            {/* Key Verses */}
            {activeSermon.keyVerses.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                  Scripture Anchors:
                </span>
                {activeSermon.keyVerses.map((verse, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-850 border border-amber-200/50 dark:border-stone-750 text-xs font-serif italic text-stone-800 dark:text-stone-300 leading-relaxed">
                    "{verse}"
                  </div>
                ))}
              </div>
            )}

            {/* Download Study Guide */}
            <div className="pt-2">
              <button
                onClick={() => alert(`Downloading study guide PDF for "${activeSermon.title}"...`)}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Study Guide Notes (PDF)</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Sermon Archive Filter & Grid */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-serif font-semibold text-stone-900 dark:text-stone-100">
              Browse Recent Messages
            </h3>
            <p className="text-xs text-stone-500">Filter by preaching series or search by scripture</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sermons or scripture..."
                className="pl-8 pr-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Series Filter */}
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="py-2 px-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
            >
              <option value="all">All Sermon Series</option>
              {seriesList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sermon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSermons.map((sermon) => {
            const isCurrent = sermon.id === selectedSermonId;
            return (
              <div
                key={sermon.id}
                onClick={() => setSelectedSermonId(sermon.id)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isCurrent
                    ? 'bg-amber-50/40 dark:bg-stone-850 border-amber-500/60 shadow-sm ring-1 ring-amber-500/40'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <span className="font-serif uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      {sermon.series}
                    </span>
                    <span>{sermon.duration}</span>
                  </div>

                  <h4 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 leading-snug">
                    {sermon.title}
                  </h4>

                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                    {sermon.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-stone-800 dark:text-stone-200">{sermon.preacher}</div>
                    <div className="text-[11px] text-stone-500 font-serif italic">{sermon.scripture}</div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSermonId(sermon.id);
                      setIsPlaying(true);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      isCurrent && isPlaying
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {isCurrent && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
