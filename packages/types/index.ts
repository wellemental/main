// import * as moment from 'moment';

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
