import {
  ChurchProgram,
  ChurchEvent,
  Sermon,
  GalleryPhoto,
  GivingTransaction,
  ChurchBankAccount,
  PrayerRequest,
  AdminUser,
} from '../types/church';
import {
  DEFAULT_PROGRAMS,
  DEFAULT_EVENTS,
  DEFAULT_SERMONS,
  DEFAULT_GALLERY_PHOTOS,
  DEFAULT_TRANSACTIONS,
  CHURCH_BANK_ACCOUNTS,
  DEFAULT_PRAYER_REQUESTS,
  DEFAULT_ADMIN_USERS,
} from '../data/defaultData';

const KEYS = {
  PROGRAMS: 'church_programs_v1',
  EVENTS: 'church_events_v1',
  SERMONS: 'church_sermons_v1',
  GALLERY: 'church_gallery_v1',
  TRANSACTIONS: 'church_transactions_v1',
  BANK_ACCOUNTS: 'church_bank_accounts_v1',
  PRAYERS: 'church_prayers_v1',
  ADMINS: 'church_admins_v1',
  CURRENT_ADMIN: 'church_current_admin_v1',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`Error reading key ${key} from storage:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error writing key ${key} to storage:`, e);
  }
}

export const ChurchStorage = {
  getPrograms: (): ChurchProgram[] => safeGet(KEYS.PROGRAMS, DEFAULT_PROGRAMS),
  savePrograms: (programs: ChurchProgram[]) => safeSet(KEYS.PROGRAMS, programs),

  getEvents: (): ChurchEvent[] => safeGet(KEYS.EVENTS, DEFAULT_EVENTS),
  saveEvents: (events: ChurchEvent[]) => safeSet(KEYS.EVENTS, events),

  getSermons: (): Sermon[] => safeGet(KEYS.SERMONS, DEFAULT_SERMONS),
  saveSermons: (sermons: Sermon[]) => safeSet(KEYS.SERMONS, sermons),

  getGallery: (): GalleryPhoto[] => safeGet(KEYS.GALLERY, DEFAULT_GALLERY_PHOTOS),
  saveGallery: (photos: GalleryPhoto[]) => safeSet(KEYS.GALLERY, photos),

  getTransactions: (): GivingTransaction[] => safeGet(KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS),
  saveTransactions: (txs: GivingTransaction[]) => safeSet(KEYS.TRANSACTIONS, txs),

  getBankAccounts: (): ChurchBankAccount[] => safeGet(KEYS.BANK_ACCOUNTS, CHURCH_BANK_ACCOUNTS),
  saveBankAccounts: (accs: ChurchBankAccount[]) => safeSet(KEYS.BANK_ACCOUNTS, accs),

  getPrayers: (): PrayerRequest[] => safeGet(KEYS.PRAYERS, DEFAULT_PRAYER_REQUESTS),
  savePrayers: (prayers: PrayerRequest[]) => safeSet(KEYS.PRAYERS, prayers),

  getAdmins: (): AdminUser[] => safeGet(KEYS.ADMINS, DEFAULT_ADMIN_USERS),
  saveAdmins: (admins: AdminUser[]) => safeSet(KEYS.ADMINS, admins),

  getCurrentAdmin: (): AdminUser | null => safeGet(KEYS.CURRENT_ADMIN, null),
  setCurrentAdmin: (admin: AdminUser | null) => safeSet(KEYS.CURRENT_ADMIN, admin),

  resetAll: () => {
    try {
      localStorage.removeItem(KEYS.PROGRAMS);
      localStorage.removeItem(KEYS.EVENTS);
      localStorage.removeItem(KEYS.SERMONS);
      localStorage.removeItem(KEYS.GALLERY);
      localStorage.removeItem(KEYS.TRANSACTIONS);
      localStorage.removeItem(KEYS.BANK_ACCOUNTS);
      localStorage.removeItem(KEYS.PRAYERS);
      localStorage.removeItem(KEYS.ADMINS);
      localStorage.removeItem(KEYS.CURRENT_ADMIN);
    } catch (e) {
      console.warn('Error clearing storage:', e);
    }
  },
};
