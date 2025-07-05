const { readJson, writeJson } = require('../../jsonUtils')
const { generateTicketQR } = require('../Services/qrService')

class TicketController {
  async create({ request, response }) {
    const { user_id, event_id, seat_id } = request.only(['user_id', 'event_id', 'seat_id'])

    const tickets = await readJson('tickets.json')
    const users = await readJson('users.json')
    const events = await readJson('events.json')
    const seats = await readJson('seats.json')

    const user = users.find(u => u.id === user_id)
    const event = events.find(e => e.id === event_id)
    const seat = seats.find(s => s.id === seat_id)

    if (!user || !event || !seat) {
      return response.status(400).json({ error: 'Invalid user, event, or seat' })
    }

    const ticketId = tickets.length + 1
    const newTicket = {
      id: ticketId,
      user_id,
      event_id,
      seat_id,
      status: 'valid',
      checked_in: false
    }

    tickets.push(newTicket)
    await writeJson('tickets.json', tickets)

    await generateTicketQR(newTicket.id)

    return response.status(201).json({ message: 'Ticket created and QR generated', ticket: newTicket })
  }
}

module.exports = TicketController