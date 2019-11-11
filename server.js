'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  ws.on('message', function (message) {
    console.log('get message ' + message);
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({
        time: new Date().toTimeString(),
        data: message
      }));
    });
  });

});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify({ time: new Date().toTimeString() }));
  });
}, 1000);
