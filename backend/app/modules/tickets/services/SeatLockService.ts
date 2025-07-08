
import SeatCacheModel from '#modules/tickets/mongo/SeatCache'
import Ticket from '#modules/tickets/models/Ticket'
import Seat from '#modules/tickets/models/Seat'

export default class SeatLockService {
  static async releaseExpiredLocks() {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)

    await SeatCacheModel.updateMany(
      {
        status: 'locked',
        lockedAt: { $lt: twoMinutesAgo },
      },
      {
        $set: {
          status: 'available',
          lockedBy: null,
          lockedAt: null,
        },
      }
    )
  }

  static async lockSeat(eventId: number, seatId: number, userId: number) {
    await this.releaseExpiredLocks()

    const seat = await SeatCacheModel.findOne({ eventId, seatId })

    if (!seat) {
      throw new Error('Seat not found')
    }

    if (seat.status === 'booked') {
      throw new Error('Seat already booked')
    }

    if (seat.status === 'locked') {
      throw new Error('Seat is currently locked')
    }

    seat.status = 'locked'
    seat.lockedBy = userId
    seat.lockedAt = new Date()
    await seat.save()

    return seat
  }

  static async unlockSeat(eventId: number, seatId: number, userId: number) {
    const seat = await SeatCacheModel.findOne({ eventId, seatId })

    if (!seat) {
      throw new Error('Seat not found')
    }

    if (seat.status !== 'locked' || seat.lockedBy !== userId) {
      throw new Error('You do not have permission to unlock this seat')
    }

    seat.status = 'available'
    seat.lockedBy = null
    seat.lockedAt = null
    await seat.save()

    return seat
  }

  static async bookSeat(eventId: number, seatId: number, userId: number) {
    await this.releaseExpiredLocks()

    const seat = await SeatCacheModel.findOne({ eventId, seatId })
    if (!seat) throw new Error('Seat not found')

    if (seat.status !== 'locked' || seat.lockedBy !== userId) {
      throw new Error('Seat must be locked by you before booking')
    }

    seat.status = 'booked'
    seat.lockedBy = null
    seat.lockedAt = null
    await seat.save()

    const seatInSql = await Seat.find(seatId)
    if (!seatInSql) throw new Error('Seat does not exist in MySQL')

    const ticket = await Ticket.create({
      userId,
      eventId,
      seatId,
      status: 'valid',
      checkedIn: false,
    })

    return {
      seat,
      ticket,
    }
  }

  static async getSeatsForEvent(eventId: number) {
    await this.releaseExpiredLocks()

    return SeatCacheModel.find({ eventId })
  }
}
