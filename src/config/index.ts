/**
 * @fileoverview This module provides configurations for the application.
 * @module config
 * @requires {@link https://www.npmjs.com/package/dotenv dotenv}
 */

import 'dotenv/config';
/**
 * @description The exported configuration object.
 */
export default {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  secret: process.env.APP_SECRET || '',
  sentryToken: process.env.SENTRY_TOKEN,
  sentryID: process.env.SENTRY_ID,
  mongo: {
    uri: process.env.MONGO_URI,
    testURI: process.env.MONGO_TEST_URI,
    stagingURI: process.env.MONGO_STAGING_URI,
    db: process.env.MONGODB,
  },
  transports:{
    loggly: {
      token: process.env.LOGGLY_TOKEN,
      subdomain: process.env.LOGGLY_SUBDOMAIN,
    },
  },
    exportPathVideo: process.env.EXPORT_PATH_VIDEO,
    exportPathAudio: process.env.EXPORT_PATH_AUDIO,
    exportPathImage: process.env.EXPORT_PATH_IMAGE,
    exportAudioExt: process.env.EXPORT_AUDIO_EXTENSION,
    exportVideoExt: process.env.EXPORT_VIDEO_EXTENSION,
    exportImageExt: process.env.EXPORT_IMAGE_EXTENSION,
    exportCommentCount: 5,
    exportFileNameLength: 16,
    exportContentWidth: 1920,
    exportContentHeight: 1080,
    exportContentColor: '1c1c1c',
    redis:{
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        defURL: process.env.REDIS_DEF_URL
    },
    defaultOutPath: process.env.DEFAULT_OUT_PATH,
};
