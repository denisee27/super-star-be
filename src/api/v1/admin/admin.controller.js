const isProduction = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: isProduction ? "none" : "strict",
  secure: isProduction,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export function makeAdminController({ adminService, adminLogService }) {
  async function login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await adminService.login(email, password);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async function verifyLoginOtp(req, res, next) {
    try {
      const { email, code } = req.body;
      const result = await adminService.verifyLoginOtp(email, code, req.ip);
      res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);
      res.json({ success: true, data: { accessToken: result.accessToken, admin: result.admin } });
    } catch (error) {
      next(error);
    }
  }

  async function refresh(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ success: false, error: "Refresh token not found" });
      }
      const result = await adminService.refresh(refreshToken);
      res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);
      res.json({ success: true, data: { accessToken: result.accessToken } });
    } catch (error) {
      next(error);
    }
  }

  async function logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      await adminService.logout(refreshToken);
      res.clearCookie("refreshToken", { ...COOKIE_OPTIONS, maxAge: undefined });
      res.json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }

  async function getProfile(req, res, next) {
    try {
      const admin = await adminService.getProfile(req.admin.id);
      res.json({ success: true, data: admin });
    } catch (error) {
      next(error);
    }
  }

  async function listAdmins(req, res, next) {
    try {
      const { page, limit, search } = req.query;
      const result = await adminService.listAdmins({ page, limit, search });
      res.json({
        success: true,
        data: result.admins,
        meta: { total: result.total, page: result.page, totalPages: result.totalPages, limit: result.limit },
      });
    } catch (error) {
      next(error);
    }
  }

  async function createAdmin(req, res, next) {
    try {
      const { email, name, password } = req.body;
      const admin = await adminService.createAdmin({ email, name, password }, req.admin.id, req.ip);
      res.status(201).json({ success: true, data: admin });
    } catch (error) {
      next(error);
    }
  }

  async function updateAdmin(req, res, next) {
    try {
      const { name, email } = req.body;
      const updated = await adminService.updateAdmin(req.params.id, { name, email }, req.admin.id, req.ip);
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async function resetAdminPassword(req, res, next) {
    try {
      const { password } = req.body;
      await adminService.resetAdminPassword(req.params.id, password, req.admin.id, req.ip);
      res.json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }

  async function deleteAdmin(req, res, next) {
    try {
      await adminService.deleteAdmin(req.params.id, req.admin.id, req.ip);
      res.json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }

  async function getLogs(req, res, next) {
    try {
      const { page, limit, adminId, action, resource, search } = req.query;
      const result = await adminLogService.getLogs({ page, limit, adminId, action, resource, search });
      res.json({
        success: true,
        data: result.logs,
        meta: { total: result.total, page: result.page, totalPages: result.totalPages, limit: result.limit },
      });
    } catch (error) {
      next(error);
    }
  }

  return { login, verifyLoginOtp, refresh, logout, getProfile, listAdmins, createAdmin, updateAdmin, resetAdminPassword, deleteAdmin, getLogs };
}
