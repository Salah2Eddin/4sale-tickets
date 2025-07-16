import vine from '@vinejs/vine'

export const createEventOrganizerValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8)
  })
)

export const createAdminValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8),
    abilities: vine.array(vine.string()),
  })
)
export const updateAdminValidator = vine.compile(
  vine.object({
    email: vine.string().email().optional(),
    password: vine.string().minLength(8).optional(),
    abilities: vine.array(vine.string()).optional(),
  })
)
export const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8),
  })
)
export const addEventValidator = vine.compile(
  vine.object({
    title: vine.string(),
    description: vine.string(),
    startDate: vine.date(),
    endDate: vine.date(),
    organizerId: vine.number().positive().withoutDecimals(),
  })
)
export const addMoneyValidator = vine.compile(
  vine.object({
    userId: vine.number().positive().withoutDecimals(),
    amount: vine.number().positive(),
  })
)




export const generateTicketValidator = vine.compile(
  vine.object({
    userId: vine.number().positive().withoutDecimals(),
    eventId: vine.number().positive().withoutDecimals(),
    seatId: vine.number().positive().withoutDecimals(),
    ticketCount: vine.number().positive().min(1),
  })
)