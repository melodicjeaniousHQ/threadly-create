/**
 * @fileoverview This module provides an enumeration of user roles.
 * @module UserRoles
 */

/**
 * @enum {string}
 * @readonly
 * @description An enumeration of user roles.
 */
export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
  CUSTOMER_SERVICE = 'cs',
  CONTENT_CONTRIBUTOR = 'cc',
  OWNER = 'owner'
}
