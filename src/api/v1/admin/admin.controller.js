const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export function makeAdminController({ adminService }) {
  async function login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await adminService.login(email, password);
      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("refreshToken", result.refreshToken, { ...COOKIE_OPTIONS, secure: isProduction });
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
      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("refreshToken", result.refreshToken, { ...COOKIE_OPTIONS, secure: isProduction });
      res.json({ success: true, data: { accessToken: result.accessToken } });
    } catch (error) {
      next(error);
    }
  }

  async function logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      await adminService.logout(refreshToken);
      res.clearCookie("refreshToken");
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

  return { login, refresh, logout, getProfile };
}
