export interface RsvpGuest {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  willAttend: 'yes' | 'no';
  adultsCount: number;
  submittedAt: string;
  eCardCode?: string;
  notes?: string;
}

export interface ProgramItem {
  time: string;
  duration: string;
  title: string;
  description?: string;
  bullets?: string[];
  isChurch?: boolean;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  textColor: string;
  description: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  uploaderName?: string;
  deviceInfo?: string;
  likes?: number;
  uploadedAt?: string;
}

