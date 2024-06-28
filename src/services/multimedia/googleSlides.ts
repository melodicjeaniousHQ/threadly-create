import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import Throbber from '../../helpers/throbber';
import axios from 'axios';

@Injectable()
export class GoogleSlidesService {
  private slides;
  #throbber = new Throbber();

  constructor() {
    this.#throbber.init("Initializing Presentation Deck...");
    const auth = new google.auth.GoogleAuth({
      keyFile: 'threadly-gkey.json',
      scopes: ['https://www.googleapis.com/auth/presentations'],
    });
    this.slides = google.slides({ version: 'v1', auth });
  }

  async write(
    text: string,
    presentationId: string,
    pageObjectId: string,
    placeholderIndex: number,
  ) {
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
      this.#throbber.fail(
        'Content Presentation: Error retrieving presentation: ' + error,
      );
      throw error;
    }
  }

  async createContent(presentationId: string, title: string, subtitle: string): Promise<string[]> {
    try {
      const presentation = await this.getPresentation(presentationId);
      const slides = presentation.slides;
      const MAX_SUBTITLE_LENGTH = 60;
      if(subtitle.length > MAX_SUBTITLE_LENGTH){
        throw new Error(`Subitle too long, should be ${MAX_SUBTITLE_LENGTH} characters long.`)
      }
      if (slides.length === 0) {
        throw new Error('No slides found in the presentation.');
      }

      const firstSlideObjectId = slides[0].objectId;

      const requests = [
        {
          replaceAllText: {
            containsText: { text: '[TITLE]', matchCase: true },
            replaceText: title,
            pageObjectIds: [firstSlideObjectId],
          },
        },
        {
          replaceAllText: {
            containsText: { text: '[SUB]', matchCase: true },
            replaceText: subtitle,
            pageObjectIds: [firstSlideObjectId],
          },
        },
      ];

      const response = await this.slides.presentations.batchUpdate({
        presentationId,
        requestBody: { requests },
      });

      if (response.status === 200) {
        console.log('Batch update successful:', response.data);
      } else {
        console.error('Error in batchUpdate response:', response.data);
        throw new Error('Batch update failed');
      }
      console.log("ABOUT TO EXPORT BUT HERE IS PRESENTATION", await this.getPresentation(presentationId))
      const exportLinks = await this.exportPresentationToJPEG(presentationId, slides.length);

      return exportLinks;
    } catch (error) {
      this.#throbber.fail('Error creating content: ' + error);
      throw error;
    }
  }

  async exportPresentationToJPEG(presentationId: string, numberOfSlides: number): Promise<string[]> {
    try {
      const authClient = await google.auth.getClient({
        keyFile: 'threadly-gkey.json',
        scopes: ['https://www.googleapis.com/auth/presentations'],
      });
      const token = await authClient.getAccessToken();
      const baseUrl = `https://slides.googleapis.com/v1/presentations/${presentationId}/pages`;

      const exportLinks: string[] = [];

      for (let i = 0; i < numberOfSlides; i++) {
        const exportUrl = `${baseUrl}/g${presentationId}_${i}/thumbnail?access_token=${token}`;
        const response = await axios.get(exportUrl, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        exportLinks.push(`data:image/jpeg;base64,${base64Image}`);
      }

      return exportLinks;
    } catch (error) {
      this.#throbber.fail('Error exporting presentation: ' + JSON.stringify(error));
      throw error;
    }
  }
}
