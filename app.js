const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);

const port = 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const players = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);


  players[socket.id] = "noone";
  io.emit('updatePlayers', players);

  socket.on('disconnect', ()=>{
  	console.log("disconnected");
  	// delete player from frontend
  	io.emit('reloadPage');

  	// delete player from backend
  	delete players[socket.id];

  	io.emit('updateWheel', 0, 0);


  })

  socket.on('spinWheel', () => {
    io.emit('updateWheel', Math.ceil(Math.random() * 3600), Math.ceil(Math.random() * 3600));
  });


  console.log(players);
});

server.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
