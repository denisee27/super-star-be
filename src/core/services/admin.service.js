import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { signAccessToken } from "../../infra/security/jwt.js";
import { UnauthorizedError, NotFoundError, ForbiddenError, ConflictError } from "../errors/httpErrors.js";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function makeAdminService({ adminRepository, adminLogRepository, otpService, logger }) {
  // Step 1: verify credentials → send OTP (no tokens yet)
  async function login(email, password) {
    const admin = await adminRepository.findByEmail(email);
    if (!admin) throw new UnauthorizedError("Email atau password salah.");
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) throw new UnauthorizedError("Email atau password salah.");
    await otpService.sendOtp(email);
    return { step: "otp" };
  }

  // Step 2: verify OTP → issue tokens
  async function verifyLoginOtp(email, code, ipAddress) {
    await otpService.verifyOtp(email, code);

    const admin = await adminRepository.findByEmail(email);
    if (!admin) throw new UnauthorizedError("Admin tidak ditemukan.");

    const accessToken = signAccessToken({ sub: admin.id, email: admin.email, role: admin.role });
    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    await adminRepository.createRefreshToken({ token: refreshToken, adminId: admin.id, expiresAt });

    adminLogRepository.create({
      adminId: admin.id,
      action: "LOGIN",
      resource: "auth",
      detail: `${admin.email} berhasil masuk`,
      ipAddress,
    }).catch(() => {});

    logger.info({ adminId: admin.id }, "Admin logged in via OTP");
    return {
      accessToken,
      refreshToken,
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    };
  }

  async function refresh(refreshToken) {
    const record = await adminRepository.findRefreshToken(refreshToken);
    if (!record) throw new UnauthorizedError("Invalid refresh token");
    if (record.expiresAt < new Date()) {
      await adminRepository.deleteRefreshToken(refreshToken);
      throw new UnauthorizedError("Refresh token expired");
    }
    const newAccessToken = signAccessToken({
      sub: record.admin.id,
      email: record.admin.email,
      role: record.admin.role,
    });
    return { accessToken: newAccessToken, refreshToken };
  }

  async function logout(refreshToken) {
    if (refreshToken) await adminRepository.deleteRefreshToken(refreshToken);
  }

  async function getProfile(id) {
    const admin = await adminRepository.findById(id);
    if (!admin) throw new NotFoundError("Admin tidak ditemukan.");
    return admin;
  }

  async function listAdmins({ page, limit, search } = {}) {
    return adminRepository.listAdmins({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search: search || undefined,
    });
  }

  async function updateAdmin(id, { name, email }, actorId, ipAddress) {
    const admin = await adminRepository.findById(id);
    if (!admin) throw new NotFoundError("Admin tidak ditemukan.");

    if (email && email !== admin.email) {
      const existing = await adminRepository.findByEmail(email);
      if (existing) throw new ConflictError("Email sudah digunakan.");
    }

    const updated = await adminRepository.updateAdmin(id, { name, email });

    adminLogRepository.create({
      adminId: actorId,
      action: "UPDATE",
      resource: "admin",
      resourceId: id,
      detail: `Memperbarui akun admin: ${updated.email}`,
      ipAddress,
    }).catch(() => {});

    logger.info({ actorId, targetId: id }, "Admin updated");
    return updated;
  }

  async function resetAdminPassword(id, newPassword, actorId, ipAddress) {
    const admin = await adminRepository.findById(id);
    if (!admin) throw new NotFoundError("Admin tidak ditemukan.");
    if (admin.role === "SUPER_ADMIN") throw new ForbiddenError("Password Super Admin tidak dapat direset.");

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await adminRepository.updateAdmin(id, { passwordHash });
    await adminRepository.deleteAllRefreshTokensByAdmin(id);

    adminLogRepository.create({
      adminId: actorId,
      action: "UPDATE",
      resource: "admin",
      resourceId: id,
      detail: `Reset password akun admin: ${admin.email}`,
      ipAddress,
    }).catch(() => {});

    logger.info({ actorId, targetId: id }, "Admin password reset");
  }

  async function createAdmin({ email, name, password }, actorId, ipAddress) {
    const existing = await adminRepository.findByEmail(email);
    if (existing) throw new ConflictError("Email sudah terdaftar.");

    const passwordHash = await bcrypt.hash(password, 12);
    const newAdmin = await adminRepository.createAdmin({ email, name, passwordHash });

    adminLogRepository.create({
      adminId: actorId,
      action: "CREATE",
      resource: "admin",
      resourceId: newAdmin.id,
      detail: `Membuat akun admin baru: ${email}`,
      ipAddress,
    }).catch(() => {});

    logger.info({ actorId, newAdminId: newAdmin.id }, "Admin created");
    return newAdmin;
  }

  async function deleteAdmin(id, actorId, ipAddress) {
    const admin = await adminRepository.findById(id);
    if (!admin) throw new NotFoundError("Admin tidak ditemukan.");
    if (admin.role === "SUPER_ADMIN") throw new ForbiddenError("Super Admin tidak dapat dihapus.");
    if (id === actorId) throw new ForbiddenError("Tidak dapat menghapus akun sendiri.");

    await adminRepository.deleteAllRefreshTokensByAdmin(id);
    await adminRepository.deleteAdmin(id);

    adminLogRepository.create({
      adminId: actorId,
      action: "DELETE",
      resource: "admin",
      resourceId: id,
      detail: `Menghapus akun admin: ${admin.email}`,
      ipAddress,
    }).catch(() => {});

    logger.info({ actorId, deletedAdminId: id }, "Admin deleted");
  }

  return { login, verifyLoginOtp, refresh, logout, getProfile, listAdmins, updateAdmin, resetAdminPassword, createAdmin, deleteAdmin };
}
