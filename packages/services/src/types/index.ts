import defaultValues from '../services/RemoteConfigDefaults';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { FirebaseError } from 'firebase';

export type Timestamp = FirebaseFirestoreTypes.Timestamp;
export type FieldValue = FirebaseFirestoreTypes.FieldValue;
export type Query = FirebaseFirestoreTypes.Query;
export type QueryDocumentSnapshot = FirebaseFirestoreTypes.QueryDocumentSnapshot;
export type Translation = { [key: string]: string };
export type AuthorizationStatus = FirebaseMessagingTypes.AuthorizationStatus;

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
  tag: Tags | TimeOfDay | Category | string;
  image: string;
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
  totalPlays: number | FieldValue;
  totalCompleted: number | FieldValue;
  totalSeconds: number | FieldValue;
  streak: number | FieldValue;
  firstPlay?: Date;
  lastPlay?: Date;
  stripeId?: string;
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
  totalPlays?: number | FieldValue;
  totalCompleted?: number | FieldValue;
  totalFavorites?: number | FieldValue;
  updated_at: Timestamp;
  created_at: Timestamp; //typeof Timestamp;
}

export interface ContentObj {
  [key: string]: Content;
}

export interface Teacher {
  id: string;
  name: string; //Teachers;
  bio: string;
  photo: string;
  language: Languages;
  updated_at: Timestamp;
}

export interface AllTeachers {
  [key: Teachers]: Teacher;
}

export interface UserProfile {
  // name?: string;
  // birthday?: string;
  language?: Languages;
  updated_at?: Timestamp;
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

export interface ObserveNotificationsType {
  requestPermissions(): Promise<void>;
  saveTokenToDatabase(token: string): Promise<void>;
  subscribe(): Promise<void>;
  unsubscribe(): void;
}

export interface PlaysServiceType {
  query: Query;
  add(id: string): Promise<void>;
  complete(id: string, duration: number): Promise<void>;
  get(): Promise<PlaysObj | PlayEvent[]>;
}

export interface AuthServiceType {
  checkExistingLogins(email: string): Promise<string[]>;
  login(email: string, password: string): Promise<void>;
  signup(account: NewAccount): Promise<void>;
  checkError(err: FirebaseError): Error;
  logout(): Promise<void>;
}

export interface LocalStateServiceType {
  resetStorage(): Promise<void>;
  setStorage(
    key: string,
    value: string | { [key: string]: string } | LocalUser | UserProfile,
  ): Promise<void>;
  getStorage(key: string): Promise<string>;
  getContent(): Promise<LocalContent>;
  getUser(): Promise<LocalUser>;
  removeStorage(key: string): Promise<void>;
}

export interface ContentServiceType {
  buildContent(doc: QueryDocumentSnapshot): Content;
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
  buildTeacher(doc: QueryDocumentSnapshot): Teacher;
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

export type EventConfig = {
  enabled: boolean;
  headline: string;
  dayOfWeek: number;
  hour: number;
  minute: number;
  title: string;
  articleId: string;
  url: string;
};

export type Features = {
  title: string;
  'title-es': string;
  categories: Feature[];
  event: EventConfig;
};

export type VersionConfig = {
  version: string;
  build: number;
  forceUpgrade: boolean;
  iosUrl: string;
  androidUrl: string;
  upgradeForceTitle: string;
  upgradeForceBody: string;
};

export interface ConfigDefaults {
  featured: Features;
  version: VersionConfig;
}
