export type OfferingType = 
  | 'tithe' 
  | 'offering' 
  | 'thanksgiving' 
  | 'building_fund' 
  | 'missions' 
  | 'benevolence' 
  | 'youth_ministry' 
  | 'first_fruits';

export interface OfferingTypeInfo {
  id: OfferingType;
  label: string;
  description: string;
  scriptureReference: string;
  suggestedAccount: string;
}

export interface ChurchBankAccount {
  id: string;
  bankName: string;
  paybillNumber: string;
  accountNumber: string;
  accountName: string;
  branch: string;
  swiftCode: string;
  currency: string;
  description: string;
}

export interface GivingTransaction {
  id: string;
  transactionCode: string; // e.g., SH89DFK201
  mpesaReceiptNumber?: string;
  donorName: string;
  phoneNumber: string;
  email?: string;
  amount: number;
  offeringType: OfferingType;
  bankAccountId: string;
  bankAccountName: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  note?: string;
  paymentMethod: 'mpesa_stk' | 'bank_transfer' | 'card';
  isAnonymous?: boolean;
}

export interface ChurchProgram {
  id: string;
  title: string;
  dayOfWeek: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  venue: string;
  targetGroup: 'All Congregation' | 'Youth & Teens' | 'Women Ministry' | 'Men of Honor' | 'Children';
  description: string;
  leader: string;
  isWeekly: boolean;
  streamingAvailable: boolean;
}

export interface ChurchEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  description: string;
  category: 'Revival' | 'Conference' | 'Community Outreach' | 'Youth Camp' | 'Worship Night' | 'Fellowship';
  speaker: string;
  bannerImage: string;
  registrationOpen: boolean;
  attendeesCount: number;
  themeVerse?: string;
}

export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  preacherRole: string;
  date: string;
  scripture: string;
  series: string;
  duration: string;
  audioUrl?: string;
  videoUrl?: string;
  summary: string;
  fullNotes: string[];
  keyVerses: string[];
  pdfDownloadUrl?: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  album: 'Sunday Worship' | 'Youth Fellowship' | 'Missions & Outreach' | 'Baptisms & Dedications' | 'Sanctuary & Community';
  imageUrl: string;
  date: string;
  uploadedBy: string;
  uploaderRole: 'Admin' | 'Member' | 'Media Team';
  approved: boolean;
  caption: string;
  likes: number;
}

export interface PrayerRequest {
  id: string;
  requesterName: string;
  requesterContact?: string;
  category: 'Healing & Health' | 'Family & Marriage' | 'Finances & Career' | 'Spiritual Growth' | 'Thanksgiving' | 'Other';
  title: string;
  request: string;
  date: string;
  isConfidential: boolean; // if true, only pastoral/admin team sees it
  prayedCount: number;
  adminResponse?: string;
  status: 'active' | 'answered';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Senior Pastor' | 'Church Administrator' | 'Finance Deacon' | 'Media Director';
  avatarUrl?: string;
  createdAt: string;
}
