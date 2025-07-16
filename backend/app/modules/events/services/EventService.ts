
import Event from '#modules/events/models/Event'

export default class EventService {
    static async create(data: Partial<Event>) {
    const event = await Event.create(data)
    return event
    }

    static async getAll() {
        return Event.query().preload('organizer')
    }

    static async getById(id: number) {
        return Event.query()
        .where('id', id)
        .preload('organizer')
        .first()
    }

    static async isEventOrganizer(eventId:number, organizerId:number){
      const event = await Event.findOrFail(eventId)
      return event.organizerId==organizerId;
    }

    static async update(id: number, updates: Partial<Event>) {
    const event = await Event.find(id)

    if (!event) return null

    event.merge(updates)
    await event.save()

    return event
    }

    static async delete(id: number) {
    const event = await Event.find(id)

    if (!event) return null

    await event.delete()
    return true
    }
}
