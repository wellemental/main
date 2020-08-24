import * as moment from 'moment';
import React from 'react';

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
  subStatus: SubStatus;
  actions: { [key: string]: Action };
}

export interface Content {
  id: string;
  title: string;
  video: string;
  thumbnail: string;
  description: string;
  teacher: Teachers;
  type: Categories;
  seconds: number;
  length: string;
  language: Languages;
  status: ContentStatus;
  updatedAt: moment.Moment;
}

export interface Teacher {
  id: string;
  name: string; //Teachers;
  bio: string;
  photo: string;
}
