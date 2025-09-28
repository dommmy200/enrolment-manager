// export function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.status(401).json({ error: "Unauthorized" });
// }
export default function ensureAuthenticated(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}
export function ensureScope(requiredScopes = []) {
  return function (req, res, next) {
    const userScopes = req.user?.scopes || [];

    const hasAllScopes = requiredScopes.every(scope =>
      userScopes.includes(scope)
    );

    if (!hasAllScopes) {
      return res.status(403).json({ error: "Insufficient scope" });
    }

    next();
  };
}