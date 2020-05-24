const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');
const http = require("http");

// Serve up public/ftp folder
const serve = serveStatic('webgl', {
    'index': "index.html",
    'setHeaders': setHeaders
});

/*
https://forum.unity.com/threads/changes-to-the-webgl-loader-and-templates-introduced-in-unity-2020-1.817698/
    .gz files should be served with a Content-Encoding: gzip response header.
    .br files should be served with a Content-Encoding: br response header.
    .wasm, .wasm.gz or .wasm.br files should be served with a Content-Type: application/wasm response header.
    .js, .js.gz or .js.br files should be served with a Content-Type: application/javascript response header.
 */
function setHeaders (res, path) {
    console.log(path);
    if (path.endsWith(".gz")|| path.endsWith(".unityweb")) {
        res.setHeader( "Content-Encoding",  "gzip");
    } else if (path.endsWith(".br") /*|| path.endsWith(".unityweb")*/) {
        res.setHeader("Content-Encoding",  "br");
    }
    
    if (path.endsWith(".wasm") || path.endsWith(".wasm.gz") || path.endsWith(".wasm.br")) {
        res.setHeader("Content-Type", "application/wasm");
    } else if (path.endsWith(".js") || path.endsWith(".js.gz") || path.endsWith(".js.br")) {
        res.setHeader("Content-Type", "application/javascript");
    }
}

// Create server
const httpServer = http.createServer(function onRequest (req, res) {
    serve(req, res, finalhandler(req, res));
});


httpServer.listen(8080);

module.exports = httpServer;
