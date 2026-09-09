/**
 * Cloudinary Unsigned Upload Helper
 *
 * Uploads image files or base64 data URLs to Cloudinary's free tier unsigned upload endpoint.
 * Returns the secure HTTPS URL of the uploaded image to be stored in Firestore.
 */

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

export async function uploadToCloudinary(
  fileOrDataUrl: File | Blob | string,
  cloudName?: string,
  uploadPreset?: string
): Promise<string> {
  // Read configured Cloudinary credentials from params or environment variables
  let envCloudName: string | undefined;
  let envPreset: string | undefined;

  if (typeof process !== 'undefined' && process.env) {
    envCloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
    envPreset = process.env.VITE_CLOUDINARY_UPLOAD_PRESET || process.env.CLOUDINARY_UPLOAD_PRESET;
  }
  
  if (!envCloudName || !envPreset) {
    try {
      if (import.meta && (import.meta as any).env) {
        envCloudName = envCloudName || (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME;
        envPreset = envPreset || (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET;
      }
    } catch {
      // Ignore
    }
  }

  const activeCloudName = (cloudName?.trim() || envCloudName || 'dphc0jlnr').trim();
  const activePreset = (uploadPreset?.trim() || envPreset || 'wedding_photos').trim();

  const formData = new FormData();
  formData.append('file', fileOrDataUrl);
  formData.append('upload_preset', activePreset);

  const endpoint = `https://api.cloudinary.com/v1_1/${activeCloudName}/image/upload`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => null);
      const errMsg = errorJson?.error?.message || `Cloudinary upload failed (HTTP ${response.status})`;
      throw new Error(errMsg);
    }

    const data: CloudinaryUploadResponse = await response.json();
    if (!data.secure_url) {
      throw new Error('Cloudinary response missing secure_url');
    }

    return data.secure_url;
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}
