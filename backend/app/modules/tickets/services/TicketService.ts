import User from '#modules/users/models/User'
import Event from '#modules/events/models/Event'
import Seat from '#modules/tickets/models/Seat'
import Ticket from '#modules/tickets/models/Ticket'
import WalletService, { SYSTEM_WALLET_ID } from '#modules/wallet/services/WalletService'
import CurrencyConverterService from '#modules/wallet/services/CurrencyConverterService'

import { generateTicketQR } from '#modules/tickets/services/qrService'
import { DateTime } from 'luxon'
import { SeatStatus } from '#contracts/tickets/enums/SeatStatus'
import { TicketStatus } from '#contracts/tickets/enums/TicketStatus'

export default class TicketService {
  static async validateTicketOwner(ticketId: number, userId: number): Promise<boolean> {
    const ticket = await Ticket.findOrFail(ticketId)
    return ticket.userId == userId
  }

  static async createTicket(
    userId: number,
    eventId: number,
    seatId: number,
    ticketCount: number,
    options?: { client?: any }
  ) {
    await User.findOrFail(userId)
    const event = await Event.findOrFail(eventId)

    const seat = await Seat.query(options)
      .where('id', seatId)
      .where('status', SeatStatus.AVAILABLE)
      .firstOrFail()

    await seat.load('tier')
    const basePrice = seat.tier.price

    const ticket = new Ticket()
    if (options?.client) {
      ticket.useTransaction(options.client)
    }

    let price = await CurrencyConverterService.convert(basePrice, event.currency)
    price = this.applyEarlyBird(price, event)
    price = this.applyTimeBased(price, event)
    price = this.applyGroupDiscount(price, ticketCount)

    ticket.merge({
      userId: userId,
      eventId: eventId,
      seatId: seat.id,
      status: TicketStatus.BOOKED,
      checkedIn: false,
      price: price,
    })

    await this.buyTicket(ticket)

    await ticket.save()

    await generateTicketQR(ticket)

    return ticket
  }

  static applyEarlyBird(price: number, event: Event): number {
    const DISCOUNT_PERC = 0.2
    const now = DateTime.now()
    const earlyBirdEnd = event.earlyBirdEndsAt

    if (earlyBirdEnd && now <= earlyBirdEnd) {
      const newPrice = price * (1 - DISCOUNT_PERC)
      return newPrice
    }
    return price
  }

  static applyTimeBased(price: number, event: Event): number {
    // increase 25% - 4 times
    const NO_DISCOUNT_STEPS = 4
    const DISCOUNT_PERC = 0.25

    const now = DateTime.now()
    const createdAt = event.createdAt
    const eventStart = event.startsAt

    if (!createdAt || !eventStart || now <= createdAt) return price

    const totalDuration = eventStart.diff(createdAt, 'days').days
    const elapsed = now.diff(createdAt, 'days').days

    if (totalDuration <= 0 || elapsed <= 0) return price

    const stepCount = Math.floor(elapsed / (totalDuration / NO_DISCOUNT_STEPS))
    const newPrice = price * (1 + DISCOUNT_PERC * Math.min(stepCount, NO_DISCOUNT_STEPS))
    return newPrice
  }

  static applyGroupDiscount(price: number, ticketCount: number): number {
    const MIN_GROUP_SIZE = 5
    const DISCOUNT_PERC = 0.15

    const groupSize = Math.floor(ticketCount / MIN_GROUP_SIZE)
    const newPrice = price * (1 - DISCOUNT_PERC * groupSize)
    return newPrice
  }

  static async getAllTickets() {
    return Ticket.all()
  }

  static async getTicketById(id: number) {
    return Ticket.find(id)
  }

  static async updateTicket(id: number, data: Partial<Ticket>) {
    const ticket = await Ticket.find(id)
    if (!ticket) return null
    ticket.merge(data)
    await ticket.save()
    return ticket
  }

  static async deleteTicket(id: number) {
    const ticket = await Ticket.find(id)
    if (!ticket) return null
    await ticket.delete()
    return ticket
  }

  static async getUserTickets(userId: number) {
    return Ticket.query().where('userId', userId)
  }

  static async getEventTickets(eventId: number) {
    return Ticket.query().where('eventId', eventId)
  }

  static async bulkCheckIn(ticketIds: number[]) {
    const result = []

    for (const id of ticketIds) {
      const ticket = await Ticket.find(id)
      if (ticket && ticket.status === 'valid' && !ticket.checkedIn) {
        ticket.checkedIn = true
        await ticket.save()
        result.push({ id: ticket.id, checkedIn: true })
      } else {
        result.push({ id, checkedIn: false, reason: 'Invalid check-in' })
      }
    }

    return result
  }

  static async buyTicket(ticket: Ticket, options?: { client?: any }) {
    await WalletService.makeTransaction(ticket.userId, SYSTEM_WALLET_ID, ticket.price, options)
    // return true
  }

  static async resellTicket(sellerId: number, buyerId: number, ticketId: number, price: number) {
    const ticket = await Ticket.findOrFail(ticketId)

    if (ticket.userId !== sellerId) {
      throw new Error('Unauthorized: You do not own this ticket')
    }

    if (ticket.status !== 'valid') {
      throw new Error('Ticket is not eligible for resale')
    }

    await WalletService.makeTransaction(buyerId, sellerId, price)

    ticket.userId = buyerId
    await ticket.save()

    return ticket
  }
}