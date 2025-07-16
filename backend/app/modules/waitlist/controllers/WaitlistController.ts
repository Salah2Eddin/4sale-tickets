
import type { HttpContext } from '@adonisjs/core/http'
import Waitlist from '#modules/waitlist/models/Waitlist'
import WaitlistService from '#modules/waitlist/services/WaitlistService'
import { waitlistResponseValidator, waitlistSubscriptionValidator } from '#modules/waitlist/validators/WaitlistValidators'


export default class WaitlistController {
  public async subscribe ({ auth, request, response }: HttpContext) {
    const user   = auth.user!
    const { eventId, tierId } = await request.validateUsing(waitlistSubscriptionValidator)

    const duplicate = await WaitlistService.checkAlreadySubscribed(user.id, eventId, tierId)
    if (duplicate) {
      return response.badRequest({ message: 'Already on this waitlist' })
    }

    const entry = WaitlistService.subscribe(user.id, eventId, tierId)
    return response.created(entry)
  }


  public async respond ({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const { waitlistId, accept } = await request.validateUsing(waitlistResponseValidator)

    const entry = await Waitlist.find(waitlistId)
    if (!entry || entry.userId !== user.id) {
      return response.badRequest({ message: "Not your waitlist entry" })
    }
    if (entry.status !== 'notified') {
      return response.badRequest({ message: 'Entry not in notified state' })
    }

    if (!accept) {
      WaitlistService.decline(entry)
      return response.ok({ message: 'Declined. You were removed from the queue.' })
    }

    WaitlistService.accept(entry)
    return response.ok({ message: 'You successfully bought the ticket.' })
  }

  public async myStatus ({ auth, response }: HttpContext) {
    const user = auth.user!
    const entries = await Waitlist
      .query()
      .where('user_id', user.id)
      .orderBy('created_at', 'asc')

    return response.ok(entries)
  }
}
