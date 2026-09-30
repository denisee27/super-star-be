export function makeEventController({ eventService }) {
  async function list(req, res, next) {
    try {
      const events = await eventService.getActiveEvents();
      res.json({ success: true, data: events });
    } catch (error) {
      next(error);
    }
  }

  async function listAll(req, res, next) {
    try {
      const events = await eventService.getAllEvents();
      res.json({ success: true, data: events });
    } catch (error) {
      next(error);
    }
  }

  async function create(req, res, next) {
    try {
      const event = await eventService.createEvent(req.body);
      res.status(201).json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  async function update(req, res, next) {
    try {
      const event = await eventService.updateEvent(req.params.id, req.body);
      res.json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  async function remove(req, res, next) {
    try {
      await eventService.deleteEvent(req.params.id);
      res.json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }

  return { list, listAll, create, update, remove };
}
