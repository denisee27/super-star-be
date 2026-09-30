export function makeRegionController({ regionService }) {
  async function listProvinces(req, res, next) {
    try {
      const data = await regionService.getProvinces();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async function listRegencies(req, res, next) {
    try {
      const { provinceId } = req.query;
      if (!provinceId) {
        return res.status(400).json({ success: false, error: "provinceId wajib diisi" });
      }
      const data = await regionService.getRegencies(provinceId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  return { listProvinces, listRegencies };
}
