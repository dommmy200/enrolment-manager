import jwt from "jsonwebtoken";

export default function ensureAuthenticated(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log(`Auth Header: ${authHeader}`)
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header missing or invalid" });
  }
  
  const token = authHeader.split(" ")[1];
  console.log(`Token: ${token}`)
  
  try {
    console.log("Before Decoded:");
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded payload:", decoded);
    console.log("After Decoded:");
    // Attach user info to request
    req.user = decoded;
    console.log("User scopes:", req.user.scopes);
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.name, err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}
export function ensureScope(requiredScopes = []) {
  return function (req, res, next) {
    const userScopes = req.user?.scopes || [];

    const hasAllScopes = requiredScopes.every(scope =>
      userScopes.includes(scope)
    );
    console.log("ensureScope() → required:", requiredScopes);
    console.log("ensureScope() → user scopes:", req.user?.scopes);
    if (!hasAllScopes) {
      return res.status(403).json({ error: "Insufficient scope" });
    }

    next();
  };
}