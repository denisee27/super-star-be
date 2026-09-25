export function makeAdminLogService({ adminLogRepository }) {
  async function getLogs({ page = 1, limit = 20, adminId, action, resource, search } = {}) {
    return adminLogRepository.list({
      page: Number(page),
      limit: Number(limit),
      adminId,
      action,
      resource,
      search: search || undefined,
    });
  }

  return { getLogs };
}
