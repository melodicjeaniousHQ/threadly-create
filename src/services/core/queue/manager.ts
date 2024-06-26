'use strict'
import Throbber from  '../../../helpers/throbber';
import multimediaQueue from './multimedia'
import config from 'src/config';
/**
 * We have services that want to run jobs/jobs one after the other. {@link QueueManager} organizes all jobs for all services into a queue library and attaches it to {@link process}.
 * Very useful for managing first in first out activities throughout the system.
 * @protected
 * @class
 * 
 * @example
    process.THREADLY_QUEUE: {
        //queue compulsory details
        statusRunning: { status: { process: { running: true, completed: false } } },
        statusCompleted: { status: { process: { running: false, completed: true } } },
        statusSuccess: { status: { process: { running: false, completed: true } }, results: { last_success_at: new Date(), last_fail_at: null } },
        statusFail: { status: { process: { running: false, completed: false } }, results: { last_success_at: null, last_fail_at: new Date() } }

        debug: opts && opts.debug
        minute_crons: {{cron_name: instruction()}, {some_cron_name: instruction()}, ...}
                        ...
        //Cron manager functions
        function_name_that_belong_to_cron_manager: the_function(), //see #getFunctions(opts)
                        ...
        //Crons and their schedule
        some_cron_name: schedule(),
        other_cron_name: schedule(),
        ever_other_cron_name: schedule(),
    }
 */

export class QueueManager {
    #QUEUE_THROBBER: any = new Throbber();

    /**
     * Puts all queues together and attach it to process
     * @constructor
     * @memberof Core
     */
    constructor(opts) {
        this.#QUEUE_THROBBER = this.#QUEUE_THROBBER.init();
        // this.#build(opts)
        const queues = this.#getQueues()
        var functions = this.#getFunctions(opts)
        var constants = this.#getConstants()
        const queuesArray = Object.keys(queues)

        //build queueManager library and attach it to node process
        this.addAllListeners(queuesArray, queues)
        const utils = Object.assign(queues, Object.assign(functions, constants))
        Object.assign(this, utils)
        process.THREADLY_QUEUE.Manager = this
        process.THREADLY_QUEUE.Queue = this.#getQueues()
        this.#QUEUE_THROBBER.succeed('THREADLY-QUEUE Ready!')
    }
    /**
     * Returns all queues defined in the system. Defined by {{queue_name: Queue.Queue}, {queue_name: Queue.Queue},...}
     * @private
     * @function
     * @memberof Core
     * @return {Object.<String, Queue.Queue>} Object of queue name and our internal Queue as values.
     */
    #getQueues() {
        return {
            MULTIMEDIA_QUEUE: multimediaQueue.get(),
        };
    }
    /**
    * Gets queue property that exists universally across all types of queues (Multimedia Queue,...) g. E.g {process.running: Boolean}, {process.completed: Boolean}
    * @private
    * @async
    * @function
    * @memberof Core
    * @returns {{statusRunning : {status: { process: {running: Boolean, completed: Boolean }}}, statusCompleted : {status: { process: {running: Boolean, completed: Boolean }}} , statusSuccess : {status: { process: {running: Boolean, completed: Boolean }}, results: { last_success_at: Date | undefined, last_fail_at: Date | undefined }}, statusFail: {status: { process: {running: Boolean, completed: Boolean }}, results: { last_success_at: Date | undefined, last_fail_at: Date | undefined }}}}
    */

    #getConstants() {
        return {
            //MULTIMEDIA_QUEUE is one queue in our system. The system can handle multiple queues
            MULTIMEDIA_QUEUE: multimediaQueue.info
        };
    }
    /**
     * Functions that belongs to our QueueManager library 
     * @private
     * @async
     * @function
     * @memberof Core
     * @param {*} opts options
     * @returns {Object} object containing functions
     */
    #getFunctions(opts) {
        return {
            debug: opts && opts.debug
        };
    }
    /**
     * Let's you know if Queue Manager is ready
     * @public
     * @function
     * @memberof Core
     * @returns {Boolean} true if has queue manager is ready and false otherwise.
     */
    init() {
        //When a QueueManager has initialized, process.THREADLY_QUEUE will exist.
        if (!process.THREADLY_QUEUE) return false
        //process.NOTIFICATIONS_SOCKET.to().send(this.getQueueManager)
        return true;
    }
    /**
     * Attaches all Queue's work functions (active, stalled, error) to internal system.
     * @public
     * @async
     * @function
     * @memberof Core
     * @param {[String]} queuesArray An array containing the names of all the queues you want to add 
     * @param {Object.<String, Queue.Queue>} queues object of queue name and our internal Queue as values. 
     */
    addAllListeners(queuesArray, queues) {
        const self = this
        queuesArray.map( q => {
            queues[q].setOnErrorListener()
            queues[q].onActiveListener()
            queues[q].onStalledListener()
            queues[q].onProgressListener()
            queues[q].onFailedListener()
            queues[q].onRemovedListener()
        })
    }
    /**
     * Processes the first job in every queue that exist in the system
     * @public
     * @async
     * @function
     * @memberof Core
     * @param {[String]} queuesArray names of system queues. E.g. Multimedia, Billing, e.t.c.
     * @param {Object} callback callback
     */
    async runQueues(queuesArray, callback) {
        const self = this;
        const systemQueues = this.#getQueues();
        queuesArray.map(async qName => {
            systemQueues[qName].process(callback)
        })

    }
    /**
     * Returns QueueManager as object of system queues, each containing their jobs
     * @private
     * @async
     * @function
     * @memberof Core
     * @returns {{jobs: Promise<[Object]>}} Queues defined in the system
     */
    async get() {
        const QUEUES = {
            MULTIMEDIA_QUEUE: { jobs: await process.THREADLY_QUEUE['MULTIMEDIA_QUEUE'].getJobs() },
        }
        return QUEUES
    }
    /**
     * Deletes a Queue from QueueManager's system
     * @public
     * @async
     * @function
     * @memberof Core
     * @param {String} classification queue classification. {@see {@link QueueClassification}}
     * @returns {Object} data
     */
    async deleteQueue(classification) {
        await this.#getQueues()[classification + '_QUEUE'].empty();
    }
    /**
     * Runs the first job of the system queue you passed in. Remember system queues are things like MultimediaQueue, BillingQueue and others.
     * @public
     * @async
     * @function
     * @memberof Core
     * @param {String} classification system queue classification (see {@link QueueClassification})
     * @param {Function} callback optional callback
     */
    async runQueue(classification, job, callback) {
        await this.#getQueues()[classification + '_QUEUE'].run(job, callback);
    }
    /**
     * Runs the first job of the system queue you passed in. Remember system queues are things like MultimediaQueue, BillingQueue and others.
     * @public
     * @async
     * @function
     * @memberof Core
     * @param {String} classification system queue classification (see {@link QueueClassification})
     * @param {Function} job what instructions/job do you want to add to queue?
     * @param {Function} callback optional callback
     */
    async addJobToQueue(classification, job){
        await this.#getQueues()[classification + '_QUEUE'].addJob(job)
    }
}
export default new QueueManager({debug: config.env ===  'dev'});
