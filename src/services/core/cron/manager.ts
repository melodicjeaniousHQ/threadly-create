/**
 * @fileoverview This module provides a service for scheduling cron jobs.
 * @module CronService
 * @requires {@link https://www.npmjs.com/package/node-cron node-cron}
 */

import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import mms from './multimedia';
/**
 * @class
 * @classdesc This class provides a service for scheduling cron jobs.
 */
@Injectable()
export class CronServiceManager {
    private readonly multimediaService = mms
    constructor() {
    this.scheduleJobs();

  }

  /**
   * Schedules a cron job that runs every 15 minutes.
   * Data says you should rest for 10 minutes per 50 mintues of work
   * 1:5 relationships
   * @private
   */
  private scheduleJobs() {
    cron.schedule('*/15 * * * *', () => {
      console.log('=======================');
      console.log('Running every 15 minutes');
      console.log('=======================');
      this.multimediaService.fifteenMinutesCronJob();
    });
  }
}