const http = require('http');
const app = require('./app');

// provide a port through environment variable
// process.env accesses the variables of NodeJS and set on the server you deploy on eg. mongoose
const port = process.env.PORT || 3000;

//to create a server, we need to add a listener
const server = http.createServer(app);

server.listen(port);












// TRY POSTMAN SOMETIME