import defaultValues from '../services/RemoteConfigDefaults';
import { firestore } from 'firebase/app';
import FirebaseFirestoreTypes from '@firebase/firestore-types';

export type Translation = { [key: string]: string };
export type Query = firestore.Query;
export type Timestamp = firestore.Timestamp;
export type FieldValue = firestore.FieldValue;
export type QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
export type FirestoreModule = FirebaseFirestoreTypes.FirebaseFirestore;

enum SubStatus {
  Canceled = 'canceled',
  Active = 'active',
  Trial = 'trialing',
  Unpaid = 'unpaid',
  Incomplete = 'incomplete',
  Incomplete_Expired = 'incomplete_expired',
  Past_Due = 'past_due',
}

export enum Teachers {
  Mike = 'Mike Doe',
  Nicole = 'Nicole Cardoza',
  Steph = 'Steph Roe',
}

export enum Languages {
  En = 'English',
  Es = 'Español',
}

export enum TimeOfDay {
  Morning = 'Morning',
  Afternoon = 'Afternoon',
  Evening = 'Evening',
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

export type Category = {
  title: string;
  description: string;
  tag: Tags | TimeOfDay | Category;
  image: string;
  slug?: string;
};

export interface Feature extends Category {
  'title-es': string;
  'description-es': string;
}

export enum Categories {
  Meditate = 'Meditate',
  Move = 'Move',
  Sleep = 'Sleep',
  Learn = 'Learn',
}

// export type Categories = Partial<
//   Pick<Tags, Tags.Meditate | Tags.Move | Tags.Sleep | Tags.Learn>
// >;

export enum ContentStatus {
  Published = 'published',
  Draft = 'draft',
}

export type Favorite = {
  favorited: boolean;
  updated_at: Date;
};

export interface LocalUser {
  id?: string;
  // name: string;
  // birthday: string;
  language: Languages;
  updated_at?: Date;
}

export interface LocalContent {
  content: ContentObj;
  teachers: AllTeachers;
  updated_at?: Date;
}

export type Unsubscriber = () => void;

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
  nextRenewalDate: string;
  nextRenewalUnix: number; // unix timestamp
  canceledAtUnix?: number;
  planId: string;
  status: 'canceled' | 'active' | 'trialing' | 'pending';
};

type Product = {
  bundleId: string;
  expirationDate: number;
  originalTransactionId: string;
  productId: PlanId;
  quantity: number;
  transactionId: string;
};

type ReceiptIap = {
  userId: string;
  receipt: string;
  verified: boolean;
  products: Product[];
  timestamp: number;
};

export interface User {
  email?: string;
  id?: string;
  language: Languages;
  stripeId?: string;
  subStatus?: SubStatus;
  totalPlays: number | FieldValue;
  totalCompleted: number | FieldValue;
  totalSeconds: number | FieldValue;
  streak: number | FieldValue;
  firstPlay?: Date;
  lastPlay?: Date;
  favorites?: { [key: string]: Favorite };
  plan?: UserPlan;
  updated_at?: Date;
}

// export type EditableUserFields = Partial<Pick<User, 'name' | 'actions'>>;

export interface Content {
  id: string;
  title: string;
  video: string;
  video_orientation: 'landscape' | 'portrait';
  thumbnail: string;
  description: string;
  teacher: Teachers;
  type: Categories;
  tags?: Tags[] | string[];
  seconds: number;
  length?: string;
  language: Languages;
  status: ContentStatus;
  totalPlays?: number | FieldValue;
  totalCompleted?: number | FieldValue;
  totalFavorites?: number | FieldValue;
  updated_at: Timestamp;
  created_at: Timestamp;
}

export interface ContentObj {
  [key: string]: Content;
}

export interface Teacher {
  id: string;
  name: Teachers;
  bio: string;
  photo: string;
  language: Languages;
  updated_at: firestore.Timestamp;
}

export interface AllTeachers {
  [key: string]: Teacher;
}

export interface UserProfile {
  // name?: string;
  // birthday?: string;
  language?: Languages;
  updated_at?: firestore.Timestamp;
}

export interface NewAccount {
  email: string;
  password: string;
  // name: string;
  // birthday: string;
  language: Languages;
}

export interface InitialUserDoc {
  id: string;
  email: string;
  // name: string;
  // birthday: string;
  language: Languages | string;
}

export type DownloadResult = {
  jobId: number; // The download job ID, required if one wishes to cancel the download. See `stopDownload`.
  statusCode: number; // The HTTP status code
  bytesWritten: number; // The number of bytes written to the file
};

export type DownloadProgressCallbackResult = {
  jobId: number; // The download job ID, required if one wishes to cancel the download. See `stopDownload`.
  contentLength: number; // The total size in bytes of the download resource
  bytesWritten: number; // The number of bytes written to the file so far
};

export type PlayEvent = {
  contentId: string;
  completed?: boolean;
  createdAt: Timestamp;
};

export interface PlaysObj {
  [id: string]: PlayEvent;
}

export interface PlaysServiceType {
  query: Query;
  add(id: string): Promise<void>;
  complete(id: string, duration: number): Promise<void>;
  get(): Promise<PlaysObj | PlayEvent[]>;
}

export interface ContentServiceType {
  buildContent(doc: firestore.QueryDocumentSnapshot): Content;
  getContent(): Promise<ContentObj>;
  getLatestUpdate(): Promise<Date>;
}

export type PromoCode = {
  id: string;
  code: string;
  limit: number;
  used: number;
};

export interface PromoCodeServiceType {
  validateCode(code: string): Promise<PromoCode | void>;
  upgradeUser(userId: string, code: string): Promise<void>;
  validateAndUpgrade(userId: string, code: string): Promise<void>;
}

export interface DownloadVideoServiceType {
  downloadVideo(
    videoUrl: string,
  ): Promise<void | { jobId: number; promise: Promise<DownloadResult> }>;
  getVideo(videoUrl: string): Promise<string>;
  deleteVideo(videoUrl: string): Promise<void>;
  checkExists(filename: string): Promise<boolean>;
}

export interface UpdateUserServiceType {
  favorite(id: string, contentId: string, isFav: boolean): Promise<void>;
  updateProfile(id: string, fields: UserProfile): Promise<void>;
  createProfile(account: InitialUserDoc): Promise<void>;
}

export interface TeacherServiceType {
  buildTeacher(doc: firestore.QueryDocumentSnapshot): Teacher;
  findTeacherByName(name: string): Promise<Teacher | void>;
  getAllTeachers(): Promise<AllTeachers>;
  getLatestUpdate(): Promise<Date>;
}

export enum TrackingEvents {
  Login = 'login',
  SignUp = 'sign_up',
  Logout = 'logout',
  PasswordReset = 'password_reset',
  PlayVideo = 'play_video',
  Favorite = 'favorite',
  Unfavorite = 'unfavorite',
  DownloadVideo = 'download_video',
  UndownloadVideo = 'undownload_video',
  AskParentsFail = 'ask_parents_fail',
  AskParentsSucceed = 'ask_parents_succeed',
}

export interface TrackingService {
  track(name: TrackingEvents, params?: { [key: string]: any }): void;
}

export type RemoteConfigValues = keyof typeof defaultValues;
export interface RemoteConfigService {
  getValue<T>(valueName: RemoteConfigValues): Promise<T>;
}

export type Features = {
  title: string;
  categories: Feature[];
  version: string;
  build: number;
  forceUpgrade: boolean;
  iosUrl: string;
  upgradeText: string;
  upgradeForceTitle: string;
  upgradeForceBody: string;
};

export type Version = {
  version: string;
  build: number;
  forceUpgrade: boolean;
  iosUrl: string;
  upgradeText: string;
  upgradeForceTitle: string;
  upgradeForceBody: string;
};

export type TabParamList = {
  Library: { default: string };
  Home: undefined;
  Favorites: undefined;
  Search: undefined;
  Settings: undefined;
};

export type MenuItem = {
  label: string;
  filter?: Tags | 'All';
};

export interface LocationState {
  [key: string]: any;
}
