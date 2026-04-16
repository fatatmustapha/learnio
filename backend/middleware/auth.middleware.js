import jwt from "jsonwebtoken";

// ===============================
// VERIFY TOKEN
// ===============================
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No token
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token" });
  }

  try {
    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = decoded;

    next(); // go to next step
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}
// ===============================
// CHECK ROLE
// ===============================
export const verifyRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};