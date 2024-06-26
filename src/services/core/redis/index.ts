import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import config from '../../../config'
import { LogglyService } from '../../../services/utils/loggly.service';
import Throbber from '../../../helpers/throbber';
/**
 * @fileoverview Avoid getting high on your own supply.
 * @file attach punctuations and documentations to the system
 */
@Injectable()
export class RedisService {
  private redisClient: [RedisClientType];
  private logglyService = new LogglyService();
  private throbber = new Throbber();
  #isInit = false;
  
  constructor() {
  }
  async init(){
    const url = config.env === 'dev' ? config.redis.defURL : config.redis.host + config.redis.port
    console.log("THIS D URL", url)
    this.redisClient[0] = createClient({ url });
    this.redisClient[0].on('error', (err) => {
      this.throbber.fail(`Redis Error: ${err}`)
      return "Failed to connect to network"
    });
    this.redisClient[0].on('connect', () => {
      this.throbber.succeed(`Redis Connected!`)
    });
    this.redisClient[0].on('reconnecting', () => {
      this.throbber.warn(`Redis Reconnecting!`)
    });
    this.redisClient[0].on('ready', () => {
      this.throbber.succeed(`Redis Ready!`)
    });
    this.#isInit = true;
  }
  async canInit(){
    const condition = this.#isInit == false;
    return condition ? await this.init() : null
  }
  async set(key: string, value: string): Promise<undefined> {
    this.canInit();
    await this.redisClient[0].set(key, value);
  }
  /**
   * 3xXDimensional Hashmaps
   * @param key A-G
   * @param value 0-7
   * @param id Reference Track source
   */
  async setMajor(key: string, value: string, id: any): Promise<undefined> {
    this.canInit();
    await this.redisClient[0][id].set(key, value);
    //TODO: Use retry queue here to loop this task 3 times before crashing app on fail.
  }
  /**
   * 
   * @param key 
   * @returns Redis client
   * @throws Default error if redis can't connect to server
   */
  async get(key: string): Promise<string | undefined> {
    this.canInit();
    return new Promise((resolve, reject) => {
        try{
            const client = this.redisClient[0].get((key));
            if (client) return resolve(client)
        }catch(err: any){
            this.logglyService.error(err.message, err.stack)
            return reject(err)
        }//TODO: Consider a retry 3 task count loop using queues the background using finally.
    });
  }
}
