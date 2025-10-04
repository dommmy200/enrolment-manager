import jwt from "jsonwebtoken";

export function issueToken(user) {
  const payload = {
    sub: user.id,
    name: user.name,
    scopes: ["read:students", "write:students", "delete:students", "read:courses", "write:courses", "delete:courses", "read:instructors", "write:instructors", "delete:instructors"] // 🔐 assign per role
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
    issuer: "school-api"
  });
}
