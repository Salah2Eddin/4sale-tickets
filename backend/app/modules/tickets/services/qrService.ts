import QRCode from 'qrcode'
import { promises as fs } from 'fs'
import path from 'path'

import User from '@modules/users/models/User.js'
import Event from '@modules/events/models/Event.js'
import Seat from '@modules/tickets/models/Seat.js'
import Ticket from '@modules/tickets/models/Ticket.js'

export async function generateTicketQR(ticketId: number): Promise<string> {
  const url = `http://localhost:3333/tickets/${ticketId}`

  const outputDir = path.resolve(__dirname, '../../../../public/qrcodes')
  await fs.mkdir(outputDir, { recursive: true })

  const filePath = path.join(outputDir, `ticket-${ticketId}.png`)
  await QRCode.toFile(filePath, url, {
    errorCorrectionLevel: 'M',
    width: 300,
    margin: 2
  })

  return filePath
}
