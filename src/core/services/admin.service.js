import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { signAccessToken } from "../../infra/security/jwt.js";
import { UnauthorizedError, NotFoundError } from "../errors/httpErrors.js";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function makeAdminService({ adminRepository, logger }) {
  async function login(email, password) {
    const admin = await adminRepository.findByEmail(email);
    if (!admin) throw new UnauthorizedError("Invalid credentials");

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) throw new UnauthorizedError("Invalid credentials");

    const accessToken = signAccessToken({ sub: admin.id, email: admin.email });
    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    await adminRepository.createRefreshToken({ token: refreshToken, adminId: admin.id, expiresAt });
    logger.info({ adminId: admin.id }, "Admin logged in");

    return {
      accessToken,
      refreshToken,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    };
  }

  async function refresh(refreshToken) {
    const record = await adminRepository.findRefreshToken(refreshToken);

    if (!record) throw new UnauthorizedError("Invalid refresh token");

    if (record.expiresAt < new Date()) {
      await adminRepository.deleteRefreshToken(refreshToken);
      throw new UnauthorizedError("Refresh token expired");
    }

    await adminRepository.deleteRefreshToken(refreshToken);

    const newAccessToken = signAccessToken({ sub: record.admin.id, email: record.admin.email });
    const newRefreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    await adminRepository.createRefreshToken({
      token: newRefreshToken,
      adminId: record.admin.id,
      expiresAt,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async function logout(refreshToken) {
    if (refreshToken) {
      await adminRepository.deleteRefreshToken(refreshToken);
    }
  }

  async function getProfile(id) {
    const admin = await adminRepository.findById(id);
    if (!admin) throw new NotFoundError("Admin not found");
    return admin;
  }

  return { login, refresh, logout, getProfile };
}
