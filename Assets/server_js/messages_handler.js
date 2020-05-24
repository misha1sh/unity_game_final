const MessageType = require('./MessageType');

const logger = require("./logger");
const Util = require("./Util");
const Room = require("./Room");
const JsonRequest = require("./JsonRequest");
const data = require("./data");
const rooms = data.rooms;
const match_maker = require("./match_maker");

function handle_message(data, client) {
    if (!(data instanceof Buffer)) {
        logger.warn("got unknown data type " + data.prototype + " from client " + client);
        return;
    }

    if (data.length < 6) {
        logger.warn("got data without header: " + data.length + " from client#" + client.id);
        return;
    }

    const messageTypeOrd = data.readInt8(0);
    const roomId = data.readInt32LE(1);
    const flags = data.readInt8(5);
    data = data.slice(6);
    

    if (data.length !== 46)
        logger.debug("client#" + client.id + " -> server#" + roomId + " " +
            Util.MessageTypeToString(messageTypeOrd) + " " + Util.MessageFlagsToString(flags) + " len: " + data.length);

    if (messageTypeOrd === MessageType.JoinGameRoom) {
        if (data.length !== 0) {
            logger.warn("got JoinGameRoom with incorrect length " + data.length + "from client#"+client.id+". should be 0");
            return;            
        }

        if (!rooms.has(roomId))
            new Room(roomId);
        rooms.get(roomId).AddClient(client);
        return;
    }

    if (!rooms.has(roomId)) {
        logger.warn("client#" + client.id + " send message to room#" + roomId + "  which is not exists");
        return;
    }

    const room = rooms.get(roomId);
    if (!room.clients.has(client)) {
        logger.warn("client#" + client.id + " send message to room#" + roomId + " before joining it");
        return;
    }

    switch (messageTypeOrd) {
        case MessageType.SimpleMessage:
            room.HandleSimpleMessage(client, data, flags);
            break;

        case MessageType.UniqMessage:
            const uid = data.readBigInt64LE(0);
            data = data.slice(8);
            room.HandleUniqMessage(client, uid, data, flags);
            break;

        case MessageType.AskMessage:
            if (data.length !== 8) {
                logger.warn("got AskMessage with incorrect length " + data.length + "from client#"+client.id+". should be 8");
                return;
            }

            const startIndex = data.readInt32LE(0);
            const endIndex = data.readInt32LE(4);

            room.HandleAskMessage(client, startIndex, endIndex, flags);
            break;

        case MessageType.LeaveGameRoom:
            if (data.length !== 0) {
                logger.warn("got LeaveGameRoom with incorrect length " + data.length + "from client#"+client.id+". should be 0");
                return;
            }
            room.RemoveClient(client);
            break;
        case MessageType.JSON:
            const json = Util.json_safe_parse_buffer(data);
            if (json == null) {
                logger.warn("got bad json message from client#"+client.id);
            }
            
            if (!('_type' in json)) {
                logger.warn("got json message without '_type': " + json + " from client#"+client.id);
                return;
            }

            if (!('_id' in json)) {
                logger.warn("got json message without '_id': " + json + " from client#"+client.id);
                return;
            }
            logger.debug("client#" + client.id + " -> server#" + roomId + " JSON#" + json["_id"] + " " + json["_type"] + " " + JSON.stringify(json));
            
            const request = new JsonRequest(client, room, json);
            room.HandleJsonRequest(request);
            break;
            
        default:
            logger.warn("got unknown message type: " + messageTypeOrd);
            return;
    }

}

module.exports = {
    handle_message: handle_message
};