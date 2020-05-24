const MessageType = require('./MessageType');
const MessageFlags = require('./MessageFlags');
const logger = require("./logger");
const Util = require("./Util");

const data = require("./data");
const rooms = data.rooms;
const matches = data.matches;

const JsonRequest = require("./JsonRequest");

class Room {
    constructor(id) {
        this.id = id;
        this.clients = new Set();
        this.usedUniqIds = new Set();
        this.importantMessages = new Map();
        this.notImportantMessages = new Map();
        this.lastMessageId = -1;
        rooms.set(this.id, this);
    }

    AddClient(client) {
         this.clients.add(client);
         client.roomIds.add(this.id);
    }

    RemoveClient(client) {
        this.clients.delete(client);
        if (this.clients.size === 0) {
            rooms.delete(this.id);
            if (matches.has(this.id)) {
                matches.delete(this.id);
            }
        }
    }

    CreateMessageWithId(message, messageId) {
        const messageWithId = Buffer.allocUnsafe(8);
        messageWithId.writeInt32LE(messageId, 0);
        messageWithId.writeInt32LE(this.id, 4);
        return Buffer.concat([messageWithId, message]);
    }

    BroadcastMessage(message, flags) {
        const messageId = this.lastMessageId + 1;
        this.lastMessageId++;

        message = this.CreateMessageWithId(message, messageId);

        if ((flags & MessageFlags.IMPORTANT) !== 0) {
            this.importantMessages.set(messageId, message);
        } else {
            this.notImportantMessages.set(messageId, message);
            if (this.notImportantMessages.size > 1100) {
                let it = this.notImportantMessages.keys();
                for (let i = 0; i < 100; i++) {
                    this.notImportantMessages.delete(it.next().value);
                }
            }
        }
        //for (int i = 0; i < 1; i++) { // random.Next(0, 2)
        for (let client of this.clients) {
            this.SendToClient(client, message, messageId);
            /* if (flags.HasFlag(MessageFlags.IMPORTANT) || true)
                 UberDebug.LogChannel("SERVER", $"server{id}->client{client} {message.Length} {flags}");
         }*/
            //}
        }
    }

    HandleSimpleMessage(client, message, flags) {
        this.BroadcastMessage(message, flags);
    }

    HandleUniqMessage(client, uid, message, flags) {
        if (this.usedUniqIds.has(uid)) return;
        this.usedUniqIds.add(uid);
        this.BroadcastMessage(message, flags);
    }

    HandleAskMessage(client, startIndex, endIndex, flags) {
        if ((startIndex > endIndex || endIndex > this.lastMessageId) && endIndex !== -1) {
            logger.warn("AskMessage from " + client.id + " is incorrect. " +
                "startIndex:" + startIndex + " endIndex:" + endIndex + " lastMessageId: " + this.lastMessageId);
            return;
        }

        if (startIndex < 0) {
            startIndex = this.lastMessageId + startIndex;
            if (startIndex < 0)
                startIndex = 0;
        }

        if (endIndex === -1)
            endIndex = this.lastMessageId;

        const only_important = (flags & MessageFlags.SEND_ONLY_IMPORTANT) !== 0;

        for (let i = startIndex; i <= endIndex; i++) {
            if (this.importantMessages.has(i)) {
                this.SendToClient(client, this.importantMessages.get(i), i);
            } else if (this.notImportantMessages.has(i) && !only_important) {
                this.SendToClient(client, this.notImportantMessages.get(i), i);
            } else {
                if (!only_important)
                    logger.warn("trying to get too many not important messages. sending empty");
                this.SendToClient(client, this.CreateMessageWithId(Util.EmptyMessage, i, this.id), i);
            }
        }
    }
    
    HandleJsonRequest(request) {
        logger.warn("unhandled jsonrequest to room#" + this.id + " from client#" + request.client.id + " " + JSON.stringify(request.json));
    }

    SendToClient(client, data, messageId) {
        if (data.length !== 54)
            logger.debug("server#" + this.id + " -> client#" + client.id + " " + messageId  + " len: " + data.length);
        client.send(data);
    }
}

module.exports = Room;