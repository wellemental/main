import defaultValues from '../services/RemoteConfigDefaults';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type Translations = { [key: string]: string };

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
}

export type Category = {
  title: string;
  description: string;
  tag: Tags | TimeOfDay | Category;
  image: string;
};

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
  content: Content[];
  teachers: AllTeachers;
  updated_at?: Date;
}

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
  nextRenewelDate: Date;
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
  // name: string;
  // birthday: string;
  language: Languages;
  subStatus?: SubStatus;
  favorites?: { [key: string]: Favorite };
  plan?: UserPlan;
  updated_at?: Date;
}

export type EditableUserFields = Partial<Pick<User, 'name' | 'actions'>>;

export interface Content {
  id: string;
  title: string;
  video: string;
  video_orientation: 'landscape' | 'portrait';
  thumbnail: string;
  description: string;
  teacher: Teachers | string;
  type: Categories;
  tags: Tags[] | string[];
  seconds: number;
  length: string;
  language: Languages;
  status: ContentStatus;
  updated_at: FirebaseFirestoreTypes.Timestamp;
  created_at: FirebaseFirestoreTypes.Timestamp; //typeof firestore.Timestamp;
}

export interface Teacher {
  id: string;
  name: string; //Teachers;
  bio: string;
  photo: string;
  language: Languages;
  updated_at: FirebaseFirestoreTypes.Timestamp;
}

export interface AllTeachers {
  [key: Teachers]: Teacher;
}

export interface UserProfile {
  // name?: string;
  // birthday?: string;
  language?: Languages;
  updated_at?: FirebaseFirestoreTypes.Timestamp;
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

export interface ContentServiceType {
  buildContent(doc: FirebaseFirestoreTypes.QueryDocumentSnapshot): Content;
  getContent(): Promise<Content[]>;
  getLatestUpdate(): Promise<Date>;
}

type PromoCode = {
  id: string;
  code: string;
  limit: number;
  used: number;
};

export interface PromoCodeServiceType {
  validateCode(code: string): Promise<PromoCode>;
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
  buildTeacher(doc: FirebaseFirestoreTypes.QueryDocumentSnapshot): Teacher;
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
  categories: Category[];
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
