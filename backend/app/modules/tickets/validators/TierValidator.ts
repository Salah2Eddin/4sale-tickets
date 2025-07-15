import vine from '@vinejs/vine'

export const createTierValidator = vine.compile(
  vine.object({
    name: vine.string(),
    price: vine.number().positive(),
    capacity: vine.number().min(1).withoutDecimals(),
    eventId: vine.number().positive().withoutDecimals(),
  })
)

export const updateTierValidator = vine.compile(
    vine.object({
      name: vine.string().optional(),
      price: vine.number().positive().optional(),
      capacity: vine.number().min(1).withoutDecimals().optional(),
      eventId: vine.number().positive().withoutDecimals().optional(),
    })
  )