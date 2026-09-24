import { NotFoundError } from "../errors/httpErrors.js";

export function makeInquiryService({ inquiryRepository, logger }) {
  async function submitInquiry(category, payload) {
    const data = { category, ...payload };
    const inquiry = await inquiryRepository.create(data);
    logger.info({ inquiryId: inquiry.id, category }, "Inquiry submitted");
    return inquiry;
  }

  async function getAllInquiries(filters) {
    return inquiryRepository.findAll(filters);
  }

  async function getInquiryById(id) {
    const inquiry = await inquiryRepository.findById(id);
    if (!inquiry) throw new NotFoundError("Inquiry not found");
    return inquiry;
  }

  async function updateInquiryStatus(id, status, notes) {
    const inquiry = await inquiryRepository.findById(id);
    if (!inquiry) throw new NotFoundError("Inquiry not found");
    return inquiryRepository.update(id, { status, ...(notes !== undefined && { notes }) });
  }

  return { submitInquiry, getAllInquiries, getInquiryById, updateInquiryStatus };
}
