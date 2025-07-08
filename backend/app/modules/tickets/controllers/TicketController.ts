'use strict'

import type { HttpContext } from '@adonisjs/core/http'

import TicketService from '#modules/tickets/services/TicketService'
import SeatLockService from '#modules/tickets/services/SeatLockService'

export default class TicketController {
  public async create({ request, response }: HttpContext) {
    const { user_id, event_id, seat_id , ticket_count} = request.only(['user_id', 'event_id', 'seat_id', 'ticket_count'])

    try {
      const ticket = await TicketService.createTicket(user_id, event_id, seat_id,ticket_count )
      return response.status(201).json({ message: 'Ticket created', ticket })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  public async getAll({ response }: HttpContext) {
    const tickets = await TicketService.getAllTickets()
    return response.ok(tickets)
  }

  public async getOne({ params, response }: HttpContext) {
    const ticket = await TicketService.getTicketById(params.id)

    if (!ticket) {
      return response.notFound({ error: 'Ticket not found' })
    }

    return response.ok(ticket)
  }

  public async updateOne({ params, request, response }: HttpContext) {
    const data = request.only(['status', 'checkedIn', 'userId', 'eventId', 'seatId'])

    const ticket = await TicketService.updateTicket(params.id, data)

    if (!ticket) {
      return response.notFound({ error: 'Ticket not found' })
    }

    return response.ok(ticket)
  }

  public async deleteOne({ params, response }: HttpContext) {
    const ticket = await TicketService.deleteTicket(params.id)

    if (!ticket) {
      return response.notFound({ error: 'Ticket not found' })
    }

    await ticket.delete()
    return response.ok({ message: 'Ticket deleted successfully' })
  }

  public async userTickets({ params, response }: HttpContext) {
    const tickets = await TicketService.getUserTickets(params.userId)

    return response.ok(tickets)
  }

  public async eventTickets({ params, response }: HttpContext) {
    const tickets = await TicketService.getEventTickets(params.eventId)

    return response.ok(tickets)
  }

  public async bulkCheckIn({ request, response }: HttpContext) {
    const ticketIds = request.input('ticket_ids')

    if (!Array.isArray(ticketIds)) {
      return response.badRequest({ error: 'Ticket ids should be an array' })
    }

    const updatedTickets = await TicketService.bulkCheckIn(ticketIds)

    return response.ok({ updated: updatedTickets })
  }
  //seats 

  public async lockSeat({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const { eventId, seatId } = request.only(['eventId', 'seatId'])
    const seat = await SeatLockService.lockSeat(eventId, seatId, user.id)
    return response.ok({ message: 'Seat locked', seat })
  }

  public async unlockSeat({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const { eventId, seatId } = request.only(['eventId', 'seatId'])
    const seat = await SeatLockService.unlockSeat(eventId, seatId, user.id)
    return response.ok({ message: 'Seat unlocked', seat })
  }

  public async bookSeat({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const { eventId, seatId } = request.only(['eventId', 'seatId'])
    const seat = await SeatLockService.bookSeat(eventId, seatId, user.id)
    return response.ok({ message: 'Seat booked', seat })
  }

  public async getSeatsByEvent({ params, response }: HttpContext) {
    const seats = await SeatLockService.getSeatsForEvent(Number(params.eventId))
    return response.ok(seats)
  }
}
