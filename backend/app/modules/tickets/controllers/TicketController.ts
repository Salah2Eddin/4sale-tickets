'use strict'

import type { HttpContext } from '@adonisjs/core/http'

import TicketService from '#modules/tickets/services/TicketService'
import SeatLockService from '#modules/tickets/services/SeatLockService'
import { bookSeatsValidator, bulkCheckInValidator, createTicketValidator, eventIdValidator, seatValidator, ticketIdValidator, updateTicketValidator, userIdValidator } from '#modules/tickets/validators/TicketValidators'

export default class TicketController {
  public async create({ request, response }: HttpContext) {
    const { user_id, event_id, seat_id, ticket_count } = await request.validateUsing(createTicketValidator)

    try {
      const ticket = await TicketService.createTicket(user_id, event_id, seat_id, ticket_count)
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
    const { id } = await ticketIdValidator.validate(params)
    const ticket = await TicketService.getTicketById(id)

    if (!ticket) {
      return response.notFound({ error: 'Ticket not found' })
    }

    return response.ok(ticket)
  }

  public async updateOne({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(updateTicketValidator)

    const ticket = await TicketService.updateTicket(params.id, data)

    if (!ticket) {
      return response.notFound({ error: 'Ticket not found' })
    }

    return response.ok(ticket)
  }

  public async deleteOne({ params, response }: HttpContext) {
    const { id } = await ticketIdValidator.validate(params)
    const ticket = await TicketService.deleteTicket(id)

    if (!ticket) {
      return response.notFound({ error: 'Ticket not found' })
    }

    return response.ok({ message: 'Ticket deleted successfully' })
  }

  public async userTickets({ params, response }: HttpContext) {
    const { userId } = await userIdValidator.validate(params)
    const tickets = await TicketService.getUserTickets(userId)

    return response.ok(tickets)
  }

  public async eventTickets({ params, response }: HttpContext) {
    const { eventId } = await eventIdValidator.validate(params)
    const tickets = await TicketService.getEventTickets(eventId)

    return response.ok(tickets)
  }

  public async bulkCheckIn({ request, response }: HttpContext) {
    const { ticket_ids } = await request.validateUsing(bulkCheckInValidator)

    const updatedTickets = await TicketService.bulkCheckIn(ticket_ids)

    return response.ok({ updated: updatedTickets })
  }

  public async refund({params, response}: HttpContext){
    const ticket = await TicketService.getTicketById(params.id)
    if(!ticket){
      return response.notFound()
    }
    await TicketService.refundTicket(ticket)
    return response.ok({message:"refunded ticket"})
  }
  //seats

  public async lockSeat({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const { seatId } = await request.validateUsing(seatValidator)

    const seat = await SeatLockService.lockSeat(seatId, user.id)
    return response.ok({ message: 'Seat locked', seat })
  }

  public async unlockSeat({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const { seatId } = await request.validateUsing(seatValidator)

    const seat = await SeatLockService.unlockSeat(seatId, user.id)
    return response.ok({ message: 'Seat unlocked', seat })
  }

  public async bookSeat({ request, auth, response }: HttpContext) {
    const bookedSeats = await request.validateUsing(bookSeatsValidator)

    const seat = await SeatLockService.bookSeats(bookedSeats.seats, auth.user!.id)
    return response.ok({ message: 'Seat booked', seat })
  }

  public async getSeatsByEvent({ params, response }: HttpContext) {
    const { eventId } = await eventIdValidator.validate(params)
    const seats = await SeatLockService.getSeatsForEvent(eventId)
    return response.ok(seats)
  }

  // public async buyTicket({ request, auth, response }: HttpContext) {
  //   const user = auth.user!
  //   const { eventId, tierId, currency } = request.only(['eventId', 'tierId', 'currency'])

  //   const ticket = await TicketService.buyTicket()
  //   return response.created({ ticket })
  // }

  public async resellTicket({ request, auth, response }: HttpContext) {
    const seller = auth.user!
    const { buyerId, ticketId, price } = request.only(['buyerId', 'ticketId', 'price'])

    const ticket = await TicketService.resellTicket(seller.id, buyerId, ticketId, price)
    return response.ok({ ticket })
  }
  
}
