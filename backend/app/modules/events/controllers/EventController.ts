
import type { HttpContext } from '@adonisjs/core/http'
import EventService from '#modules/events/services/EventService'
import { createEventValidator, updateEventValidator } from '../validators/EventValidators.js'

export default class EventController {
  public async create({ request, response, auth }: HttpContext) {
    const user = auth.user!

    const payload = await request.validateUsing(createEventValidator)

    const event = await EventService.create({
      ...payload,
      organizerId: user.id,
    })

    await EventService.createSeatsForEvent(event.id)

    return response.created(event)
  }

  public async getAll({ response }: HttpContext) {
    const events = await EventService.getAll()
    return response.ok(events)
  }

  public async getById({ params, response }: HttpContext) {
    const event = await EventService.getById(params.id)

    if (!event) {
      return response.notFound({ error: 'Event not found' })
    }

    return response.ok(event)
  }

  public async update({ request, response, auth, params }: HttpContext) {
    const user = auth.user!

    const updates = await request.validateUsing(updateEventValidator)

    const updatedEvent = await EventService.update(params.id, updates, user)

    if (!updatedEvent) {
      return response.notFound({ error: 'Event not found' })
    }

    return response.ok(updatedEvent)
  }

  public async delete({ response, auth, params }: HttpContext) {
    const user = auth.user!

    const deleted = await EventService.delete(params.id, user)

    if (!deleted) {
      return response.notFound({ error: 'Event not found' })
    }

    return response.ok({ message: 'Event deleted successfully' })
  }
}
