/**
 * @fileoverview This module provides a data transfer object for changing a user's role.
 * @module IGPostDTO
 * @requires {@link https://www.npmjs.com/package/class-validator class-validator}
 */

import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

/**
 * @class
 * @classdesc This class provides a data transfer object for a Instagram Post instance
 */
export default class IGPostDTO {
  /** The post's ID. */
  @IsString()
  @IsNotEmpty()
  readonly id?: string;
  /** The post's text. */
  @IsString()
  @IsNotEmpty()
  readonly text: string;
  /** The post's author. (without @) */
  @IsString()
  @IsNotEmpty()
  readonly author: string;
}
