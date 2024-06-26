import { Injectable } from "@nestjs/common";
import { LogglyService } from "../services/utils/loggly.service";

const ora = require('ora');
/**
 * Interface for the Throbber class
 */
interface Throbber {
    init(msg?: string): void;
    succeed(msg: string): void;
    warn(msg: string): void;
    fail(msg: string): void;
}

/**
 * System throbber interface
 */
interface SystemThrobber {
    succeed(text: string): void;
    fail(text: string): void;
    stop(text: string): void;
    warn(text: string): void;
}

/**
 * Helper class for anything that has to with console logging.
 * Interaction surveillance app
 * @protected
 * @class
 * @classdesc Custom Console Throbber with logging side-effect.
 */
@Injectable()
class Throbber {
    /**
     * Internal app throbber
     * @private
     * @member
     */
    #appStartThrobber

    /**
     * Internal app throbber logger
     * @private
     * @member
     */
    #logger = new LogglyService();
    /**
     * Gets elegant console throbber ready
     * @constructor
     * @memberof Helper
     */
    constructor() {
    }
    /**
     * Initializes with a message of your choice
     * @public
     * @function
     * @memberof Helper
     * @param {String | undefined} msg message you want to display
     */
    init(msg?: string) {
        this.#appStartThrobber = ora();
        if (!msg){
            this.#appStartThrobber.start(msg)
        }
        this.#appStartThrobber.start()
        this.#logger.log("Throbber initialized:" + msg)
        this.#logger.verbose("Throbber started loading.")
        return this;
    }
    /**
     * Displays a YES/SUCCESS message 
     * @public
     * @function
     * @memberof Helper
     * @param {String} msg message to display
    */
   succeed(msg) {
       this.#appStartThrobber.succeed(msg)
       this.#logger.log("Throbber succeeded:" + msg)
       this.#logger.verbose("Throbber succeeded in message delivery.")
    }

    /**
     * Displays a MAYBE/WARN message 
     * @public
     * @function
     * @memberof Helper
     * @param {String} msg message to display
     */
    warn(msg) {
        this.#appStartThrobber.warn(msg)
        this.#logger.warn("Throbber warn:" + msg)
    }

    /**
     * Displays a NO/FAIL message
     * @public
     * @function 
     * @memberof Helper
     * @param {String} msg message to display
     */
    fail(msg) {
        this.#appStartThrobber.fail(msg)
        this.#logger.error("Throbber failed:", msg)
    }
}

export default Throbber;