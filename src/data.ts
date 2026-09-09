import { ProgramItem, ColorSwatch, GalleryPhoto } from './types';

export const WEDDING_DATE = new Date('2026-10-25T10:00:00+03:00'); // Sunday, October 25, 2026 (East Africa Time)

export const WEDDING_DETAILS = {
  couple: {
    bride: 'Venessa',
    groom: 'Philemon',
    brideFull: 'Venessa Kerubo',
    groomFull: 'Philemon Araka',
    nickname: 'VeeAndPhil',
    featureHeadline: 'Two walking together in faith and love',
  },
  families: {
    brideFamily: 'The Family of Venessa Kerubo',
    groomFamily: 'The Family of Philemon Araka',
    invitationMessage: 'With grateful hearts and our families’ blessings, together with our parents, we joyfully invite you to celebrate our holy matrimony as Venessa & Philemon unite as one.'
  },
  ceremony: {
    time: '10:00 a.m. (Arrival 9:15 a.m.)',
    venue: 'Nairobi South SDA',
    address: 'Nairobi South, Nairobi, Kenya',
    coordinates: { lat: -1.3125, lng: 36.8378 },
    mapEmbedUrl: 'https://maps.google.com/maps?q=Nairobi+South+SDA+Church,+Nairobi,+Kenya&t=&z=16&ie=UTF8&iwloc=&output=embed',
  },
  reception: {
    time: '1:00 p.m. Onwards',
    venue: 'KAFOCA-Mukuru Studyville',
    address: 'Mukuru, Nairobi, Kenya',
    coordinates: { lat: -1.3188, lng: 36.8722 },
    mapEmbedUrl: 'https://maps.google.com/maps?q=KAFOCA+Mukuru+Studyville,+Nairobi,+Kenya&t=&z=16&ie=UTF8&iwloc=&output=embed',
  },
  dressCode: {
    theme: 'Burgundy and Navy Blue',
    guideline: 'Burgundy & Navy Blue Elegance',
    kidsNote: 'With love for all our little ones, we kindly request that our wedding and reception be celebrated in joyful presence.'
  },
  bibleVerses: [
    {
      text: 'Can two walk together, except they be agreed?',
      reference: 'Amos 3:3',
    },
    {
      text: 'Two are better than one; because they have a good reward for their labour.',
      reference: 'Ecclesiastes 4:9',
    }
  ]
};

export const PROGRAM_ITEMS: ProgramItem[] = [
  {
    time: '9:15 AM - 9:50 AM',
    duration: '35 mins',
    title: 'Arrival & Ushering of Guests',
    isChurch: true,
  },
  {
    time: '10:00 AM - 11:45 AM',
    duration: '1 hr 45 mins',
    title: 'Wedding Ceremony & Holy Matrimony',
    description: 'Nuptial worship and vows exchange at Nairobi South SDA Church.',
    isChurch: true,
  },
  {
    time: '11:45 AM - 12:30 PM',
    duration: '45 mins',
    title: 'Church Photo Session & Congratulatory Greetings',
    isChurch: true,
  },
  {
    time: '12:30 PM - 1:00 PM',
    duration: '30 mins',
    title: 'Procession to Reception Venue',
    isChurch: false,
  },
  {
    time: '1:00 PM - 2:30 PM',
    duration: '1 hr 30 mins',
    title: 'Grand Reception Entrance & Luncheon Feast',
    description: 'Welcoming the newlyweds and celebration lunch at KAFOCA-Mukuru Studyville.',
    isChurch: false,
  },
  {
    time: '2:30 PM - 3:30 PM',
    duration: '1 hour',
    title: 'Speeches, Tributes & Family Blessings',
    isChurch: false,
  },
  {
    time: '3:30 PM - 4:15 PM',
    duration: '45 mins',
    title: 'Cake Cutting Ceremony & Toast',
    isChurch: false,
  },
  {
    time: '4:15 PM - 5:00 PM',
    duration: '45 mins',
    title: 'Gift Presentation & Bridal Party Photos',
    isChurch: false,
  },
  {
    time: '5:00 PM onwards',
    duration: 'Evening',
    title: 'Celebration & Fellowship',
    isChurch: false,
  },
];

export const COLOR_SWATCHES: ColorSwatch[] = [
  {
    name: 'Burgundy',
    hex: '#800020',
    textColor: '#FFFFFF',
    description: 'A deep, rich burgundy tone symbolizing love, devotion, and noble warmth.'
  },
  {
    name: 'Navy Blue',
    hex: '#001F3F',
    textColor: '#FFFFFF',
    description: 'A classic, steadfast navy blue embodying loyalty, depth, and dignity.'
  },
  {
    name: 'Warm Gold Accent',
    hex: '#D4AF37',
    textColor: '#1A1A1A',
    description: 'A warm golden highlight representing celebration, grace, and covenant.'
  }
];

export const INITIAL_GALLERY: GalleryPhoto[] = [];

