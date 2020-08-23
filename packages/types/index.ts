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

export interface Content {
  category: Categories;
  thumbnail: string;
  title: string;
  video: string;
  description: string;
  teacher: Teachers;
  language: Languages;
}

export type StackParamList = {
  Home: undefined;
  Content: { contentId: string };
};

export interface Teacher {
  id: string;
  name: string; //Teachers;
  bio: string;
}

export type TabParamList = {
  Library: undefined;
  Settings: undefined;
  Login: undefined;
};
