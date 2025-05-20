const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = process.env.PORT || 3000;

const poets = ['Poet A', 'Poet B', 'Poet C'];
const votes = Object.fromEntries(poets.map(p => [p, 0]));
const clients = new Set();

function sendFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

function broadcastVotes() {
  const data = `data: ${JSON.stringify(votes)}\n\n`;
  for (const res of clients) {
    res.write(data);
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'GET' && url.pathname === '/') {
    return sendFile(res, path.join(__dirname, 'public', 'index.html'), 'text/html');
  }

  if (req.method === 'GET' && url.pathname === '/app.js') {
    return sendFile(res, path.join(__dirname, 'public', 'app.js'), 'text/javascript');
  }

  if (req.method === 'GET' && url.pathname === '/poets') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(poets));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write('\n');
    clients.add(res);
    req.on('close', () => {
      clients.delete(res);
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/vote') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { poet } = JSON.parse(body);
        if (poet && votes.hasOwnProperty(poet)) {
          votes[poet] += 1;
          broadcastVotes();
          res.writeHead(204, { 'Access-Control-Allow-Origin': '*' });
          res.end();
        } else {
          res.writeHead(400);
          res.end('Invalid poet');
        }
      } catch {
        res.writeHead(400);
        res.end('Invalid body');
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
