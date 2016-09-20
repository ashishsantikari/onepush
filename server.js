// DEPENDENCIES
// ============
var express = require("express"),
    http = require("http"),
    port = (process.env.PORT || 8001),
    server = module.exports = express();

// SERVER CONFIGURATION
// ====================
server.use(express.static('public'));

// Start Node.js Server
http.createServer(server).listen(port);
console.log('Please go to http://localhost:' + port + ' to start using the client application in standalone mode!');