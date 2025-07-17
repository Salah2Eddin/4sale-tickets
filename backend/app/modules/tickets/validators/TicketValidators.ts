import vine from '@vinejs/vine'

export const createTicketValidator = vine.compile(
  vine.object({
    user_id: vine.number().positive().withoutDecimals(),
    event_id: vine.number().positive().withoutDecimals(),
    seat_id: vine.number().positive().withoutDecimals(),
    ticket_count: vine.number().positive().min(1),
  })
)

export const updateTicketValidator = vine.compile(
  vine.object({
    status: vine.string().optional(),
    checkedIn: vine.boolean().optional(),
    userId: vine.number().positive().withoutDecimals().optional(),
    eventId: vine.number().positive().withoutDecimals().optional(),
    seatId: vine.number().positive().withoutDecimals().optional(),
  })
)


export const ticketIdValidator = vine.compile(
  vine.object({
    id: vine.number().positive().withoutDecimals(),
  })
)

export const userIdValidator = vine.compile(
  vine.object({
    userId: vine.number().positive().withoutDecimals(),
  })
)

export const eventIdValidator = vine.compile(
  vine.object({
    eventId: vine.number().positive().withoutDecimals(),
  })
)

export const bulkCheckInValidator = vine.compile(
  vine.object({
    ticket_ids: vine.array(
      vine.number().positive().withoutDecimals()
    ).minLength(1),
  })
)

export const seatValidator = vine.compile(
  vine.object({
    eventId: vine.number().positive().withoutDecimals(),
    seatId: vine.number().positive().withoutDecimals(),
  })
)

export const bookSeatsValidator = vine.compile(
  vine.object({
    seats: vine.array(
      vine.object({
        eventId: vine.number().positive().withoutDecimals(),
        seatId: vine.number().positive().withoutDecimals(),
        autoUpgrade: vine.object({
          targetTierId: vine.number().positive().withoutDecimals()
        }).optional()
      })
    )
  })
)

export const eventParamValidator = vine.compile(
  vine.object({
    eventId: vine.number().positive().withoutDecimals(),
  })
)