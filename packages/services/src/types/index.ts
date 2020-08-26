import React from 'react';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

export type Translations = { [key: string]: string };

enum SubStatus {
  Canceled = 'canceled',
  Active = 'active',
  Trial = 'trialed',
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

export enum Categories {
  Meditate = 'Meditate',
  Move = 'Move',
  Sleep = 'Sleep',
  Learn = 'Learn',
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

export enum ContentStatus {
  Published = 'published',
  Draft = 'draft',
}

export type Action = {
  favorited: boolean;
};

export interface User {
  id: string;
  name: string;
  email: string;
  birthday: string;
  language: Languages;
  subStatus: SubStatus;
  actions: { [key: string]: Action };
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
  updated_at: typeof firestore.Timestamp;
  created_at: Date; //typeof firestore.Timestamp;
}

export interface Teacher {
  id: string;
  name: string; //Teachers;
  bio: string;
  photo: string;
}

export interface AllTeachers {
  [key: Teachers]: Teacher;
}

export interface UserProfile {
  name?: string;
  birthday?: string;
  language?: Languages;
}

export interface NewAccount {
  email: string;
  password: string;
  name?: string;
  birthday: string;
  language: Languages;
  // translation: Translations;
}

export interface ContentServiceType {
  buildContent(doc: FirebaseFirestoreTypes.QueryDocumentSnapshot): Content;
  getContent(): Promise<Content[]>;
}

export interface UpdateUserServiceType {
  favorite(id: string, contentId: string, isFav: boolean): Promise<void>;
  updateProfile(id: string, fields: UserProfile): Promise<void>;
}

export interface TeacherServiceType {
  buildTeacher(doc: FirebaseFirestoreTypes.QueryDocumentSnapshot): Teacher;
  findTeacherByName(name: string): Teacher;
  getAllTeachers(): Promise<AllTeachers>;
}
