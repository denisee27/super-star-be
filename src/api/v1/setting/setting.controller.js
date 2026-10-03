export function makeSettingController({ settingService }) {
  async function getBrandWaConfig(req, res, next) {
    try {
      const config = await settingService.getBrandWaConfig();
      res.json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  }

  async function getPixelConfig(req, res, next) {
    try {
      const config = await settingService.getPixelConfig();
      res.json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  }

  async function updateSettings(req, res, next) {
    try {
      const { bdWaNumber, bdWaMessageTemplate, pixelTiktokMcn, pixelShopeeMcn, pixelBrandSeller } =
        req.body;
      await settingService.updateSettings({
        bdWaNumber,
        bdWaMessageTemplate,
        pixelTiktokMcn,
        pixelShopeeMcn,
        pixelBrandSeller,
      });
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  return { getBrandWaConfig, getPixelConfig, updateSettings };
}
