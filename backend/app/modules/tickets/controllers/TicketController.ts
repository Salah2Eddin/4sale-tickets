'use strict'

import type { HttpContext } from '@adonisjs/core/http'

import User from '../../users/models/User.js'
import Event from '../../events/models/Event.js'
import Seat from '../../tickets/models/Seat.js'
import Ticket from '../../tickets/models/Ticket.js'

import { generateTicketQR } from '../services/qrService.js'

export default class TicketController {
  public async create({ request, response }: HttpContext) {
    const { user_id, event_id, seat_id } = request.only(['user_id', 'event_id', 'seat_id'])

    const user = await User.find(user_id)
    const event = await Event.find(event_id)
    const seat = await Seat.find(seat_id)

    if (!user || !event || !seat) {
      return response.status(400).json({ error: 'Invalid user, event, or seat' })
    }

    const ticket = await Ticket.create({
      userId: user_id,
      eventId: event_id,
      seatId: seat_id,
      status: 'valid',
      checkedIn: false,
    })

    await generateTicketQR(ticket.id)

    return response.status(201).json({
      message: 'Ticket created and QR generated',
      ticket,
    })
  }
}