import React from 'react';
import moment from 'moment';
import { configDefaults } from '../constants/remoteConfigDefaults';
import { firestore } from 'firebase/app';
import FirebaseFirestoreTypes from '@firebase/firestore-types';

export type Query = firestore.Query;
export type Timestamp = firestore.Timestamp;
export type FieldValue = firestore.FieldValue;
export type QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
export type DocumentReference = firestore.DocumentReference;
export type DocumentData = firestore.DocumentData;
export type FirestoreModule = FirebaseFirestoreTypes.FirebaseFirestore;
export type Moment = moment.Moment;

export type StringObj = {
  [key: string]: string;
};

export type Translation = StringObj;

type ValueOf<T> = T[keyof T];

export type MenuItem = {
  label: string;
  filter?: Tags | 'All';
};

export type TabsType = {
  [key: string]: React.ReactElement;
};

export type Unsubscriber = () => void;

export type Redirect = {
  title: string;
  icon: string;
  iconType?: IconTypes;
  page?: string;
  slug: string;
};

export enum AuthorizationStatus {
  NOT_DETERMINED = -1,
  DENIED = 0,
  AUTHORIZED = 1,
  PROVISIONAL = 2,
}

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
export interface TimeOfDayObj {
  name: TimeOfDay;
  headline: string;
  tagline: string;
  btnText: string;
}

export enum Categories {
  Meditate = 'Meditate',
  Move = 'Move',
  Sleep = 'Sleep',
  Learn = 'Learn',
}

const Backgrounds = {
  ...TimeOfDay,
  ...Categories,
};

export type Backgrounds = keyof typeof Backgrounds;

export enum Tags {
  Night = 'night',
  Calm = 'calm',
  Breathing = 'breathing',
  Visualization = 'visualization',
  Meditation = 'meditation',
  Grateful = 'grateful',
  Bedtime = 'bedtime',
  Sleep = 'sleep',
  Insomnia = 'insomnia',
  OuterSpace = 'outer-space',
  Featured = 'featured',
  Focus = 'focus',
  Stress = 'stress',
  Energize = 'energize',
  Rest = 'rest',
  'Yoga Breaks' = 'yoga-breaks',
  'Yoga Classes' = 'yoga-classes',
  Philosophy = 'philosophy',
  History = 'history',
  Morning = 'morning',
  Afternoon = 'afternoon',
  Evening = 'evening',
  Meditate = 'meditate',
  Move = 'move',
  Learn = 'Learn',
  Black = 'black',
  Study = 'study',
  Toddler = 'toddler',
  PreK = 'prek5',
  '6-8' = '68',
  '9-12' = '912',
}

//export type Tags = keyof typeof Tags;
// export type Tags = ValueOf<tags>;

export type IconTypes =
  | 'Feather'
  | 'FontAwesome5'
  | 'MaterialCommunityIcons'
  | 'FontAwesome5'
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'FontAwesome'
  | 'Foundation'
  | 'Ionicons'
  | 'MaterialCommunityIcons'
  | 'MaterialIcons'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial';

export type Icon = {
  type: IconTypes;
  active?: string;
  inactive: string;
};

export type Tab = {
  label: string;
  icon?: string;
};

export type Category = {
  title: string;
  tag: Tags | undefined;
  description?: string;
  image?: string;
  icon?: string;
  slug?: string;
  iconType?: IconTypes;
};

export interface CategoryObj {
  [key: string]: Category;
}

export interface Feature extends Category {
  'title-es': string;
  'description-es': string;
}

export enum ContentStatus {
  Published = 'published',
  Draft = 'draft',
}

export interface LocalUser {
  id?: string;
  // name: string;
  // birthday: string;
  language: Languages;
  updated_at?: Date;
}

export interface LocalContent {
  content: ContentObj;
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

export type PlanTypes = 'iosIap' | 'promoCode' | 'android' | 'stripe';

type UserPlanBase = {
  type: PlanTypes;
  auto_renew_status: boolean;
  nextRenewalDate: string; // Just storing so humans can easily read it in database
  nextRenewalUnix: number; // unix timestamp
  canceledAtUnix?: number;
  planId: string;
  status: 'canceled' | 'active' | 'trialing' | 'pending';
  stripeEvents?: string[];
  orderId?: string;
};

// For use when saving to Firebase
export interface UserPlan extends UserPlanBase {
  createdAt: Date;
}

// For use when getting from Firebase
export interface FbUserPlan extends UserPlanBase {
  createdAt: Timestamp;
}

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

export interface LoggedOutUser {
  language: Languages;
}
export interface User {
  id?: string;
  email?: string;
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
  plan?: UserPlan | FbUserPlan;
  isAdmin?: boolean;
  updated_at?: Date;
  platform?: Platforms;
  promptedNotification?: boolean;
}

export interface DefaultState {
  user?: User;
  translation: Translation;
  activePlan: boolean;
  loading: boolean;
}

export type EditableUserFields = Partial<Pick<User, 'name' | 'actions'>>;

export type Filter = Tags | TimeOfDay | Categories;

export interface Filters {
  tags?: Filter[];
  teacher?: Teachers;
  language?: Languages;
  search?: string;
  type?: Categories;
}

export type Sortings =
  | 'oldest'
  | 'newest'
  | 'priority'
  | 'shortest'
  | 'longest'
  | 'mostFavorited'
  | 'popular'
  | 'alphabetical'
  | 'alphabeticalReverse';

export interface Content {
  id: string;
  title: string;
  video: string;
  video_orientation: 'landscape' | 'portrait';
  thumbnail: string;
  description: string;
  teacher: Teacher;
  type: Categories;
  tags: Filter[];
  seconds: number;
  length: string;
  language: Languages;
  status: ContentStatus;
  priority?: string;
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
  name: Teachers;
  bio: string;
  photo: string;
  language: Languages;
  updated_at: Timestamp;
}

export interface AllTeachers {
  [key: string]: Teacher;
}

export interface UserProfile {
  language?: Languages;
  promptedNotification?: boolean;
  updated_at?: Timestamp;
}

export interface NewAccount {
  email: string;
  password: string;
  language: Languages;
}

export interface InitialUserDoc {
  id: string;
  email: string;
  language: Languages | string;
  platform: Platforms;
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

export interface PlaysObj {
  [id: string]: PlayEvent;
}

export interface ObserveNotificationsType {
  requestPermissions(): Promise<void>;
  saveTokenToDatabase(token: string): Promise<void>;
  subscribe(): Promise<void>;
  unsubscribe(): void;
  setNotificationPrompted(): Promise<void>;
}

export type Action<K, V = void> = V extends void
  ? { type: K }
  : { type: K } & V;

export interface ObserveUserServiceType {
  subscribe(): void;
  unsubscribe(): void;
}

export interface UserContent {
  favs?: Favorite[];
  history?: PlayEvent[];
}

export type SetUserContent = (userContent: UserContent) => void;
export interface ObserveContentServiceType {
  historyQuery: Query;
  favsQuery: Query;
}

export type Favorite = {
  contentId: string;
  favorited: boolean;
  platform: Platforms;
  createdAt: Timestamp;
  updatedAt: Date;
};

export type FavoritesObj = { [key: string]: Favorite };

// Used to import old fav style in CurrentUser to full subcollection
export type FavoritesObjPartial = {
  [key: string]: { updatedAt: Date; favorited: boolean };
};

export interface FavoritesServiceType {
  query: Query;
  toggle(id: string): Promise<void>;
  get(): Promise<FavoritesObj>;
  isFavorited(id: string): Promise<boolean>;
  import(favs: FavoritesObjPartial): Promise<void>;
}

export interface AnalyticsServiceType {
  getTotals(): Promise<TotalsMap>;
  updateTotals(): Promise<void>;
  addWeek(dateStr: string): Promise<void>;
  get(): Promise<Week[]>;
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
  checkError(err: firebase.FirebaseError): Error;
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
  setContent(newContent: ContentObj): Promise<void>;
  getUser(): Promise<LocalUser>;
  removeStorage(key: string): Promise<void>;
}

export interface ContentServiceType {
  buildContent(doc: QueryDocumentSnapshot): Content | null;
  getFeatures(category: Categories, contentObj: ContentObj): Content[];
  getContentfromDb(): Promise<ContentObj>;
  getContentContext(): Promise<ContentObj>;
  getLatestUpdate(): Promise<Date>;
  // favsQuery: Query;
  // playsQuery: Query;
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
  buildTeacher(doc: QueryDocumentSnapshot): Teacher;
  findTeacherByName(name: string): Promise<Teacher | void>;
  getAll(): Promise<AllTeachers>;
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

export type RemoteConfigValues = keyof typeof configDefaults;
export interface RemoteConfigServiceType {
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

// WEB ONLY
export interface LocationState {
  [key: string]: any;
}

export type PlatformStat = {
  total: number;
  ios: number;
  android: number;
  web: number;
};

export interface SubsStat extends PlatformStat {
  promoCode: number;
}

export type StatObj = { [key: string]: PlatformStat | SubsStat };

export type TotalStats = {
  users: number;
  activeSubs: SubsStat;
  updatedAt: Timestamp;
};

export type TotalsMap = {
  users: number;
  totalActive: number;
  totalPaid: number;
  ios: number;
  android: number;
  web: number;
  promoCode: number;
  updatedAt: string;
};
export interface Week {
  id: string;
  year: number;
  isoWeek: number;
  startDate: string;
  endDate: string;
  signups: PlatformStat;
  newSubs: SubsStat;
  cancellations: SubsStat;
  plays: PlatformStat;
  completions: PlatformStat;
  favs: PlatformStat;
}
