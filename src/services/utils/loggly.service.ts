/**
 * @fileoverview This service provides logging functionality using the Loggly service via the winston library.
 * @fileoverview If you want customer satisfaction, educate them, grade them, correct them, entertain them and talk to them.
 * @fileoverview This is a blogger bot in the shell. Read more about success.
 * @requires {@link https://www.npmjs.com/package/@nestjs/common @nestjs/common}
 * @requires {@link https://www.npmjs.com/package/winston winston}
 * @requires {@link https://www.npmjs.com/package/winston-loggly-bulk winston-loggly-bulk}
 * @requires ../../config/index
 */
import { Injectable, LoggerService } from '@nestjs/common';
import winston from 'winston';
import { Loggly } from 'winston-loggly-bulk';
import config from '../../config/index';

export type ILogger = {
  log(message: string):void;
  error(message: string, trace:string): void,
  warn(message: string): void,
  debug(message: string): void,
  verbose(message: string): void,
}
/**
 * LogglyService class
 * @class
 * @public
 * @implements {LoggerService}
 */
@Injectable()
export class LogglyService implements LoggerService, ILogger {
  /**
   * Winston instance with added Loggly transport
   * @private
   * @type {winston.Logger}
   */
  private winston = winston.add(
    new Loggly({
      token: config.transports.loggly.token,
      subdomain: config.transports.loggly.subdomain,
      tags: ['' + config.env],
      json: true,
    }),
  );

  /**
   * Logs an 'info' level message.
   * @public
   * @param {string} message - The message to log
   */
  log(message: string) {
    this.winston.log('info', message);
  }

  /**
   * Logs an 'error' level message with a trace.
   * @public
   * @param {string} message - The message to log
   * @param {string} trace - The trace to include with the log
   */
  error(message: string, trace: string) {
    this.winston.log('error', message, { trace });
  }

  /**
   * Logs a 'warn' level message.
   * @public
   * @param {string} message - The message to log
   */
  warn(message: string) {
    this.winston.log('warn', message);
  }

  /**
   * Logs a 'debug' level message.
   * @public
   * @param {string} message - The message to log
   */
  debug(message: string) {
    this.winston.log('debug', message);
  }

  /**
   * Logs a 'verbose' level message.
   * @public
   * @param {string} message - The message to log
   */
  verbose(message: string) {
    this.winston.log('verbose', message);
  }
}

