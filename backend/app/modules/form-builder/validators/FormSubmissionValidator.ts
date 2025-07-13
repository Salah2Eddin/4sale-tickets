import vine from '@vinejs/vine'

export const createFormSubmissionValidator = vine.compile(
  vine.object({
    ticketId: vine.number().withoutDecimals().positive(),
    data: vine.record(vine.any()),
  })
)