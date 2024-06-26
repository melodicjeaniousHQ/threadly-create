import Jimp from 'jimp';
import Throbber from '../../helpers/throbber';
import { Injectable } from '@nestjs/common';
import { RedisFactory } from '../../modules/packages/redis.factory';
import config from '../../config';
import { generateRandomString } from '../../helpers';
import fs from 'fs';
const fontBuffer = fs.readFileSync('./assets/RobotoMono-Regular.ttf');
const fontBase64 = Buffer.from(fontBuffer).toString('base64');
const FONT = `data:application/x-font-ttf;base64,${fontBase64}`
const SQUARE_SIZE = 1080;
enum EDIMENSIONS {
  SQUARE_WIDTH = SQUARE_SIZE,
  SQUARE_HEIGHT = SQUARE_SIZE,
  // GOLDEN_RATIO_PHI = 1.618,
  GOLDEN_RATIO_PERCENT = 0.1618, //In base 10 multiples of 10
}
enum TEMPLATE_PATH {
  SQUARE = '../../../../threadly-create/assets/square-template.png',
}
/**
 * Protected template paths
 */
export enum IMAGE_TEMPLATE {
  SQUARE = TEMPLATE_PATH.SQUARE,
}
/**
 * Helps us create an image
 * @protected Jimp is exposed
 * @class
 */
@Injectable()
class ImageService {
  /**
   * @private
   * @member
   * Image instance
   */
  readonly #imageServiceOperator: Jimp;
  /**
   * @private
   * @member
   */
  #fontPath = FONT;
  /**
   * @private
   * @member
   */
  #distributor: RedisFactory;
  /**
   * @private
   * @member
   */
  #imageThrobber = new Throbber();

  /**
   * Import an image with set instructions.
   * We need the distribution channels so we can do things like:
   * - Check that image template format works for the platform
   * - Validate that image template and content size is right for platform
   * @constructor
   */
  constructor(template: IMAGE_TEMPLATE, distributionChannel: RedisFactory) {
    let width: number, height: number;
    if (template === IMAGE_TEMPLATE.SQUARE) {
      width = EDIMENSIONS.SQUARE_WIDTH;
      height = EDIMENSIONS.SQUARE_HEIGHT;
    }
    this.#distributor = distributionChannel;
    this.#imageServiceOperator = new Jimp(width, height, (err: any) => {
      if (err) {
        this.#imageThrobber.fail('Image Service Err: ' + err);
        return;
      }
    });
    if (this.#imageServiceOperator) {
      this.#distributor = distributionChannel;
      return this;
    }
  }
  /**
   * Writes text at the center of the image
   * @public
   * @async
   * @function
   * @param {String} text Text you want to write over the image
   * @returns { Promise<Jimp | null>} image with text overlay
   */
  async write(text: string): Promise<Jimp | null> {
    this.#imageThrobber.init('Image Service: WRITING TEXT TO IMAGE...');
    const WRITE_X_LOCATION =
      EDIMENSIONS.GOLDEN_RATIO_PERCENT * EDIMENSIONS.SQUARE_WIDTH; //Start writing at golden ratio's phi to the right
    const WRITE_Y_LOCATION = 0;
    console.log("HERE")
    const customFont = await Jimp.loadFont(this.#fontPath);
    console.log("HERE")
    if (customFont) {
      const textOverImage = this.#imageServiceOperator.print(
        customFont,
        WRITE_X_LOCATION,
        WRITE_Y_LOCATION,
        {
          text: text,
          alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
          alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
        },
        EDIMENSIONS.SQUARE_WIDTH -
          EDIMENSIONS.GOLDEN_RATIO_PERCENT * EDIMENSIONS.SQUARE_WIDTH, // Stop writing at golden ratio's phi less than image width
        EDIMENSIONS.SQUARE_HEIGHT -
          EDIMENSIONS.GOLDEN_RATIO_PERCENT * EDIMENSIONS.SQUARE_HEIGHT,
      );
      this.#imageThrobber.succeed('WRITTEN TEXT TO IMAGE');
      return textOverImage;
    }
    this.#imageThrobber.fail('FAILED TO WRITE TEXT TO IMAGE');
    return null;
  }
  /**
   * Get Current state of image
   * @public
   * @function
   * @returns current state of image
   */
  getImage() {
    return this.#imageServiceOperator;
  }
}

export default {
  ImageService: (
    template: IMAGE_TEMPLATE,
    distributionChannel: RedisFactory,
  ) => {
    return new ImageService(template, distributionChannel);
  },
  async exportToFile(imageServiceOperator: Jimp) {
    const file =
      config.defaultOutPath +
      generateRandomString(config.exportFileNameLength) +
      config.exportImageExt;
    return imageServiceOperator.write(file);
  },
};
