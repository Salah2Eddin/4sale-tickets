
import type { HttpContext } from '@adonisjs/core/http'
import Waitlist from '#modules/waitlist/models/Waitlist'
import WaitlistService from '#modules/waitlist/services/WaitlistService'
import { waitlistResponseValidator, waitlistSubscriptionValidator } from '../validators/WaitlistValidators.js'


export default class WaitlistController {
  public async subscribe ({ auth, request, response }: HttpContext) {
    const user   = auth.user!
    const { eventId, tierId } = await request.validateUsing(waitlistSubscriptionValidator)

    // 1. Prevent duplicates
    const duplicate = await Waitlist.query()
      .where('user_id', user.id)
      .where('event_id', eventId)
      .where('tier_id', tierId )
      .first()

    if (duplicate) {
      return response.badRequest({ message: 'Already on this waitlist' })
    }

    // 2. Create entry
    const entry = await Waitlist.create({
      userId:  user.id,
      eventId,
      tierId:  tierId ?? null,
      status:  'waiting',
    })

    return response.created(entry)
  }


  public async respond ({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const { waitlistId, accept } = await request.validateUsing(waitlistResponseValidator)

    const entry = await Waitlist.find(waitlistId)
    if (!entry || entry.userId !== user.id) {
      return response.forbidden({ message: 'Invalid waitlist entry' })
    }
    if (entry.status !== 'notified') {
      return response.badRequest({ message: 'Entry not in notified state' })
    }

    if (accept) {
      entry.status = 'bought'
      await entry.save()
      return response.ok({ message: ' Finish checkout to buy your ticket.' })
    }

    // decline → mark declined & notify next user
    entry.status = 'declined'
    await entry.save()
    if (entry.tierId !== null) {
      await WaitlistService.notifyNextUser(entry.eventId, entry.tierId)
    }

    return response.ok({ message: 'Declined. You were removed from the queue.' })
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
