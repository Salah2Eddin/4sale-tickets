
import SeatCacheModel from '#modules/tickets/mongo/SeatCache'
import Seat from '#modules/tickets/models/Seat'
import { SeatStatus } from '#contracts/tickets/enums/SeatStatus'
import db from '@adonisjs/lucid/services/db'
import mongoose from 'mongoose'

import TicketService from '#modules/tickets/services/TicketService'


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

  static async lockSeat(seatId: number, userId: number) {
    await this.releaseExpiredLocks()

    const seat = await Seat.findOrFail(seatId)

    if (seat.status !== SeatStatus.AVAILABLE) {
      throw new Error('Seat already booked')
    }

    const seatMongo = await SeatCacheModel.create({
      eventId: seat.eventId,
      seatId: seat.id,
      status: SeatStatus.LOCKED,
      lockedBy: userId,
      lockedAt: new Date(),
    })
    return seatMongo
  }

  static async unlockSeat(seatId: number, userId: number) {
    const seatMongo = await SeatCacheModel.findOneAndDelete({seatId:seatId, lockedBy: userId})
    return seatMongo
  }

  static async bookSeats(bookedSeats : {eventId: number, seatId: number}[],  userId: number) {
    const trx = await db.transaction()
    const session = await mongoose.startSession()
    try {
      session.startTransaction()
      await Promise.all(
        bookedSeats.map(async (bookedSeat) => {
          await SeatCacheModel.findOneAndDelete({seatId: bookedSeat.seatId})
          await TicketService.createTicket(
            userId,
            bookedSeat.eventId,
            bookedSeat.seatId,
            bookedSeats.length,
            {client:trx}
          )
          await Seat.query({client: trx}).where('id', bookedSeat.seatId).update('status', SeatStatus.BOOKED)
        })
      )
      trx.commit()
      session.commitTransaction()
    } catch (error) {
      trx.rollback()
      session.abortTransaction()
      throw error
    }
  }

  static async getSeatsForEvent(eventId: number) {
    await this.releaseExpiredLocks()

    return SeatCacheModel.find({ eventId })
  }
}
