const express = require('express');
const http = require('http');
const cors = require('cors');

const { initSocket } = require('./socket');
const { login } = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server running');
});

app.get('/state', async (req, res) => {
  const redis = require('./redis');

  const TOTAL = 100000;
  const result = [];

  for (let i = 0; i < TOTAL; i++) {
    const bit = await redis.getBit('checkboxes', i);
    result.push(bit);
  }

  res.json(result);
});

app.post('/login', login);

const server = http.createServer(app);

initSocket(server);

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
