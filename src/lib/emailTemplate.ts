import fs from 'fs';
import path from 'path';
import { RsvpGuest } from '../types';
import { uploadToCloudinary } from './cloudinary';

let cachedCloudinaryCouplePhotoUrl: string | null = null;

async function getCloudinaryCouplePhotoUrl(baseUrl: string): Promise<string> {
  if (cachedCloudinaryCouplePhotoUrl) {
    return cachedCloudinaryCouplePhotoUrl;
  }

  const fallbackUrl = `${baseUrl.replace(/\/$/, '')}/src/assets/images/vee_phil_photo.jpg`;

  try {
    let dataUrl: string | null = null;
    const localPath = path.join(process.cwd(), 'src/assets/images/vee_phil_photo.jpg');

    if (fs.existsSync(localPath)) {
      const fileBuffer = fs.readFileSync(localPath);
      dataUrl = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
    }

    if (dataUrl) {
      const uploadedUrl = await uploadToCloudinary(dataUrl);
      if (uploadedUrl) {
        cachedCloudinaryCouplePhotoUrl = uploadedUrl;
        console.log('Successfully uploaded header couple photo to Cloudinary:', uploadedUrl);
        return uploadedUrl;
      }
    }
  } catch (err) {
    console.warn('Could not upload header couple photo to Cloudinary, using fallback:', err);
  }

  return fallbackUrl;
}

async function getCloudinaryQrCodeUrl(guest: RsvpGuest): Promise<string> {
  const rawQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `VEE-PHIL-RSVP-${guest.id}-${guest.fullName}`
  )}&color=5a1d22&bgcolor=FCFAF7`;

  try {
    const response = await fetch(rawQrUrl);
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = response.headers.get('content-type') || 'image/png';
      const qrDataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;

      const uploadedUrl = await uploadToCloudinary(qrDataUrl);
      if (uploadedUrl) {
        console.log(`Successfully uploaded guest (${guest.fullName}) QR code to Cloudinary:`, uploadedUrl);
        return uploadedUrl;
      }
    }
  } catch (err) {
    console.warn('Could not upload QR code to Cloudinary, falling back to raw QR URL:', err);
  }

  return rawQrUrl;
}

export async function generateRsvpEmailHtml(guest: RsvpGuest, baseUrl: string = 'https://veeandphil.wedding'): Promise<string> {
  const qrCodeUrl = await getCloudinaryQrCodeUrl(guest);
  const couplePhotoUrl = await getCloudinaryCouplePhotoUrl(baseUrl);
  
  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=-1.3125,36.8378';
  
  const googleCalendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Venessa+%26+Philemon+Wedding&dates=20261025T070000Z/20261025T150000Z&details=Official+Wedding+Celebration+for+Venessa+Kerubo+%26+Philemon+Araka.&location=Nairobi+South+SDA+Church%2C+Nairobi%2C+Kenya';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RSVP Confirmation - Venessa & Philemon Wedding</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f1ea; font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f1ea; padding: 20px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FCFAF7; border-radius: 20px; overflow: hidden; border: 1px solid #e7dfd5; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
          
          <!-- Top Hero Image Header -->
          <tr>
            <td align="center" style="position: relative; background-color: #5a1d22; padding: 0;">
              <div style="width: 100%; max-height: 280px; overflow: hidden; position: relative;">
                <img src="${couplePhotoUrl}" alt="Venessa & Philemon" style="width: 100%; height: auto; display: block; object-fit: cover; border-bottom: 3px solid #D4AF37;" />
              </div>
            </td>
          </tr>

          <!-- Monogram Crest Header -->
          <tr>
            <td align="center" style="padding: 25px 20px 10px 20px; background-color: #FCFAF7;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 20px; border-radius: 25px; background-color: #5a1d22; border: 2px solid #D4AF37; text-align: center; vertical-align: middle;">
                    <span style="font-family: Georgia, serif; font-size: 16px; font-weight: bold; color: #D4AF37; letter-spacing: 2px;">VP</span>
                  </td>
                </tr>
              </table>
              <p style="margin: 10px 0 0 0; font-family: sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 3px; color: #5a1d22;">
                Official Wedding Pass
              </p>
            </td>
          </tr>

          <!-- Guest Greeting & Large Name -->
          <tr>
            <td align="center" style="padding: 10px 30px 20px 30px; text-align: center;">
              <p style="margin: 0; font-family: sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #8f3b43;">
                RSVP Confirmation
              </p>
              <h1 style="margin: 8px 0 0 0; font-family: Georgia, serif; font-size: 30px; font-weight: bold; color: #33070b; line-height: 1.2;">
                ${guest.fullName}
              </h1>
              <p style="margin: 10px 0 0 0; font-family: Georgia, serif; font-style: italic; font-size: 16px; color: #665c52;">
                ${guest.willAttend === 'yes' ? 'We are overjoyed to welcome you to our celebration!' : 'Thank you for letting us know. We miss you!'}
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td align="center" style="padding: 0 40px;">
              <div style="height: 1px; background: linear-gradient(to right, transparent, #D4AF37, transparent); width: 100%;"></div>
            </td>
          </tr>

          <!-- Date, Time and Venue Section -->
          <tr>
            <td style="padding: 25px 30px; background-color: #ffffff;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                
                <!-- Date -->
                <tr>
                  <td style="padding-bottom: 18px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="top" style="padding-right: 12px;">
                          <span style="font-size: 18px;">📅</span>
                        </td>
                        <td>
                          <div style="font-family: sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; color: #8f3b43;">Wedding Date</div>
                          <div style="font-family: Georgia, serif; font-size: 18px; font-weight: bold; color: #1c0205; margin-top: 2px;">Sunday, October 25, 2026</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Ceremony Time & Venue -->
                <tr>
                  <td style="padding-bottom: 18px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="top" style="padding-right: 12px;">
                          <span style="font-size: 18px;">⛪</span>
                        </td>
                        <td>
                          <div style="font-family: sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; color: #8f3b43;">Church Nuptial Ceremony</div>
                          <div style="font-family: Georgia, serif; font-size: 16px; font-weight: bold; color: #1c0205; margin-top: 2px;">Nairobi South SDA</div>
                          <div style="font-family: sans-serif; font-size: 12px; color: #554e46; margin-top: 2px;">9:15 AM Guest Arrival | 10:00 AM Ceremony</div>
                          <div style="font-family: sans-serif; font-size: 11px; color: #887d72;">Nairobi South, Nairobi, Kenya</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Reception Time & Venue -->
                <tr>
                  <td>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="top" style="padding-right: 12px;">
                          <span style="font-size: 18px;">🥂</span>
                        </td>
                        <td>
                          <div style="font-family: sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; color: #047857;">Reception Venue</div>
                          <div style="font-family: Georgia, serif; font-size: 16px; font-weight: bold; color: #1c0205; margin-top: 2px;">KAFOCA-Mukuru Studyville</div>
                          <div style="font-family: sans-serif; font-size: 12px; color: #554e46; margin-top: 2px;">1:00 PM Reception Entrance &amp; Luncheon</div>
                          <div style="font-family: sans-serif; font-size: 11px; color: #887d72;">Mukuru, Nairobi, Kenya</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- QR Code Section -->
          <tr>
            <td align="center" style="padding: 25px 20px; background-color: #fcf8f3; border-top: 1px border-bottom: 1px border #eee6db;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 15px; border-radius: 16px; border: 1px solid #e0d6c8;">
                <tr>
                  <td align="center">
                    <img src="${qrCodeUrl}" alt="Guest Check-in QR Code" width="160" height="160" style="display: block; border-radius: 8px;" />
                  </td>
                </tr>
              </table>
              <p style="margin: 12px 0 0 0; font-family: sans-serif; font-size: 11px; font-weight: bold; uppercase; letter-spacing: 1.5px; color: #5a1d22;">
                Official Entry Pass &amp; Check-In QR Code
              </p>
              <p style="margin: 4px 0 0 0; font-family: monospace; font-size: 12px; color: #742b31; font-weight: bold;">
                ID: ${guest.id.toUpperCase()}
              </p>
            </td>
          </tr>

          <!-- Action Buttons (Google Maps, Calendar, Minisite) -->
          <tr>
            <td align="center" style="padding: 30px 20px 25px 20px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 450px;">
                
                <!-- Google Maps Button -->
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <a href="${googleMapsUrl}" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background-color: #5a1d22; color: #ffffff; text-decoration: none; padding: 14px 20px; border-radius: 12px; font-family: sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; text-align: center; border: 1px solid #450e12;">
                      📍 Open in Google Maps
                    </a>
                  </td>
                </tr>

                <!-- Add to Calendar Button -->
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <a href="${googleCalendarUrl}" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background-color: #047857; color: #ffffff; text-decoration: none; padding: 14px 20px; border-radius: 12px; font-family: sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; text-align: center; border: 1px solid #064e3b;">
                      📅 Add to Google Calendar
                    </a>
                  </td>
                </tr>

                <!-- Back to Minisite Button -->
                <tr>
                  <td align="center">
                    <a href="${baseUrl}" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background-color: #ffffff; color: #5a1d22; text-decoration: none; padding: 14px 20px; border-radius: 12px; font-family: sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; text-align: center; border: 1.5px solid #5a1d22;">
                      ✨ Return to Wedding Minisite
                    </a>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 20px; background-color: #33070b; color: #eacacc; text-align: center;">
              <p style="margin: 0; font-family: Georgia, serif; font-size: 16px; font-weight: bold; color: #D4AF37;">
                Venessa &amp; Philemon Wedding
              </p>
              <p style="margin: 5px 0 0 0; font-family: sans-serif; font-size: 11px; color: #dbabae;">
                We look forward to celebrating with you!
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
