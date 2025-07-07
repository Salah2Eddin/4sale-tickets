'use strict'

import User from '../../users/models/User.js'
import Event from '../../events/models/Event.js'
import Seat from '../../tickets/models/Seat.js'
import Ticket from '../../tickets/models/Ticket.js'

import { generateTicketQR } from './qrService.js'

export default class TicketService {
    static async createTicket(userId: number, eventId: number, seatId: number) {
        const user = await User.find(userId)
        const event = await Event.find(eventId)
        const seat = await Seat.find(seatId)
    
        if (!user || !event || !seat) {
            throw new Error('Invalid user, event, or seat' )
        }
    
        const ticket = await Ticket.create({
            userId,
            eventId,
            seatId,
            status: 'valid',
            checkedIn: false,
        })

        await generateTicketQR(ticket.id)

        return ticket
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