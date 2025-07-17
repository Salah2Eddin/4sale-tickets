
import SeatCacheModel from '#modules/tickets/mongo/SeatCache'
import Seat from '#modules/tickets/models/Seat'
import { SeatStatus } from '#contracts/tickets/enums/SeatStatus'
import db from '@adonisjs/lucid/services/db'
import mongoose from 'mongoose'

import TicketService from '#modules/tickets/services/TicketService'


export default class SeatLockService {
  static async releaseExpiredLocks() {
    const lockDuration = /*2*60*1000*/ 5*1000
    const startOfDuration = new Date(Date.now() - lockDuration)
    await SeatCacheModel.deleteMany(
      {
        lockedAt: { $lt: startOfDuration },
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
          const ticket = await TicketService.createTicket(
            userId,
            bookedSeat.eventId,
            bookedSeat.seatId,
            bookedSeats.length,
            {client:trx}
          )
          await TicketService.buyTicket(
            ticket,
            { client: trx }
          )
          await Seat.query({ client: trx })
            .where('id', bookedSeat.seatId)
            .update('status', SeatStatus.BOOKED)
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
    const seats = (await Seat.findManyBy({ eventId: eventId })).reduce((acc, seat) => {
      acc[seat.id] = {id: seat.id, status:seat.status}
      return acc
    }, {} as Record<number, {id:number, status:SeatStatus}>)

    const lockedSeats = await SeatCacheModel.find({ eventId: eventId })
    lockedSeats.forEach((seat) => {
      seats[seat.seatId].status = SeatStatus.LOCKED
    })
    return Object.values(seats)
  }
}
