import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // Header: Bearer <token>
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "no token, unauthorized access " });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "token is invaild" });
    req.user = user; // user informations now at the req.user
    next();
  });
}
