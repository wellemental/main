export type IapValidate = {
  receipt: any;
  productId: string;
};

export enum PlanId {
  Monthly = 'wellemental_pro',
  Yearly = 'wellemental_pro_year',
  Free = 'free',
}

export type UserPlan = {
  type: 'iosIap' | 'promoCode';
  auto_renew_status: boolean;
  nextRenewalDate: string; // Just storing so humans can easily read it in database
  nextRenewalUnix: number; // unix timestamp
  canceledAtUnix?: number;
  planId: string;
  status: 'canceled' | 'active' | 'trialing' | 'pending';
  createdAt: Date;
  stripeEvents?: string[];
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

export type McTags = 'Pro' | 'Lead';
