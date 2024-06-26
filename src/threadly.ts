/**
 * @fileoverview This module initializes the THREADLY application and sets up global declarations for Node.js Process.
 * @module threadly
 * @requires ./modules/core/nest.module
 * @requires {@link https://www.npmjs.com/package/@nestjs/node @sentry/node}
 */

import * as THREADLY from './modules/core/nest.module';
import { QueueManager } from './services/core/queue/manager';
import MultimediaQueue from './services/core/queue/multimedia';

/**
 * Global declaration for NodeJS Process.
 * @global
 * @typedef {Object} Process
 * @property {Object} Sentry - The Sentry module for error tracking.
 * @property {Object} owner - The object containing owner details.
 * @property {string|null} owner.id - The ID of the owner.
 * @property {string|null} owner.username - The username of the owner.
 * @property {string|null} owner.role - The role of the owner.
 * @property {string|null} owner.token - The token of the owner.
 * @property {QueueManager} THREADLY_QUEUE - The Queue manager
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Process {
      Sentry: typeof import('@sentry/node') | null;
      owner: {
        id: string | null;
        username: string | null;
        role: string | null;
        token: string | null;
      } | null;
      THREADLY_QUEUE: {
        Manager: QueueManager;
        Queue: Record<string, typeof MultimediaQueue>;
      };
    }
  }
}

/**
 * The main function that initializes the THREADLY application.
 * @async
 * @function
 * @throws {Error} Will throw an error if the initialization fails.
 */
async function main() {
  try {
    await THREADLY.init();
  } catch (err: any) {
    console.log('ERROR', err);
    throw new Error(JSON.stringify(err));
  }
}

main();

/** @exports THREADLY */
export default THREADLY;
