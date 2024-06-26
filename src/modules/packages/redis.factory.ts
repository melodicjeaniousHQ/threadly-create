//Gets Quote Images from multimedia controller and redistribute on instagram and pinterest

import { Module, UseGuards } from "@nestjs/common";
import MultimediaController from "../../controllers/multimedia.controller";
import { Roles } from "../../decorators/roles.decorator";
import IGPostDTO from "../../dto/igPost.dto";
import { UserRoles } from "../../enums/userRoles.enum";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import Throbber from "../../helpers/throbber";
import { RedisService } from "../../services/core/redis";
import HashMapService from "../../services/maps/hashmap";

/**
 * @fileoverview Manages the Redistribution channels
 * @file Attach Instagram and Pinterest to distribution channel.
 * 
 * The manager has to list the clients, avoid using pyramid schemes to initialize clients.
 * be close to the owner so they can give you rest.
 */
enum InstagramRedisClients{
    IRC_JOHN_DOE,
}
enum PinterestRedisClients{
    PRC_JOHN_DOE
}
/**
 * The manager manages via a list of platforms. In Order with RedisClient's time.
 */
enum RedisClientHost{
    INSTAGRAM,
    PINTEREST,
}
/**
 * TODO: Make a graph of all the people who follow me on these platforms and put them in a little model
 * Filter by the people who engaged with me, and add them to my CRM for retargetting. 
 */

/**
 * @module RedisFactory - A good system has multiple people as deligates and assigns smart roles to them.
 * Testimonial Systems. A manager manages the platforms, not the accounts. He has to have his
 * children education paid for at the top schools so he makes it part of him to get the good work done.
 */
@Module({
    imports: [
    ],
    providers: [RedisService],
})
export class RedisFactory {
    /**
     * @private
     * @memeber
     * Instagram Client Sales Manager
     */
    private instagramCliTab = [new HashMapService<InstagramRedisClients.IRC_JOHN_DOE,RedisService>()];
    /**
     * @private
     * @memeber
     * Pinterest Client Sales Manager
     */
    private pinterestCliTab = [new HashMapService<PinterestRedisClients.PRC_JOHN_DOE,RedisService>()];
    /**
     * Private loader instructions (Documentation)
     * @private
     * @member
     */
    private redisThrobber = new Throbber();

    constructor() {

    }
    /**
     * @function uploadToInstagram Cache's post and begins upload process
     * @param {IGPostDTO} content - The content to be uploaded to instagram
     */
    async uploadToInstagram(content: IGPostDTO){
        try{
            let johnsProcessService = this.instagramCliTab[0].get(InstagramRedisClients.IRC_JOHN_DOE);
            const johnsContentSetting = johnsProcessService.setMajor(content.id, content.text, content.author)

            

            
            
            //use content and get direct path to content output
            //TODO: Put bot upload service here
            //Archive the saved content output
        }catch(err){
            this.redisThrobber.fail("Redis Manager: " + err)
        }
    }
    /**
     * Permission based request for full instagram service across all accounts.
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoles.OWNER,UserRoles.CUSTOMER_SERVICE)
    requestInstagramService(){
        return this.instagramCliTab;
        //TODO: Make a permission based request for full instagram service across all accounts.
    }
    /**
     * Permission based request for full pinterest service across all accounts.
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoles.OWNER,UserRoles.CUSTOMER_SERVICE)
    requestPinterestService(){
        return this.instagramCliTab;
        //TODO: Make a permission based request for full instagram service across all accounts.
    }

}