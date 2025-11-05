const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "access denied! No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "access denied! Invalid token format" });
    }

    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Attach user data to request
    req.user = {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture, // optional
    };

    // Optionally forward user details to microservices
    req.headers["x-user-id"] = payload.sub;
    req.headers["x-user-email"] = payload.email;
    req.headers["x-user-name"] = payload.name;

    return next();
  } catch (err) {
    console.log("Token verification failed:", err.message);

    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}

module.exports = authMiddleware;
