const redis = require('./redis');

async function rateLimit(id) {
  const key = `rate:${id}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 2); // 2 sec window
  }

  if (count > 15) {
    return false;
  }

  return true;
}

module.exports = rateLimit;
