import QRCode from 'qrcode'
import { promises as fs } from 'fs'
import path from 'path'
import Ticket from '#modules/tickets/models/Ticket'

export async function generateTicketQR(ticket: Ticket): Promise<string> {
  const content = JSON.stringify({ id: ticket.id, seat: ticket.seatId, event: ticket.eventId, user: ticket.userId })

  const outputDir = path.resolve('./public/qrcodes')
  await fs.mkdir(outputDir, { recursive: true })

  const filePath = path.join(outputDir, `ticket-${ticket.id}.png`)
  await QRCode.toFile(filePath, content, {
    errorCorrectionLevel: 'M',
    width: 300,
    margin: 2
  })

  return filePath
}
