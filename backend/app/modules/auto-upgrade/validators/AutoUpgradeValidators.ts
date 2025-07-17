import vine from '@vinejs/vine'

export const subscribeValidator = vine.compile(
  vine.object({
    ticketId: vine.number().withoutDecimals().positive(),
    targetTierId: vine.number().withoutDecimals().positive(),
  })
)
export const upgradeValidator = vine.compile(
  vine.object({
    ticketId: vine.number().withoutDecimals().positive(),
    seatId: vine.number().withoutDecimals().positive(),
  })
)
