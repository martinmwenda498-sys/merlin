import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Radio, 
  Users, 
  Check, 
  Sparkles, 
  Share2, 
  CalendarPlus,
  ArrowRight
} from 'lucide-react';
import { ChurchProgram, ChurchEvent } from '../types/church';

interface ProgramsViewProps {
  programs: ChurchProgram[];
  events: ChurchEvent[];
  onRsvpEvent: (eventId: string) => void;
}

export function ProgramsView({ programs, events, onRsvpEvent }: ProgramsViewProps) {
  const [activeTab, setActiveTab] = useState<'programs' | 'events'>('events');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [rsvpSuccessMap, setRsvpSuccessMap] = useState<Record<string, boolean>>({});

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const filteredPrograms = programs.filter((p) => {
    if (selectedDay === 'all') return true;
    return p.dayOfWeek === selectedDay;
  });

  const handleRsvp = (eventId: string) => {
    onRsvpEvent(eventId);
    setRsvpSuccessMap((prev) => ({ ...prev, [eventId]: true }));
    setTimeout(() => {
      setRsvpSuccessMap((prev) => ({ ...prev, [eventId]: false }));
    }, 3000);
  };

  const handleDownloadCalendar = (event: ChurchEvent) => {
    // Generate simple .ics calendar file
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, ' ')}`,
      `LOCATION:${event.location}`,
      `DTSTART:${event.date.replace(/-/g, '')}T090000Z`,
      `DTEND:${event.date.replace(/-/g, '')}T120000Z`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.title.toLowerCase().replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-serif">
            Sanctuary Life & Community Gatherings
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-stone-900 dark:text-stone-100 mt-2 tracking-tight">
            Programs & Events
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-2 text-sm sm:text-base max-w-2xl leading-relaxed">
            Join us for life-transforming worship services, weekly prayer encounters, conferences, youth camps, and benevolent community outreaches.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('events')}
            className={`py-2 px-4 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'events'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Upcoming Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`py-2 px-4 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'programs'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Weekly Activities ({programs.length})
          </button>
        </div>
      </div>

      {/* EVENTS TAB */}
      {activeTab === 'events' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {events.map((evt) => {
              const isRsvpDone = rsvpSuccessMap[evt.id];
              return (
                <div
                  key={evt.id}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  {/* Event Banner */}
                  <div className="relative aspect-16/9 bg-stone-950 overflow-hidden">
                    <img
                      src={evt.bannerImage}
                      alt={evt.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-stone-900/90 text-amber-400 text-xs font-serif uppercase tracking-wider rounded-md backdrop-blur-sm border border-stone-800">
                      {evt.category}
                    </div>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-stone-950/80 text-stone-200 text-xs font-mono rounded backdrop-blur-sm">
                      {evt.attendeesCount} Registered
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span className="font-semibold text-amber-800 dark:text-amber-400">{evt.date}</span>
                        {evt.endDate && <span>to {evt.endDate}</span>}
                        <span>·</span>
                        <span>{evt.time}</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-serif font-semibold text-stone-900 dark:text-stone-100">
                        {evt.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                        {evt.description}
                      </p>

                      {/* Theme verse */}
                      {evt.themeVerse && (
                        <div className="p-3 bg-amber-50/60 dark:bg-stone-850 rounded-xl text-xs font-serif italic text-stone-700 dark:text-stone-300 border border-amber-200/50 dark:border-stone-750">
                          {evt.themeVerse}
                        </div>
                      )}

                      <div className="pt-2 text-xs text-stone-500 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{evt.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>Minister: <strong className="text-stone-700 dark:text-stone-300">{evt.speaker}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
                      <button
                        onClick={() => handleDownloadCalendar(evt)}
                        className="py-2 px-3 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <CalendarPlus className="w-3.5 h-3.5" />
                        <span>Add to Calendar</span>
                      </button>

                      <button
                        onClick={() => handleRsvp(evt.id)}
                        disabled={isRsvpDone}
                        className={`py-2 px-4 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isRsvpDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900'
                        }`}
                      >
                        {isRsvpDone ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>RSVP Confirmed!</span>
                          </>
                        ) : (
                          <>
                            <span>Reserve Seat / RSVP</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEKLY PROGRAMS TAB */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          {/* Day Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedDay('all')}
              className={`py-1.5 px-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedDay === 'all'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              All Days
            </button>
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`py-1.5 px-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedDay === day
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      {prog.dayOfWeek}
                    </span>
                    {prog.streamingAvailable && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                        <Radio className="w-2.5 h-2.5 animate-pulse" />
                        <span>Live Stream</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100">
                    {prog.title}
                  </h3>

                  <div className="text-xs text-stone-500 space-y-1">
                    <div className="flex items-center gap-2 font-mono font-medium text-stone-700 dark:text-stone-300">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{prog.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span className="truncate">{prog.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-stone-400" />
                      <span>{prog.targetGroup}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed pt-1">
                    {prog.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 flex items-center justify-between">
                  <span>Led by: <strong className="text-stone-700 dark:text-stone-300 font-medium">{prog.leader}</strong></span>
                  <span className="text-amber-700 dark:text-amber-400">Weekly</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
