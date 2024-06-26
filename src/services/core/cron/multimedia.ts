const {CRON_TIME_PERIODS, generateCronExpression} = require('../../../helpers').CronJob
/**
 * Home for anything CRON operations relating to multimedia.
 * A university sells software and experts.
 * @protected
 * @class
 */

class MultimediaCronJob {
    /**
     * @private
     * @const
     * @member
     */
    #MmCron = require('node-cron');
    /**
     * Gets MultimediaCronJob ready
     * @constructor
     * @memberof Core
     */
    constructor(){
    }
    /**
     * The Scheduled job
     * @typedef ScheduledJob
     * @external ScheduledJob
     * @type {Object}
     * @see {@link https://github.com/node-cron/node-cron/blob/master/src/scheduled-job.js}
     */
    /**
     * Get Multimedia cron
     * @public
     * @async
     * @function
     * @memberof Core
     * @returns {ScheduledJob} multimedia cron's schedule function.
     */
     async get() {
        return this;
    }
    /**
     * Schedules a job to the cron effective immediately.
     * @public
     * @async
     * @function
     * @memberof Core
     * @param {String} cronExpression cronExpression that works with node-cron. {@see {@link https://github.com/node-cron/node-cron/}}
     * @param {Function} job job you want to perform
     * @returns {ScheduledJob} scheduled job
     */
     async scheduleJob(cronExpression, job){
        return this.#MmCron.schedule(cronExpression, job);
    }
    /**
     * Unschedule a job from the multimedia cron. Every x, t ({@see {@link scheduleJob}), job will STOP running.
     * @public
     * @async
     * @function
     */
     async unscheduleJob(){
        console.log("I know you  wanna unschedule job but look at this", this.#MmCron.getJobs());
    }

    //TODO:returns jsdoc
    /**
     * This is what happens every minute for the multimedia cron
     * @public
     * @async
     * @function
     * @memberof Core
     * @returns {Promise<Void>}
     */
     async minuteCronJob() {
    }
    //TODO:returns jsdoc
    /**
     * This is what happens every fifteen minutes for the multimedia cron
     * @public
     * @async
     * @function
     * @memberof Core
     * @returns 
     */
     async fifteenMinutesCronJob() {

    }
    //TODO:returns jsdoc
    /**
     * This is what happens daily for the multimedia cron
     * @public
     * @async
     * @function
     * @memberof Core
     * @returns 
     */
     async dailyCronJob() {

    }
}
export default new MultimediaCronJob()