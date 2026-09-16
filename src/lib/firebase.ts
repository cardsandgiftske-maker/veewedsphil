import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc 
} from 'firebase/firestore';
import { RsvpGuest, GalleryPhoto } from '../types';
import { INITIAL_GALLERY } from '../data';
import firebaseAppletConfig from '../../firebase-applet-config.json';

// Read Firebase configuration from environment variables or firebase-applet-config.json
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId
};

const databaseId = firebaseAppletConfig.firestoreDatabaseId || undefined;

// Check if Firebase is fully configured
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'MY_FIREBASE_API_KEY'
);

let dbInstance: any = null;

// Lazy initialize Firebase and Firestore to prevent startup crashes if keys are empty or misconfigured
export function getDb() {
  if (!isFirebaseConfigured) {
    return null;
  }
  
  if (!dbInstance) {
    try {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      dbInstance = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
    } catch (error) {
      console.error('Firebase initialization error:', error);
      return null;
    }
  }
  return dbInstance;
}

// COLLECTION NAME
const COLLECTION_NAME = 'rsvps';

// LOCAL STORAGE FALLBACK HELPERS
const getLocalRsvps = (): RsvpGuest[] => {
  try {
    const raw: RsvpGuest[] = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
    // Clean out any legacy seed entries
    const cleaned = raw.filter(
      (item) =>
        !item.id?.startsWith('seed-') &&
        item.fullName !== 'Christopher Mwangi' &&
        item.fullName !== 'Mercy Wanjiku' &&
        item.fullName !== 'David Omondi'
    );
    if (cleaned.length !== raw.length) {
      localStorage.setItem('wedding_rsvps', JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return [];
  }
};

const saveLocalRsvps = (rsvps: RsvpGuest[]) => {
  localStorage.setItem('wedding_rsvps', JSON.stringify(rsvps));
  window.dispatchEvent(new Event('rsvp_database_updated'));
};

// EXPORTED CORE API FUNCTIONS (SFC / transparent dual database logic)

/**
 * Save or update an RSVP entry
 */
export async function saveRsvp(rsvp: RsvpGuest): Promise<void> {
  const db = getDb();
  if (db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, rsvp.id);
      await setDoc(docRef, rsvp);
      return;
    } catch (error) {
      console.warn('Failed to save to Firebase, saving to localStorage instead:', error);
    }
  }
  
  // Local storage fallback
  const existing = getLocalRsvps();
  const updated = existing.filter((item) => item.id !== rsvp.id && item.phoneNumber !== rsvp.phoneNumber);
  updated.push(rsvp);
  saveLocalRsvps(updated);
}

/**
 * Fetch all RSVPs.
 */
export async function getRsvps(): Promise<RsvpGuest[]> {
  const db = getDb();
  if (db) {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const rsvps: RsvpGuest[] = [];
      querySnapshot.forEach((docSnap) => {
        const item = docSnap.data() as RsvpGuest;
        const isSeed =
          docSnap.id.startsWith('seed-') ||
          item.id?.startsWith('seed-') ||
          item.fullName === 'Christopher Mwangi' ||
          item.fullName === 'Mercy Wanjiku' ||
          item.fullName === 'David Omondi';

        if (isSeed) {
          // Asynchronously delete any stray seed doc from Firestore
          deleteDoc(doc(db, COLLECTION_NAME, docSnap.id)).catch(() => {});
        } else {
          rsvps.push(item);
        }
      });
      return rsvps;
    } catch (error) {
      console.warn('Failed to fetch from Firebase, reading from localStorage instead:', error);
    }
  }
  
  // Local storage fallback
  const local = getLocalRsvps();
  return local.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

/**
 * Delete an RSVP entry
 */
export async function deleteRsvp(id: string): Promise<void> {
  const db = getDb();
  if (db) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return;
    } catch (error) {
      console.warn('Failed to delete from Firebase, removing from localStorage:', error);
    }
  }
  
  const existing = getLocalRsvps();
  const updated = existing.filter((item) => item.id !== id);
  saveLocalRsvps(updated);
}

/**
 * Toggle RSVP attendance status or change seat count
 */
export async function updateRsvpStatus(id: string, willAttend: 'yes' | 'no', adultsCount: number): Promise<void> {
  const db = getDb();
  if (db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        willAttend,
        adultsCount
      });
      return;
    } catch (error) {
      console.warn('Failed to update Firebase, updating localStorage:', error);
    }
  }
  
  const existing = getLocalRsvps();
  const updated = existing.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        willAttend,
        adultsCount
      };
    }
    return item;
  });
  saveLocalRsvps(updated);
}

/**
 * Real-time RSVP updates subscription
 */
export function subscribeToRsvps(onUpdate: (rsvps: RsvpGuest[]) => void): () => void {
  const db = getDb();
  if (db) {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('submittedAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const rsvps: RsvpGuest[] = [];
        snapshot.forEach((docSnap) => {
          const item = docSnap.data() as RsvpGuest;
          const isSeed =
            docSnap.id.startsWith('seed-') ||
            item.id?.startsWith('seed-') ||
            item.fullName === 'Christopher Mwangi' ||
            item.fullName === 'Mercy Wanjiku' ||
            item.fullName === 'David Omondi';

          if (isSeed) {
            deleteDoc(doc(db, COLLECTION_NAME, docSnap.id)).catch(() => {});
          } else {
            rsvps.push(item);
          }
        });
        onUpdate(rsvps);
      }, (error) => {
        console.warn('Firebase snapshot subscription failed:', error);
      });
    } catch (e) {
      console.warn('Could not subscribe in real-time, relying on polling:', e);
    }
  }
  
  // Local storage listener fallback
  const handleLocalUpdate = () => {
    onUpdate(getLocalRsvps().sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
  };
  
  window.addEventListener('rsvp_database_updated', handleLocalUpdate);
  
  // Trigger initial callback
  handleLocalUpdate();
  
  return () => {
    window.removeEventListener('rsvp_database_updated', handleLocalUpdate);
  };
}

// ==========================================
// GALLERY PHOTO FUNCTIONS
// ==========================================

const GALLERY_COLLECTION = 'gallery';

const isDemoPhoto = (photo: GalleryPhoto): boolean => {
  if (!photo) return true;
  const id = photo.id || '';
  const url = photo.url || '';
  return (
    id === 'photo-1' ||
    id === 'photo-2' ||
    id === 'photo-3' ||
    id === 'photo-4' ||
    url.includes('carol_and_john') ||
    url.includes('reception_venue_') ||
    url.includes('church_venue_')
  );
};

const getLocalGallery = (): GalleryPhoto[] => {
  const saved = localStorage.getItem('philcollins_gallery');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter(p => !isDemoPhoto(p));
      }
    } catch (e) {
      // ignore JSON error
    }
  }
  return [];
};

const saveLocalGallery = (photos: GalleryPhoto[]) => {
  localStorage.setItem('philcollins_gallery', JSON.stringify(photos.filter(p => !isDemoPhoto(p))));
  window.dispatchEvent(new Event('gallery_database_updated'));
};

/**
 * Save a new photo to Firebase gallery collection
 */
export async function saveGalleryPhoto(photo: GalleryPhoto): Promise<void> {
  const db = getDb();
  if (db) {
    try {
      const docRef = doc(db, GALLERY_COLLECTION, photo.id);
      await setDoc(docRef, photo);
    } catch (error) {
      console.warn('Failed to save gallery photo to Firebase, saving locally:', error);
    }
  }
  const existing = getLocalGallery();
  const updated = [photo, ...existing.filter(p => p.id !== photo.id)];
  saveLocalGallery(updated);
}

/**
 * Delete a photo from Firebase and local gallery
 */
export async function deleteGalleryPhoto(photoId: string): Promise<void> {
  const db = getDb();
  if (db) {
    try {
      const docRef = doc(db, GALLERY_COLLECTION, photoId);
      await deleteDoc(docRef);
    } catch (error) {
      console.warn('Failed to delete photo from Firebase:', error);
    }
  }
  const existing = getLocalGallery();
  const updated = existing.filter(p => p.id !== photoId);
  saveLocalGallery(updated);
}

/**
 * Fetch all gallery photos from Firebase, automatically filtering and purging demo photos
 */
export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const db = getDb();
  if (db) {
    try {
      const querySnapshot = await getDocs(collection(db, GALLERY_COLLECTION));
      const photos: GalleryPhoto[] = [];
      querySnapshot.forEach((docSnap) => {
        const item = docSnap.data() as GalleryPhoto;
        if (isDemoPhoto(item)) {
          // Purge residual demo photo from Firestore
          deleteDoc(docSnap.ref).catch(() => {});
        } else {
          photos.push(item);
        }
      });
      return photos;
    } catch (error) {
      console.warn('Failed to fetch gallery from Firebase:', error);
    }
  }
  return getLocalGallery();
}

/**
 * Like a photo in Firebase gallery
 */
export async function likeGalleryPhoto(photoId: string): Promise<void> {
  const db = getDb();
  const local = getLocalGallery();
  const currentPhoto = local.find(p => p.id === photoId);
  const newLikes = (currentPhoto?.likes || 0) + 1;

  if (db) {
    try {
      const docRef = doc(db, GALLERY_COLLECTION, photoId);
      await updateDoc(docRef, { likes: newLikes }).catch(async () => {
        if (currentPhoto) {
          await setDoc(docRef, { ...currentPhoto, likes: newLikes });
        }
      });
    } catch (error) {
      console.warn('Failed to update photo likes in Firebase:', error);
    }
  }

  const updated = local.map(p => p.id === photoId ? { ...p, likes: newLikes } : p);
  saveLocalGallery(updated);
}

/**
 * Subscribe to real-time gallery updates
 */
export function subscribeToGalleryPhotos(onUpdate: (photos: GalleryPhoto[]) => void): () => void {
  const db = getDb();
  if (db) {
    try {
      return onSnapshot(collection(db, GALLERY_COLLECTION), (snapshot) => {
        const photos: GalleryPhoto[] = [];
        snapshot.forEach((docSnap) => {
          const item = docSnap.data() as GalleryPhoto;
          if (isDemoPhoto(item)) {
            // Purge residual demo photo from Firestore
            deleteDoc(docSnap.ref).catch(() => {});
          } else {
            photos.push(item);
          }
        });
        onUpdate(photos);
      }, (error) => {
        console.warn('Firebase gallery snapshot subscription failed:', error);
      });
    } catch (e) {
      console.warn('Could not subscribe gallery in real-time:', e);
    }
  }

  const handleLocalUpdate = () => {
    onUpdate(getLocalGallery());
  };
  window.addEventListener('gallery_database_updated', handleLocalUpdate);
  handleLocalUpdate();

  return () => {
    window.removeEventListener('gallery_database_updated', handleLocalUpdate);
  };
}

