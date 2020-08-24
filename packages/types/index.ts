// import * as moment from 'moment';
import React, { Dispatch } from 'react';

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
  Meditation = 'Meditation',
  Movement = 'Movement',
}

export enum ContentStatus {
  Published = 'published',
  Draft = 'draft',
}

export interface Content {
  category: Categories;
  thumbnail: string;
  title: string;
  video: string;
  description: string;
  teacher: Teachers;
  language: Languages;
  length: number;
  status: ContentStatus;
}

export type StackParamList = {
  Home: undefined;
  Content: { contentId: string };
};

export interface Teacher {
  id: string;
  name: string; //Teachers;
  bio: string;
  photo: string;
}

export type TabParamList = {
  Library: undefined;
  Settings: undefined;
  Login: undefined;
};
