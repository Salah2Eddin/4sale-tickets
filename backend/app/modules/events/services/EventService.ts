
import Event from '#modules/events/models/Event'
import type User from '#modules/users/models/User'
import Seat from '#modules/tickets/models/Seat'
import Tier from '#modules/tickets/models/Tier'

export default class EventService {
    static async create(data: Partial<Event>) {
    const event = await Event.create(data)

    await this.createSeatsForEvent(event.id)

    return event
    }

  static async createSeatsForEvent(eventId: number) {
    const tiers = await Tier.query().where('event_id', eventId)

    for (const tier of tiers) {
      const seatData = []

      for (let i = 0; i < tier.capacity; i++) {
        seatData.push({
          tierId: tier.id,
          eventId,
          isTaken: false,
        })
      }

      await Seat.createMany(seatData)
    }
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
