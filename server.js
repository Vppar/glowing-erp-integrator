
var PORT = process.env.NODE_PORT || 8080;

var server = require('./lib/app')();

server.listen(PORT);
console.log('Serving', server.name, 'on port', PORT, '...');


