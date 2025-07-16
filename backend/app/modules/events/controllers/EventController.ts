
import type { HttpContext } from '@adonisjs/core/http'
import EventService from '#modules/events/services/EventService'
import { createEventValidator, updateEventValidator } from '#modules/events/validators/EventValidators'

export default class EventController {
  public async create({ request, response}: HttpContext) {
    const payload = await request.validateUsing(createEventValidator)

    const event = await EventService.create(payload)
    // await EventService.createSeatsForEvent(event.id)

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
    
    const isOwner = await EventService.isEventOrganizer(params.id, user.id)
    if (!isOwner) {
      return response.forbidden('You are not authorized to update this event')
    }

    const updates = await request.validateUsing(updateEventValidator)

    const updatedEvent = await EventService.update(params.id, updates)

    if (!updatedEvent) {
      return response.notFound({ error: 'Event not found' })
    }

    return response.ok(updatedEvent)
  }

  public async delete({ response, auth, params }: HttpContext) {
    const user = auth.user!

    const isOwner = await EventService.isEventOrganizer(params.id, user.id)
    if (!isOwner) {
        return response.forbidden('You are not authorized to update this event')
    }

    const deleted = await EventService.delete(params.id)

    if (!deleted) {
      return response.notFound({ error: 'Event not found' })
    }

    return response.ok({ message: 'Event deleted successfully' })
  }
}