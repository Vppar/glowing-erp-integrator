
var PORT = process.env.NODE_PORT || 8080;

var Server = require('./lib/App')();

Server.listen(PORT);

console.log('Serving', Server.name, 'on port', PORT, '...');