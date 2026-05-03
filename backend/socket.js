const { Server } = require('socket.io');
const redis = require('./redis');
const rateLimit = require('./rateLimiter');
const { verifyToken } = require('./auth');

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    const user = verifyToken(token);

    if (!user) {
      return next(new Error("Unauthorized"));
    }

    socket.user = user;
    next();
  });

  const subscriber = redis.duplicate();

  (async () => {
    await subscriber.connect();

    await subscriber.subscribe('checkbox_updates', (message) => {
      io.emit('checkbox_update', JSON.parse(message));
    });
  })();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.user.userId);

    socket.on('toggle', async ({ index, value }) => {

      const allowed = await rateLimit(socket.user.userId);
      if (!allowed) return;

      await redis.setBit('checkboxes', index, value);

      await redis.publish('checkbox_updates', JSON.stringify({
        index,
        value
      }));
    });

    socket.on('disconnect', () => {
      console.log('Disconnected:', socket.user.userId);
    });
  });
}

module.exports = { initSocket };
