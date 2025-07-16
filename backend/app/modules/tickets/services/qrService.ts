import QRCode from 'qrcode'
import { promises as fs } from 'fs'
import path from 'path'

export async function generateTicketQR(ticketId: number): Promise<string> {
  const url = JSON.stringify({id: ticketId})

  const outputDir = path.resolve('./public/qrcodes')
  await fs.mkdir(outputDir, { recursive: true })

  const filePath = path.join(outputDir, `ticket-${ticketId}.png`)
  await QRCode.toFile(filePath, url, {
    errorCorrectionLevel: 'M',
    width: 300,
    margin: 2
  })

  return filePath
}
