import { NotFoundError, ValidationError } from "../errors/httpErrors.js";

export function makeEventService({ eventRepository }) {
  async function createEvent(data) {
    if (new Date(data.startsAt) >= new Date(data.expiresAt)) {
      throw new ValidationError("Tanggal mulai harus sebelum tanggal berakhir.");
    }
    return eventRepository.create(data);
  }

  async function getActiveEvents() {
    return eventRepository.findActive();
  }

  async function getAllEvents() {
    return eventRepository.findAll();
  }

  async function getEventById(id) {
    const event = await eventRepository.findById(id);
    if (!event) throw new NotFoundError("Event tidak ditemukan.");
    return event;
  }

  async function updateEvent(id, data) {
    await getEventById(id);
    if (data.startsAt && data.expiresAt && new Date(data.startsAt) >= new Date(data.expiresAt)) {
      throw new ValidationError("Tanggal mulai harus sebelum tanggal berakhir.");
    }
    return eventRepository.update(id, data);
  }

  async function deleteEvent(id) {
    await getEventById(id);
    return eventRepository.remove(id);
  }

  return { createEvent, getActiveEvents, getAllEvents, getEventById, updateEvent, deleteEvent };
}
