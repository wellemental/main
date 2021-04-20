// Dummy content used early on, could delete
import { Content, Languages, ContentStatus, Categories } from 'common';
import moment from 'moment';

export const defaultContent: Content[] = [
  {
    created_at: moment(1598432688).toDate(),
    description:
      'Use this practice of releasing stored emotions to help children acknowledge and let go of anger.',
    id: 'keablyp9f2lnep7jm14',
    language: Languages.En,
    length: '3:02',
    seconds: 182,
    status: ContentStatus.Published,
    tags: [
      'anger',
      'anxiety',
      'feelings',
      'emotions',
      'short',
      'guided',
      'meditation',
      'kids',
    ],
    teacher: 'Nicole',
    thumbnail:
      'https://storage.googleapis.com/dev-wellemental.appspot.com/content/keablyp9f2lnep7jm14/thumbnail/anger_mangement_thumb1.png',
    title: 'Anger Management',
    type: Categories.Meditate,
    updated_at: moment(1598432688).unix(),
    video:
      'https://storage.googleapis.com/dev-wellemental.appspot.com/content/keablyp9f2lnep7jm14/video/angermanagementmeditationenglish.mp4',
    video_orientation: 'landscape',
  },
  {
    created_at: moment(1598432357).toDate(),
    description: 'Lorem ipsum stuff and things oh yeah fur sure I love it.',
    id: 'ke7ladhw7swori5rjfw',
    language: Languages.En,
    length: '5:00',
    seconds: 300,
    status: ContentStatus.Published,
    tags: ['Move', 'Meditate', 'Morning', 'Afternoon', 'Featured'],
    teacher: 'Nicole',
    thumbnail:
      'https://storage.googleapis.com/dev-wellemental.appspot.com/content/ke7ladhw7swori5rjfw/thumbnail/hqdefault.jpg',
    title: 'Title 1',
    type: 'Move',
    updated_at: { _seconds: 1598432357 },
    video:
      'https://storage.googleapis.com/dev-wellemental.appspot.com/content/ke7ladhw7swori5rjfw/video_file/1596064194312.mp4',
    video_orientation: undefined,
  },
  {
    created_at: moment(1598382396).toDate(),
    description:
      'Help kids ground any nervous or anxious energy through this simple awareness practice of body and breath.',
    id: 'keaalivp4lbwujz79z.g',
    language: Languages.En,
    length: '3:04',
    seconds: 184,
    status: ContentStatus.Published,
    tags: [
      'anxiety',
      'worry',
      'stress',
      'nervous',
      'meditation',
      'short',
      'guided',
      'kids',
      'calm',
      'Featured',
    ],
    teacher: 'Melissa',
    thumbnail:
      'https://storage.googleapis.com/dev-wellemental.appspot.com/content/keaalivp4lbwujz79z.g/thumbnail/anxiety_english_thumb1.png',
    title: 'Anxiety Meditation',
    type: Categories.Meditate,
    updated_at: { _nanoseconds: 716000000, _seconds: 1598382396 },
    video:
      'https://storage.googleapis.com/dev-wellemental.appspot.com/content/keaalivp4lbwujz79z.g/video/meditationforanxiety.mp4',
    video_orientation: 'landscape',
  },
  {
    created_at: moment(1598382374).toDate(),
    description:
      'Play this gentle body scan before bed to help kids relax each part of their body. Visualized with a slow sunset.',
    id: 'keabghfn86pi4q8a718',
    language: Languages.En,
    length: '3:20',
    seconds: 200,
    status: ContentStatus.Published,
    tags: [
      'anxiety',
      'sleep',
      'nighttime',
      'meditation',
      'short',
      'guided',
      'body',
      'body scan',
      'relaxation',
    ],
    teacher: 'Nicole',
    thumbnail:
      'https://storage.googleapis.com/dev-wellemental.appspot.com/content/keabghfn86pi4q8a718/thumbnail/igsleepbodyscanenglishthumb.png',
    title: 'Sleepy Body Scan Meditation',
    type: Categories.Meditate,
    updated_at: { _nanoseconds: 510000000, _seconds: 1598382374 },
    video:
      'https://storage.googleapis.com/dev-wellemental.appspot.com/content/keabghfn86pi4q8a718/video/igsleepbodyscanenglish.mov',
    video_orientation: 'portrait',
  },
  {
    created_at: moment(1598381860).toDate(),
    description: 'Lorem ipsum stuff and things number two.',
    id: 'ke7lncbemd6da1xcgqo',
    language: Languages.En,
    length: '6:41',
    seconds: 401,
    status: ContentStatus.Published,
    tags: ['Sleep', 'Evening', 'Calm', 'Afternoon', 'Morning'],
    teacher: 'Nicole',
    thumbnail:
      'https://storage.googleapis.com/dev-wellemental.appspot.com/content/ke7lncbemd6da1xcgqo/thumbnail/hqdefault.jpg',
    title: 'Title 2 Fur Sure',
    type: Categories.Meditate,
    updated_at: { _nanoseconds: 905000000, _seconds: 1598381860 },
    video:
      'https://storage.googleapis.com/dev-wellemental.appspot.com/content/ke7lncbemd6da1xcgqo/video_file/ezgif.com-gif-to-mp4.mp4',
    video_orientation: undefined,
  },
];
