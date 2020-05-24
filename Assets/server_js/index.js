
const data = require('./data');




const uniqid = require('uniqid');

const messages_handler = require("./messages_handler");
const logger = require("./logger");
const wss = require("./websocketserver");


wss.on('connection', function connection(ws, request) {
    ws.id = uniqid();
    ws.roomIds = new Set();
    logger.info("Connected client#" + ws.id);
    
    ws.on('message', function incoming(data) {
        messages_handler.handle_message(data, ws);
    });
    ws.on("close", function() {
        logger.info("Disconnected client#" + ws.id);
        for (let roomid of ws.roomIds) {
            if (data.rooms.has(roomid)) {
                data.rooms.get(roomid).RemoveClient(ws);
            }
        }
    });
});


const http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
    res.write("<h3>clients:</h3><pre>");
    for (let client of wss.clients) {
        res.write(client.id + "\n");
    }
    res.write("</pre><h3>matches:</h3><pre>");
    for (let match of data.matches.values()) {
        res.write("match#" + match.id + "  name: '" + match.name + "'  maxPlayersCount: " + match.maxPlayersCount + "<br/>");
        for (let client of match.clients) {
            res.write("  client#" + client.id + "<br/>");
        }
    }

    res.write("</pre><h3>rooms:</h3><pre>");
    for (let room of data.rooms.values()) {
        res.write("room#" + room.id + "<br/>");
        for (let client of room.clients) {
            res.write("  client#" + client.id + "<br/>");
        }
    }
    res.end('</pre><script>setInterval(function() {document.location.reload()}, 2000) </script>');
}).listen(8886);