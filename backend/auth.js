const jwt = require('jsonwebtoken');

const SECRET = "mysecret";

// fake login (for demo)
function login(req, res) {
  const { username } = req.body;

  const token = jwt.sign({ userId: username }, SECRET, {
    expiresIn: '1h'
  });

  res.json({ token });
}

// middleware
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

module.exports = { login, verifyToken };