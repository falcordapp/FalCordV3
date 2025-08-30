const express = require('express');
const globalUtils = require('../helpers/globalutils');
const { logText } = require('../helpers/logger');
const { channelPermissionsMiddleware, rateLimitMiddleware, instanceMiddleware } = require('../helpers/middlewares');
const fs = require('fs');
const multer = require('multer');
const Snowflake = require('../helpers/snowflake');
const path = require('path');

const upload = multer();
const router = express.Router({ mergeParams: true });

router.param('messageid', async (req, res, next, messageid) => {
    req.message = await global.database.getMessageById(messageid);
    
    next();
});

// router.get("/:memberid", async (req, res) => {
router.get("/", async (req, res) => {
    try {
        const creator = req.account;

        if (creator == null) {
            return res.status(401).json({
                code: 401,
                message: "Unauthorized"
            });
        }

        const channel = req.channel;

        if (channel == null) {
            return res.status(404).json({
                code: 404,
                message: "Unknown Channel"
            });
        }

        let limit = parseInt(req.query.limit) || 200;

        if (limit > 200) {
            limit = 200;
        }
        let messages = await global.database.getChannelMessages(channel.id, limit, req.query.before, req.query.after, includeReactions);

        for(var msg of messages) { // ?
            if (msg.id === '1279218211430105089') {
                msg.content = msg.content.replace("[YEAR]", req.client_build_date.getFullYear());
            }

        return res.status(200).json(messages);
    } catch (error) {
        logText(error, "error");

        return res.status(500).json({
            code: 500,
            message: "Internal Server Error"
        });
    }
});

router.post("/", instanceMiddleware("VERIFIED_EMAIL_REQUIRED"), handleJsonAndMultipart, channelPermissionsMiddleware("SEND_MESSAGES"), rateLimitMiddleware(global.config.ratelimit_config.sendMessage.maxPerTimeFrame, global.config.ratelimit_config.sendMessage.timeFrame), async (req, res) => {
    try {
        const author = req.account;

        if (author == null) {
            return res.status(401).json({
                code: 401,
                message: "Unauthorized"
            });
        }
        
        const account = author;

        if (req.channel == null) {
            return res.status(404).json({
                code: 404,
                message: "Unknown Channel"
            });
        }

        const mentions_data = globalUtils.parseMentions(req.body.content);

        if ((mentions_data.mention_everyone || mentions_data.mention_here) && !await global.permissions.hasChannelPermissionTo(req.channel, req.guild, author.id, "MENTION_EVERYONE")) {
            mentions_data.mention_everyone = false;
            mentions_data.mention_here = false;
        }
        
        //Coerce tts field to boolean
        req.body.tts = req.body.tts === true || req.body.tts === "true";

        if (!req.channel.recipients) {
            if (!req.guild) {
                return res.status(403).json({
                    code: 403,
                    message: "Unknown channel"
                });
            }
            
            if (!req.channel.guild_id) {
                return res.status(403).json({
                    code: 403,
                    message: "Unknown channel"
                });
            }
        }

        if (req.channel.recipients) {
            //DM/Group channel rules
            
            //Disable @everyone and @here for DMs and groups
            mentions_data.mention_everyone = false;
            mentions_data.mention_here = false;
            
            if (req.channel.type !== 1 && req.channel.type !== 3) {
                //Not a DM channel or group channel
                return res.status(404).json({
                    code: 404,
                    message: "Unknown Channel"
                });
            }

            if (req.channel.type == 1) {
                //DM channel
                
                //Need a complete user object for the relationships
                let recipientID = req.channel.recipients[req.channel.recipients[0].id == author.id ? 1: 0].id;
                let recipient = await global.database.getAccountByUserId(recipientID);

                if (!recipient) {
                    return res.status(404).json({
                        code: 404,
                        message: "Unknown Channel"
                    });
                }

                let ourFriends = account.relationships;
                let theirFriends = recipient.relationships;
                let ourRelationshipState = ourFriends.find(x => x.user.id == recipient.id);
                let theirRelationshipState = theirFriends.find(x => x.user.id == account.id);

                if (!ourRelationshipState) {
                    ourFriends.push({
                        id: recipient.id,
                        type: 0,
                        user: globalUtils.miniUserObject(recipient)
                    });

                    ourRelationshipState = ourFriends.find(x => x.user.id == recipient.id);
                }

                if (!theirRelationshipState) {
                    theirFriends.push({
                        id: account.id,
                        type: 0,
                        user: globalUtils.miniUserObject(account)
                    })

                    theirRelationshipState = theirFriends.find(x => x.user.id == account.id);
                }

                if (ourRelationshipState.type === 2) {
                    //we blocked them
                    
                    return res.status(403).json({
                        code: 403,
                        message: "You've blocked this user."
                    })
                }

                if (theirRelationshipState.type === 2) {
                    //they blocked us
                    
                    return res.status(403).json({
                        code: 403,
                        message: "You've been blocked by this user."
                    })
                }

                let guilds = await global.database.getUsersGuilds(recipient.id);
                let ourGuilds = await global.database.getUsersGuilds(account.id);
                
                let dmsOff = [];
        
                for(var guild of guilds) {
                    if (recipient.settings.restricted_guilds.includes(guild.id)) {
                        dmsOff.push(guild.id);
                    }
                }

                if (dmsOff.length === guilds.length && !globalUtils.areWeFriends(account, recipient)) {
                    return res.status(403).json({
                        code: 403,
                        message: "This user has direct messages turned off"
                    });
                }

                let shareMutualGuilds = false;

                for(var guild of guilds) {
                    if (ourGuilds.find(x => x.id === guild.id)) {
                        shareMutualGuilds = true;
                        break;
                    }
                }

            const channelDir = path.join('.', 'www_dynamic', 'attachments', req.channel.id);

        //Write message
        const message = await global.database.createMessage(req.guild ? req.guild.id : null, req.channel.id, author.id, req.body.content, req.body.nonce, file_details, req.body.tts, mentions_data, null, embeds);

        if (!message)
            throw "Message creation failed";
        
        //Dispatch to correct recipients(s) in DM, group, or guild
        if (req.channel.recipients) {
            await globalUtils.pingPrivateChannel(req.channel);
            await global.dispatcher.dispatchEventInPrivateChannel(req.channel, "MESSAGE_CREATE", message);
        } else {
            await global.dispatcher.dispatchEventInChannel(req.guild, req.channel.id, "MESSAGE_CREATE", message);
        }

        //Acknowledge immediately to author
        const tryAck = await global.database.acknowledgeMessage(author.id, req.channel.id, message.id, 1); // flag 1 for voice calls/system messages

        if (!tryAck)
            throw "Message acknowledgement failed";

        await global.dispatcher.dispatchEventTo(author.id, "MESSAGE_ACK", {
            channel_id: req.channel.id,
            message_id: message.id
        });

        return res.status(200).json(message);
        
    }  catch (error) {
        logText(error, "error");

        return res.status(500).json({
            code: 500,
            message: "Internal Server Error"
        });
    }
});

module.exports = router;
