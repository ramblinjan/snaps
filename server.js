const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;

const poets = ['Poet A', 'Poet B', 'Poet C'];
const votes = Object.fromEntries(poets.map(p => [p, 0]));

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/poets', (req, res) => {
  res.json(poets);
});

io.on('connection', socket => {
  socket.emit('votes', votes);

  socket.on('vote', poet => {
    if (votes.hasOwnProperty(poet)) {
      votes[poet] += 1;
      io.emit('votes', votes);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
