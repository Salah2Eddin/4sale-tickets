const QRCode = require('qrcode')
const fs = require('fs/promises')
const path = require('path')

const User = use('App/Modules/Users/Models/User')
const Event = use('App/Modules/Events/Models/Event')
const Seat = use('App/Modules/Seats/Models/Seat')
const Ticket = use('App/Modules/Tickets/Models/Ticket')

async function generateTicketQR(ticketId) {
  // Use localhost URL since you're scanning from the same machine
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

module.exports = { generateTicketQR }