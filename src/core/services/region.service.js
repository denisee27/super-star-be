export function makeRegionService({ regionRepository }) {
  async function getProvinces() {
    return regionRepository.findAllProvinces();
  }

  async function getRegencies(provinceId) {
    return regionRepository.findRegenciesByProvince(provinceId);
  }

  return { getProvinces, getRegencies };
}
