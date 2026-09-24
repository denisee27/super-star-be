export function makeSettingController({ settingService }) {
  async function getBrandWaConfig(req, res, next) {
    try {
      const config = await settingService.getBrandWaConfig();
      res.json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  }

  async function updateSettings(req, res, next) {
    try {
      const { bdWaNumber, bdWaMessageTemplate } = req.body;
      const result = await settingService.updateSettings({ bdWaNumber, bdWaMessageTemplate });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  return { getBrandWaConfig, updateSettings };
}
