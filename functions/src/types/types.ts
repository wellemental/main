import * as firebase from 'firebase-admin';

export type Timestamp = firebase.firestore.Timestamp;
export type FieldValue = firebase.firestore.FieldValue;

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

export type UserPlan = {
  type: 'iosIap' | 'promoCode' | 'android' | 'stripe';
  auto_renew_status: boolean;
  nextRenewalDate: string; // Just storing so humans can easily read it in database
  nextRenewalUnix: number; // unix timestamp
  canceledAtUnix?: number;
  planId: string;
  status: 'canceled' | 'active' | 'trialing' | 'pending';
  createdAt: Date;
  stripeEvents?: string[];
  orderId?: string;
};

export interface User {
  plan: UserPlan;
}

export type Product = {
  bundleId: string;
  expirationDate: FirebaseFirestore.Timestamp;
  originalTransactionId: string;
  productId: PlanId;
  quantity: number;
  transactionId: string;
};

export type ReceiptIap = {
  userId: string;
  receipt: string;
  verified: boolean;
  products: Product[];
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

export type PlayEvent = {
  contentId: string;
  completed?: boolean;
  createdAt: Timestamp;
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

export type Favorite = {
  contentId: string;
  favorited: boolean;
  createdAt: Timestamp;
  updatedAt: Date;
};
