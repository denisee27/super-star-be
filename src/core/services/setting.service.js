const BD_WA_NUMBER_KEY = "bd_wa_number";
const BD_WA_TEMPLATE_KEY = "bd_wa_message_template";
const DEFAULT_TEMPLATE =
  "Halo, Aku {nama} dari {brand}. Aku perlu tanya perihal service dari MCN Superstar Agency.";
const DEFAULT_BD_NUMBER = ""; // admin will fill this in

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

  async function updateSettings({ bdWaNumber, bdWaMessageTemplate }) {
    const ops = [];
    if (bdWaNumber !== undefined) {
      ops.push(settingRepository.setByKey(BD_WA_NUMBER_KEY, bdWaNumber));
    }
    if (bdWaMessageTemplate !== undefined) {
      ops.push(settingRepository.setByKey(BD_WA_TEMPLATE_KEY, bdWaMessageTemplate));
    }
    await Promise.all(ops);
    return getBrandWaConfig();
  }

  return { getBrandWaConfig, updateSettings };
}
