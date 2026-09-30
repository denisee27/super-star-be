export function makeInquiryController({ inquiryService, eventService, adminLogRepository }) {
  async function submitMcnInquiry(req, res, next) {
    try {
      const { platform, ...rest } = req.body;
      const inquiry = await inquiryService.submitInquiry("MCN_AGENCY", { platform, ...rest });
      res.status(201).json({ success: true, data: inquiry });
    } catch (error) {
      next(error);
    }
  }

  async function submitPasInquiry(req, res, next) {
    try {
      const inquiry = await inquiryService.submitInquiry("PASUKAN_AFFILIATE", req.body);
      res.status(201).json({ success: true, data: inquiry });
    } catch (error) {
      next(error);
    }
  }

  async function submitBrandInquiry(req, res, next) {
    try {
      const inquiry = await inquiryService.submitInquiry("BRAND_SELLER", req.body);
      res.status(201).json({ success: true, data: inquiry });
    } catch (error) {
      next(error);
    }
  }

  async function submitEventInquiry(req, res, next) {
    try {
      const { eventId, ...rest } = req.body;
      const event = await eventService.getEventById(eventId);

      const now = new Date();
      if (!event.isActive || event.startsAt > now || event.expiresAt <= now) {
        return res.status(400).json({ success: false, error: "Event ini sudah tidak aktif atau sudah berakhir." });
      }

      const inquiry = await inquiryService.submitInquiry("EVENT", { eventId, eventName: event.name, ...rest });
      res.status(201).json({ success: true, data: inquiry });
    } catch (error) {
      next(error);
    }
  }

  async function getAllInquiries(req, res, next) {
    try {
      const { category, status, search, startDate, endDate, eventId, page, limit } = req.query;
      const result = await inquiryService.getAllInquiries({
        category, status, search, startDate, endDate, eventId,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
      });
      res.json({ success: true, data: result.data, meta: { total: result.total, page: result.page, totalPages: result.totalPages } });
    } catch (error) {
      next(error);
    }
  }

  async function getInquiryById(req, res, next) {
    try {
      const inquiry = await inquiryService.getInquiryById(req.params.id);
      res.json({ success: true, data: inquiry });
    } catch (error) {
      next(error);
    }
  }

  async function updateInquiry(req, res, next) {
    try {
      const { status, notes } = req.body;
      const inquiry = await inquiryService.updateInquiryStatus(req.params.id, status, notes);

      if (req.admin?.id) {
        const label = inquiry.fullName || inquiry.brandName || inquiry.id;
        adminLogRepository.create({
          adminId: req.admin.id,
          action: "UPDATE",
          resource: "inquiry",
          resourceId: inquiry.id,
          detail: `Update inquiry "${label}" → ${status}${notes !== undefined ? " (catatan diperbarui)" : ""}`,
          ipAddress: req.ip,
        }).catch(() => {});
      }

      res.json({ success: true, data: inquiry });
    } catch (error) {
      next(error);
    }
  }

  return { submitMcnInquiry, submitPasInquiry, submitBrandInquiry, submitEventInquiry, getAllInquiries, getInquiryById, updateInquiry };
}
