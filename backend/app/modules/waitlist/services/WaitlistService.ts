
import Waitlist from '#modules/waitlist/models/Waitlist'
import User from '#modules/users/models/User'
import mailservice from '#modules/shared/services/mail_service'
import { DateTime } from 'luxon'
import SeatLockService from '#modules/tickets/services/SeatLockService'
import SeatService from '#modules/tickets/services/SeatService'
import { SeatStatus } from '#contracts/tickets/enums/SeatStatus'


const CLAIM_WINDOW_HOURS = 12

export default class WaitlistService {
  public static async checkAlreadySubscribed(userId: number, eventId: number, tierId: number ){
    const duplicate = await Waitlist.query()
      .where('user_id', userId)
      .where('event_id', eventId)
      .where('tier_id', tierId )
      .first()

    return duplicate !== null
  }

  public static async subscribe(userId: number, eventId: number, tierId: number|null){
    const entry = await Waitlist.create({
      userId:  userId,
      eventId: eventId,
      tierId:  tierId,
      status:  'waiting',
      createdAt: DateTime.now()
    })
    return entry
  }
  
  public static async notifyNextUser (
    eventId: number,
    tierId: number | null
  ) {
    const query = Waitlist.query()
  .where('event_id', eventId)
  .where('status', 'waiting')

if (tierId === null) {
  query.whereNull('tier_id')
} else {
  query.where('tier_id', tierId)
}

const next = await query.orderBy('created_at', 'asc').first()
    if (!next) return null

    // update entry
    next.status     = 'notified'
    next.notifiedAt = DateTime.utc()
    next.expiresAt  = next.notifiedAt.plus({ hours: CLAIM_WINDOW_HOURS })
    await next.save()

    // fetch user
    const receiver = await User.find(next.userId)

    if (receiver) {
      await mailservice.send(
        receiver.email,
        '🎟️ Ticket available!',
        [
          `Hi ${receiver.username ?? 'there'},`,
          '',
          'A ticket for your event is now available.',
          `You have ${CLAIM_WINDOW_HOURS} hours to claim it before we offer it to the next person.`,
          '',
          
        ]
      )
    }

    return next
  }

 
  public static async cycleExpired () {
    const now = DateTime.utc()

    const expired = await Waitlist.query()
      .where('status', 'notified')
      .where('expires_at', '<', now.toSQL())

    for (const entry of expired) {
      // mark current as expired
      entry.status     = 'expired'
      entry.notifiedAt = null
      entry.expiresAt  = null
      await entry.save()

      // reinsert clone at end of queue
      await Waitlist.create({
        userId : entry.userId,
        eventId: entry.eventId,
        tierId : entry.tierId,
        status : 'waiting',
      })

      await entry.delete() 
    }

    return expired.length
  }

  /** Call after a ticket refund / upgrade to start the next notification cycle */
  public static async kickOff (eventId: number, tierId: number | null) {
    await this.cycleExpired()
    await this.notifyNextUser(eventId, tierId)
  }

  public static async accept(entry: Waitlist){
    entry.status = 'bought'
    const seat = await SeatService.getSeatBy({eventId: entry.eventId, tierId:entry.tierId, status:SeatStatus.AVAILABLE})
    SeatLockService.bookSeats([{eventId:entry.eventId, seatId:seat.id}], entry.userId)
    await entry.save()
  }

  public static async decline(entry:Waitlist){
    entry.status = 'declined'
    await entry.save()
    await WaitlistService.notifyNextUser(entry.eventId, entry.tierId)
  }
}
