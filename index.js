var server = require('./server');
var serverPort = process.env.PORT || 8080;
server.listen(serverPort, function() {
  console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
});
