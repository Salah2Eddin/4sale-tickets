import User from '#modules/users/models/User'
import Event from '#modules/events/models/Event'
import Seat from '#modules/tickets/models/Seat'
import Ticket from '#modules/tickets/models/Ticket'
import WalletService from '#modules/wallet/services/WalletService'
import CurrencyConverterService from '#modules/wallet/services/CurrencyConverterService'

import { generateTicketQR } from '#modules/tickets/services/qrService'
import { DateTime } from 'luxon'

export default class TicketService {
    static async validateTicketOwner(ticketId:number, userId:number): Promise<boolean>{
        const ticket = await Ticket.findOrFail(ticketId)
        return ticket.userId == userId
    }

    static async createTicket(userId: number, eventId: number, tierId: number, ticketCount: number)
 {
        const user = await User.find(userId)
        const event = await Event.find(eventId)
        if (!user || !event ) {
            throw new Error('Invalid user, event, or seat' )
        }

        const seat = await Seat.query()
            .where('tier_id', tierId)
            .where('event_id', eventId)
            .where('is_taken', false)
            .first()

        if (!seat) {
            throw new Error('No available seat for this tier')
        }

        await seat.load('tier')
        const basePrice = seat.tier.price

        let price = basePrice
        price = this.applyEarlyBird(price, event)
        price = this.applyTimeBased(price, event)
        price = this.applyGroupDiscount(price, ticketCount)
    
        const ticket = await Ticket.create({
            userId,
            eventId,
            seatId: seat.id,
            status: 'valid',
            checkedIn: false,
            price
        })

        seat.isTaken = true
        await seat.save()


        await generateTicketQR(ticket.id)

        return ticket
    }

    static applyEarlyBird(price: number, event: Event): number {
    const now = DateTime.now()
    const earlyBirdEnd = event.earlyBirdEndsAt

    if (earlyBirdEnd && now <= earlyBirdEnd) {
      return price * 0.8 // 20% discount
    }
    return price
  }

    static applyTimeBased(price: number, event: Event): number {
        const now = DateTime.now()
        const createdAt = event.createdAt
        const eventStart = event.startsAt

        if (!createdAt || !eventStart || now <= createdAt) return price

        const totalDuration = eventStart.diff(createdAt, 'days').days
        const elapsed = now.diff(createdAt, 'days').days

        if (totalDuration <= 0 || elapsed <= 0) return price

        const stepCount = Math.floor(elapsed / (totalDuration / 4)) // increase 25% - 4 times
        return price * (1 + 0.25 * Math.min(stepCount, 4))
    }

    static applyGroupDiscount(price: number, ticketCount: number): number {
        const groupSize = Math.floor(ticketCount / 5)
        return price * (1 - 0.15 * groupSize)
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

    static async buyTicket(userId: number, eventId: number, tierId: number, currency: string) {
    const user = await User.findOrFail(userId)
    const event = await Event.findOrFail(eventId)

    const seat = await Seat.query()
        .where('tierId', tierId)
        .whereNotExists((builder) => {
        builder.from('tickets').whereRaw('tickets.seat_id = seats.id')
        })
        .first()

    if (!seat) throw new Error('No available seats for this tier')

    if (!user.isVerified) {
    throw new Error('User is not verified')
    }

    await seat.load('tier')
    let priceInEgp = seat.tier.price

    priceInEgp = this.applyEarlyBird(priceInEgp, event)
    priceInEgp = this.applyTimeBased(priceInEgp, event)

    const finalPrice = await CurrencyConverterService.convert(priceInEgp, currency)

    const success = await WalletService.deduct(userId, finalPrice)
    if (!success) throw new Error('Insufficient balance')

    const ticket = await Ticket.create({
        userId,
        eventId,
        seatId: seat.id,
        status: 'valid',
        checkedIn: false,
        price: finalPrice
    })

    await generateTicketQR(ticket.id)
    return ticket
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