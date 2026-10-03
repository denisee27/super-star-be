const BD_WA_NUMBER_KEY = "bd_wa_number";
const BD_WA_TEMPLATE_KEY = "bd_wa_message_template";
const PIXEL_TIKTOK_MCN_KEY = "pixel_tiktok_mcn";
const PIXEL_SHOPEE_MCN_KEY = "pixel_shopee_mcn";
const PIXEL_BRAND_SELLER_KEY = "pixel_brand_seller";

const DEFAULT_TEMPLATE =
  "Halo, Aku {nama} dari {brand}. Aku perlu tanya perihal service dari MCN Superstar Agency.";
const DEFAULT_BD_NUMBER = "";

export function makeSettingService({ settingRepository }) {
  async function getBrandWaConfig() {
    const [bdWaNumber, bdWaMessageTemplate] = await Promise.all([
      settingRepository.getByKey(BD_WA_NUMBER_KEY),
      settingRepository.getByKey(BD_WA_TEMPLATE_KEY),
    ]);
    return {
      bdWaNumber: bdWaNumber ?? DEFAULT_BD_NUMBER,
      bdWaMessageTemplate: bdWaMessageTemplate ?? DEFAULT_TEMPLATE,
    };
  }

  async function getPixelConfig() {
    const [pixelTiktokMcn, pixelShopeeMcn, pixelBrandSeller] = await Promise.all([
      settingRepository.getByKey(PIXEL_TIKTOK_MCN_KEY),
      settingRepository.getByKey(PIXEL_SHOPEE_MCN_KEY),
      settingRepository.getByKey(PIXEL_BRAND_SELLER_KEY),
    ]);
    return {
      pixelTiktokMcn: pixelTiktokMcn ?? "",
      pixelShopeeMcn: pixelShopeeMcn ?? "",
      pixelBrandSeller: pixelBrandSeller ?? "",
    };
  }

  async function updateSettings({
    bdWaNumber,
    bdWaMessageTemplate,
    pixelTiktokMcn,
    pixelShopeeMcn,
    pixelBrandSeller,
  }) {
    const ops = [];
    if (bdWaNumber !== undefined)
      ops.push(settingRepository.setByKey(BD_WA_NUMBER_KEY, bdWaNumber));
    if (bdWaMessageTemplate !== undefined)
      ops.push(settingRepository.setByKey(BD_WA_TEMPLATE_KEY, bdWaMessageTemplate));
    if (pixelTiktokMcn !== undefined)
      ops.push(settingRepository.setByKey(PIXEL_TIKTOK_MCN_KEY, pixelTiktokMcn));
    if (pixelShopeeMcn !== undefined)
      ops.push(settingRepository.setByKey(PIXEL_SHOPEE_MCN_KEY, pixelShopeeMcn));
    if (pixelBrandSeller !== undefined)
      ops.push(settingRepository.setByKey(PIXEL_BRAND_SELLER_KEY, pixelBrandSeller));
    await Promise.all(ops);
  }

  return { getBrandWaConfig, getPixelConfig, updateSettings };
}
