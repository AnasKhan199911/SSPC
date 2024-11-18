const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).json({ error: "Access Denied" });
    }

    // Remove "Bearer " prefix if it exists
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimStart();
    }

    // Verify JWT token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach the verified token payload to req.user

    next(); // Continue to the next middleware or route handler
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  verifyToken,
};
