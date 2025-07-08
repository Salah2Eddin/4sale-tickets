
import Event from '#modules/events/models/Event'
import type User from '#modules/users/models/User'

export default class EventService {
    static async create(data: Partial<Event>) {
    return Event.create(data)
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

    static async update(id: number, updates: Partial<Event>, user: User) {
    const event = await Event.find(id)

    if (!event) return null

    const isOwner = user.id === event.organizerId

    if (!isOwner) {
        throw new Error('You are not authorized to update this event')
    }

    event.merge(updates)
    await event.save()

    return event
    }

    static async delete(id: number, user: User) {
    const event = await Event.find(id)

    if (!event) return null

    const isOwner = user.id === event.organizerId

    if (!isOwner) {
        throw new Error('You are not authorized to delete this event')
    }

    await event.delete()
    return true
    }
}
