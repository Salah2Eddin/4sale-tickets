import vine from '@vinejs/vine'

export const waitlistSubscriptionValidator = vine.compile(
  vine.object({
    eventId: vine.number().positive().withoutDecimals(),
    tierId: vine.number().positive().withoutDecimals(),
  })
)

export const waitlistResponseValidator = vine.compile(
  vine.object({
    waitlistId: vine.number().positive().withoutDecimals(),
    accept: vine.boolean(),
  })
)