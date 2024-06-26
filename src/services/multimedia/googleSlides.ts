import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleSlidesService {
  private slides;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'path_to_your_credentials.json', // Update with your credentials path
      scopes: ['https://www.googleapis.com/auth/presentations'],
    });
    this.slides = google.slides({ version: 'v1', auth });
  }

  async write(text: string, presentationId: string, pageObjectId: string, placeholderIndex: number) {
    try {
      const requests = [
        {
          replaceAllText: {
            replaceText: text,
            pageObjectIds: [pageObjectId],
          },
        },
      ];
      await this.slides.presentations.batchUpdate({
        presentationId,
        requestBody: {
          requests,
        },
      });
      console.log(`Text "${text}" written successfully.`);
    } catch (error) {
      console.error('Error writing text:', error);
      throw error;
    }
  }
}
