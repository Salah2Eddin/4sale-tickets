'use strict'

import User from '../../users/models/User.js'
import Event from '../../events/models/Event.js'
import Seat from '../../tickets/models/Seat.js'
import Ticket from '../../tickets/models/Ticket.js'

import { generateTicketQR } from './qrService.js'
import { DateTime } from 'luxon'

export default class TicketService {
    static async createTicket(userId: number, eventId: number, seatId: number, ticketCount: number) {
        const user = await User.find(userId)
        const event = await Event.find(eventId)
        const seat = await Seat.find(seatId)
    
        if (!user || !event || !seat) {
            throw new Error('Invalid user, event, or seat' )
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
            seatId,
            status: 'valid',
            checkedIn: false,
            price
        })

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
}