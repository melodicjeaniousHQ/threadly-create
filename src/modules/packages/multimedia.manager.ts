import { Injectable, UseGuards } from '@nestjs/common';
import imageService, { IMAGE_TEMPLATE } from '../../services/multimedia/image';
import { RedisFactory } from './redis.factory';
import { Roles } from '../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { UserRoles } from '../../enums/userRoles.enum';
import config from '../../config';
import Throbber from '../../helpers/throbber';
/**
 * @fileoverview Warehouse Manager responsible for setting the dimensions
 * of operations
 * @file Returns of our co-ordinates in the business timeline.
 *
 * This class Manages the Multimedia manager for all our branches.
 * They are responsible for creating content, giving bi-weekly financial analytics reports
 * and how it affects the scope of our current campaign.
 */
@Injectable()
class MultimediaManager {
  #host = new RedisFactory();
  #throbber = new Throbber();
  constructor() {}
  /**
   * @function content creator job. Must not have internal access/knowledge of the system
   * @description Schedule content on our content partner apps in the specified format
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.OWNER, UserRoles.CONTENT_CONTRIBUTOR)
  async createIGPost() {
    const serviceInstance = imageService.ImageService(
      IMAGE_TEMPLATE.SQUARE,
      this.#host,
    );
    const textOverImage = await serviceInstance.write('Hello World');
    if (config.env === 'dev') {
      return await imageService.exportToFile(textOverImage);
    }
    if (!textOverImage)
      this.#throbber.fail('Multimedia Manager: Failed to create content.');
    this.#throbber.succeed('Multimedia Manager: IG Post created successfully');

    console.log('======================');
    console.log('Delete this:', textOverImage);
    console.log('======================');
    return textOverImage as any;
  }
}
export default new MultimediaManager();
