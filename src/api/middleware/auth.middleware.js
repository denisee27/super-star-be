import { verifyAccessToken } from "../../infra/security/jwt.js";
import { UnauthorizedError } from "../../core/errors/httpErrors.js";

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Access token required"));
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyAccessToken(token);
    req.admin = { id: payload.sub, email: payload.email };
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired access token"));
  }
}
