const data = require("./data");
const Room = require("./Room");
const rooms = data.rooms;
const matches = data.matches;
const logger = require("./logger");

const validate = require('json-schema');
const toJsonSchema = require('to-json-schema');
const JsonRequest = require("./JsonRequest");

const CreateMatchSchema = toJsonSchema({
    roomid: 123,
    name: "room#test",
    maxPlayersCount: 4,
    state: 0
}, {required: true}); // TODO: possible attack with invalid values

const GetMatchesList = toJsonSchema({
}, {required: true});


const JoinMatch = toJsonSchema({
    name: "player#123",
    matchid: 123
}, {required: true});


const ChangeMatchState = toJsonSchema({
    matchid: 123,
    state: 1
}, {required: true});

const validation_schemas = {
    "CreateMatch": CreateMatchSchema,
    "GetMatchesList": GetMatchesList,
    "JoinMatch": JoinMatch,
    "ChangeMatchState": ChangeMatchState
};





class Match extends Room {
    constructor(roomid, name, maxPlayersCount, state) {
        super(roomid);
        this.name = name;
        this.maxPlayersCount = maxPlayersCount;
        this.state = state;
        matches.set(roomid, this);
    }
    playersCount = this.clients.size;


    GetMatchInfo() {
        let players = [];
        for (let client of this.clients){
            players.push(client.name);
        }
        return {
            roomid: this.id,
            name: this.name,
            players: players,
            maxPlayersCount: this.maxPlayersCount,
            state: this.state
        }
    }
    
    SendMatchInfo() {
        let mi = this.GetMatchInfo();
        for (let client of this.clients) {
            (new JsonRequest(client, this, {"_id": -1})).respond({"match": mi})
        }
    }

    RemoveClient(client) {
        super.RemoveClient(client); 
        this.SendMatchInfo()
    }
}

class MatchMakerRoom extends Room {
    
    CreateMatch(json) {
        new Match(json.roomid, json.name, json.maxPlayersCount, json.state);
    }
    
    RemoveClient(client) {
        this.clients.delete(client);  // no auto room delete
    }

    HandleJsonRequest(request) {
        const client = request.client;
        const json = request.json;
        
        if (json['_type'] in validation_schemas) {
            const res = validate.validate(json, validation_schemas[json['_type']]);
            if (!res.valid) {
                logger.warn("client#"+client.id +" send invalid json " + json['_type'] + " " + res.errors.map(val=> val["property"] + " " + val["message"]).join("; "));
                request.respond({"result": "invalid"});
                return;
            }
        }
        
        switch (json['_type']) {
            case 'CreateMatch':
                if (rooms.has(json.roomid)) {
                    request.respond({"result": "error", "message": "Roomid already exists"});
                    return;
                }
                this.CreateMatch(json);
                request.respond({"result": "success"});
                break;
            case 'GetMatchesList':
                let res = [];
                for (let match of matches.values()) {
                    if (match.state !== 0) continue;
                    res.push(match.GetMatchInfo());
                }
                request.respond({"result": "success", "matches": res});
                break;
            case 'JoinMatch':
                if (!matches.has(json["matchid"])) {
                    request.respond({"result": "error", "message": "This match does not exists"});
                    return;
                }
                const match = matches.get(json["matchid"]);
                if (match.playersCount >= match.maxPlayersCount) {
                    request.respond({"result": "error", "message": "Too many players in match", "match": match.GetMatchInfo()});
                    return;
                }
                
                client.name = json["name"];
                match.AddClient(client);
                request.respond({"result": "success", "match": match.GetMatchInfo()});


                for (let otherClient of match.clients) {
                    if (request.client === otherClient)
                        continue;
                    
                    (new JsonRequest(otherClient, this, {"_id": -1})).respond({"match": match.GetMatchInfo()})
                }
                
                break;
                
            case 'ChangeMatchState': {
                if (!matches.has(json["matchid"])) {
                    request.respond({"result": "error", "message": "This match does not exists"});
                    return;
                }
                const match = matches.get(json["matchid"]);
                match.state = json["state"];
                request.respond({"result": "success", "match": match.GetMatchInfo()});
                match.SendMatchInfo();
                break;
            }
    
                
            default:
                logger.warn("got unknown json message type: '" + json['_type'] + "' from client#" + request.client.id);
                break;
        }
    }
}

const matchmaking_room_id = 42;
const matchmaking_room = new MatchMakerRoom(matchmaking_room_id);
data.rooms.set(matchmaking_room_id, matchmaking_room);

/*
exports.handle_create_match = function (client, matchInfo) {
      
};
            
*/





exports.Match = Match;
