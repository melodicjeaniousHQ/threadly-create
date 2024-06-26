/**
 * @fileoverview This module provides a controller for user-related operations.
 * @module MultimediaController
 * @requires {@link https://www.npmjs.com/package/@nestjs/common @nestjs/common}
 * @requires ../services/multimedia/index.ts
 */
import { Controller, Post, UseGuards } from '@nestjs/common';
import { RedisFactory } from '../modules/packages/redis.factory';
import ResponseDTO from '../dto/response.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRoles } from '../enums/userRoles.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import MultimediaManager from '../modules/packages/multimedia.manager';
// create image from text input, return status message and data,
// post image to redisManager that would conceptualize the image for the

/**
 * @class
 * @classdesc This class provides a controller for multimedia-related operations.
 */
@Controller('multimedia')
export default class MultimediaController {
  /** Requirements for registering multimedia controller. */
  //TODO: Should be redisManager instead of service. The controllers return the managers.
  constructor(private readonly redisManager: RedisFactory) {}
  /** Get all multimedia services running. */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.OWNER, UserRoles.ADMIN)
  public async get(): Promise<ResponseDTO<any>> {
    const DATA = {
      distro: this.redisManager,
    };
    return {
      data: DATA,
      success: !!DATA,
      message: DATA
        ? 'Get multimedia services successful'
        : 'Failed to get multimedia services',
    };
  }
  /** Creates content via the default content creator. */
  @Post('createContent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.OWNER, UserRoles.ADMIN)
  public async createContent(): Promise<ResponseDTO<any>> {
    //filename and path
    //Call multimedia manager to give you the content
    const content = await MultimediaManager.createIGPost();
    return {
      data: content,
      success: !!content,
      message: content
        ? 'Create content successful'
        : 'Failed to create content',
    };
  }
}
