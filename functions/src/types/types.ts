import * as firebase from 'firebase-admin';

export type Timestamp = firebase.firestore.Timestamp;
export type FieldValue = firebase.firestore.FieldValue;

export type PlatformStat = {
  total: number;
  ios: number;
  android: number;
  web: number;
};

export interface Week {
  id: string;
  year: number;
  isoWeek: number;
  startDate: string;
  endDate: string;
  signups: PlatformStat;
  // activeSubs: number;
  newSubs: PlatformStat;
  cancellations: PlatformStat;
  plays: PlatformStat;
  completions: PlatformStat;
  // seconds: PlatformStat;
  favs: PlatformStat;
}

export type IapValidate = {
  receipt: any;
  productId: string;
};

export type AndroidValidate = {
  sku_id: string;
  purchase_token: string;
  package_name: 'com.wellemental.wellemental';
};

export enum PlanId {
  Monthly = 'wellemental_pro',
  Yearly = 'wellemental_pro_year',
  Free = 'free',
}

export type PlanTypes = 'iosIap' | 'promoCode' | 'android' | 'stripe';

// This type should be separate by type w/ better union type
type UserPlanBase = {
  type: PlanTypes;
  auto_renew_status: boolean;
  nextRenewalDate: string | null; // Just storing so humans can easily read it in database - null could be removed, didn't have time to test if IAP always delivered a expirateUnix
  nextRenewalUnix: number; // unix timestamp
  startDate: string | null; // Just storing so humans can easily read it in database - null could be removed, didn't have time to test if IAP always delivered a startUnix
  startUnix: number; // unix timestamp
  lastVerified: string; // Last time a function validated it's active state
  canceledAtUnix?: number;
  planId: string; // Sku or product id
  status: 'canceled' | 'active' | 'trialing' | 'pending';
  stripeEvents?: string[];
  orderId?: string;
  code?: string;
  purchaseToken?: string; // For Android validation
  packageName?: string; // For Android validation
};

// For use when saving to Firebase
export interface UserPlan extends UserPlanBase {
  createdAt: Date;
}

// For use when getting from Firebase
export interface FbUserPlan extends UserPlanBase {
  createdAt: Timestamp;
}

export interface User {
  id: string;
  email: string;
  plan: UserPlan | FbUserPlan;
  created_at: Timestamp;
  platform: Platforms;
  language: Languages;
  totalPlays: number | FieldValue;
  totalCompleted: number | FieldValue;
  totalSeconds: number | FieldValue;
  streak: number | FieldValue;
  firstPlay?: Date;
  lastPlay?: Date;
  isAdmin?: boolean;
  fcmTokens?: [string]
}

export type IapPurchase = {
  bundleId: string;
  transactionId: string;
  productId: string;
  purchaseDate: number;
  quantity: number;
  expirationDate: number;
  isTrialPeriod?: boolean; // only for subscriptions and if extented = true
  isInIntroOfferPeriod?: boolean; // only for subscriptions and if extented = true, since v1.5.1
  environment?: string; // only if extented = true
  originalPurchaseDate?: number; // only if extented = true
  applicationVersion?: string; // only if extented = true
  originalApplicationVersion?: string; // only if extented = true
};

export type Product = {
  bundleId: string;
  expirationDate: FirebaseFirestore.Timestamp;
  originalTransactionId: string;
  productId: PlanId;
  purchaseDate: number;
  quantity: number;
  transactionId: string;
};

export type ReceiptIap = {
  userId: string;
  receipt: string;
  verified: boolean;
  products: Product[] | IapPurchase[];
  timestamp: number;
  timestampDate: Date;
  environment: 'sandbox' | 'production';
};

export enum SubStatus {
  Canceled = 'canceled',
  Active = 'active',
  Trial = 'trialing',
  Unpaid = 'unpaid',
  Incomplete = 'incomplete',
  Incomplete_Expired = 'incomplete_expired',
  Past_Due = 'past_due',
}

export type StripeEvent = {
  id: string;
  type: string;
  created: number;
  cancel_at: number;
  current_period_end: string | null;
  current_period_end_unix: number;
  cancel_at_date: string | null;
  cancel_at_period_end: boolean;
  customer: string;
  subId: string;
  status: SubStatus;
  priceId: string;
  pricePaid: number;
  trialPeriodLength: number;
  trial_end: string | null;
};

export type McTags = 'Pro' | 'Lead';

export enum Teachers {
  Mike = 'Mike Doe',
  Nicole = 'Nicole Cardoza',
  Steph = 'Steph Roe',
}

export interface Teacher {
  id: string;
  name: string; //Teachers;
  bio: string;
  photo: string;
  language: 'English' | 'Español';
  updated_at?: Timestamp;
}

export enum Languages {
  En = 'English',
  Es = 'Español',
}

export enum ContentStatus {
  Published = 'published',
  Draft = 'draft',
}

export enum Tags {
  Morning = 'Morning',
  Afternoon = 'Afternoon',
  Night = 'Night',
  Evening = 'Evening',
  Calm = 'Calm',
  Breathing = 'Breathing',
  Visualization = 'Visualization',
  Meditation = 'Meditation',
  Grateful = 'Grateful',
  Bedtime = 'Bedtime',
  Insomnia = 'Insomnia',
  OuterSpace = 'Outer Space',
  Meditate = 'Meditate',
  Move = 'Move',
  Sleep = 'Sleep',
  Learn = 'Learn',
  Featured = 'Featured',
  Toddler = 'toddler',
  PreK = 'PreK-5',
  '6-8' = '6-8',
  '9-12' = '9-12',
}

export enum Categories {
  Meditate = 'Meditate',
  Move = 'Move',
  Sleep = 'Sleep',
  Learn = 'Learn',
}

export interface Content {
  id: string;
  title: string;
  video: string;
  video_orientation: 'landscape' | 'portrait';
  thumbnail: string;
  description: string;
  teacher: Teachers;
  type: Categories;
  tags: Tags[] | string[];
  seconds: number;
  length: string;
  language: Languages;
  status: ContentStatus;
  totalPlays?: number | FieldValue;
  totalCompleted?: number | FieldValue;
  totalFavorites?: number | FieldValue;
  priority?: number;
  updated_at?: Timestamp;
  created_at: Timestamp; //typeof Timestamp;
}

export enum Platforms {
  Android = 'android',
  iOS = 'ios',
  Web = 'web',
  Mac = 'macos',
  Windows = 'windows',
}

export type PlayEvent = {
  contentId: string;
  completed?: boolean;
  platform: Platforms;
  createdAt: Timestamp;
};

export type Favorite = {
  contentId: string;
  favorited: boolean;
  platform: Platforms;
  createdAt: Timestamp;
  updatedAt: Date;
};
