const logger = require("./logger");


let jsonCommandTypeBuf = Buffer.allocUnsafeSlow(1);
jsonCommandTypeBuf.writeUInt8(254);


class JsonRequest {
    constructor(client, room, json) {
        this.client = client;
        this.room = room;
        this.json = json;
    }
    
    respond(jsonResponse) {
        jsonResponse["_id"] = this.json["_id"];

        logger.debug("server#" + this.room.id + " -> client#" + this.client.id + " JSON " + JSON.stringify(jsonResponse));
        let encoded = Buffer.from(JSON.stringify(jsonResponse), "utf8");
        encoded = Buffer.concat([jsonCommandTypeBuf, encoded]);

        let message = this.room.CreateMessageWithId(encoded, -1);
        this.room.SendToClient(this.client, message, -1);
    }
}

module.exports = JsonRequest;