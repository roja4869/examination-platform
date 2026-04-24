import { verifyToken } from "../utils/jwt.js";
import client from "../db/index.js";

export const authenticate = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }

  try {
    const result = await client.execute({
      sql: "SELECT id, name, email, role FROM users WHERE id = ?",
      args: [decoded.id],
    });

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || (roles.length && !roles.includes(req.user.role))) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    next();
  };
};
