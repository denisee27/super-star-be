import { NotFoundError } from "../errors/httpErrors.js";
import { sendEmail } from "../../infra/email/emailService.js";
import { mcnNotificationHtml, pasNotificationHtml, brandNotificationHtml } from "../../infra/email/templates/notificationTemplate.js";

const PAS_GROUP_LINK = "https://chat.whatsapp.com/EXSgxMGLGDvFVZGe9wpAIV?s=cl&p=a&ilr=1";

function buildWaUrl(number, template, data) {
  const clean = number?.replace(/\D/g, "");
  if (!clean) return null;
  const message = template
    .replace("{nama}", data.picName ?? "")
    .replace("{brand}", data.brandName ?? "")
    .replace("{email}", data.email ?? "")
    .replace("{kategori}", data.productCategory ?? "")
    .replace("{role}", data.picRole ?? "")
    .replace("{kontak}", data.picContact ?? "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function makeInquiryService({ inquiryRepository, settingRepository, logger }) {
  async function sendNotification(category, data) {
    try {
      if (category === "MCN_AGENCY") {
        await sendEmail({
          to: data.email,
          subject: `Pendaftaran MCN Kamu Diterima — Superstar Agency`,
          html: mcnNotificationHtml(data),
        });
      } else if (category === "PASUKAN_AFFILIATE") {
        await sendEmail({
          to: data.email,
          subject: "Pendaftaran Pasukan Affiliate Diterima — Superstar Agency",
          html: pasNotificationHtml({ ...data, groupLink: PAS_GROUP_LINK }),
        });
      } else if (category === "BRAND_SELLER") {
        const [bdNumber, bdTemplate] = await Promise.all([
          settingRepository.getByKey("bd_wa_number"),
          settingRepository.getByKey("bd_wa_message_template"),
        ]);
        const waUrl = buildWaUrl(bdNumber, bdTemplate ?? "", data);
        await sendEmail({
          to: data.email,
          subject: `Inquiry Brand Partner Diterima — Superstar Agency`,
          html: brandNotificationHtml({ ...data, waUrl }),
        });
      }
    } catch (err) {
      // Never fail the main request if email fails
      logger.warn({ err, category }, "Failed to send notification email");
    }
  }

  async function submitInquiry(category, payload) {
    const data = { category, ...payload };
    const inquiry = await inquiryRepository.create(data);
    logger.info({ inquiryId: inquiry.id, category }, "Inquiry submitted");
    sendNotification(category, payload); // fire-and-forget
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
