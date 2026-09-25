import { verifyAccessToken } from "../../infra/security/jwt.js";
import { UnauthorizedError, ForbiddenError } from "../../core/errors/httpErrors.js";

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Access token required"));
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyAccessToken(token);
    req.admin = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired access token"));
  }
}

export function requireSuperAdmin(req, res, next) {
  if (req.admin?.role !== "SUPER_ADMIN") {
    return next(new ForbiddenError("Akses ditolak. Hanya Super Admin yang dapat melakukan ini."));
  }
  next();
}
