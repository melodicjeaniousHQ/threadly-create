import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import Throbber from 'src/helpers/throbber';
@Injectable()
export class GoogleSlidesService {
  private slides;
  #throbber = new Throbber()

  constructor() {
    this.#throbber.init()
    const auth = new google.auth.GoogleAuth({
      keyFile: '../../threadly-gkey.json',
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
  async getPresentation(presentationId: string) {
    try {
      const presentation = await this.slides.presentations.get({
        presentationId,
      });
      return presentation.data;
    } catch (error) {
      this.#throbber.fail('Content Presentation: Error retrieving presentation: ' + error);
      throw error;
    }
  }
}
