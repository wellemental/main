const palette: Palette = {
  teal: '#214f4b', // Teal  rgba(33,79,75,1)
  blurple: '#2A2968',
  sage: '#A3CEC9',
  salmon: '#d9534f', // salmon #D09932
  mustard: '#CAAB29', // mustard '#CAAB29',
  tangerine: '#C78D36', // '#dfbead',
  pink: '#dfbead',
  skyBlue: '#dde2e6',
  offWhite: '#ccc', //'#F4E6D0',
  white: '#ffffff',
  gray: 'rgba(0,0,0,0.6)',
  lightGray: 'rgba(0, 0, 0, 0.4)',
  darkGray: 'rgba(0, 0, 0, 0.87)',
};

export default palette;

export interface Palette {
  [key: string]: string;
}

export enum PaletteColors {
  Teal = 'teal',
  Blurple = 'blurple',
  Sage = 'sage',
  Salmon = 'salmon',
  Mustard = 'mustard',
  Tangerine = 'tangerine',
  lightGray = 'lightGray',
  Pink = 'pink',
  OffWhite = 'offwhite',
  White = 'white',
  Gray = 'gray',
  LightGray = 'lightGray',
  DarkGray = 'darkGray',
}
