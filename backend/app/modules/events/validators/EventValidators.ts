import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const createEventValidator = vine.compile(
  vine.object({
    organizerId: vine.number().positive().withoutDecimals(),
    title: vine.string().minLength(1),
    description: vine.string().minLength(1),
    location: vine.string().minLength(1),
    basePrice: vine.number().min(0),
    currency: vine.string().minLength(3).maxLength(3),
    startsAt: vine.date().transform((date) => DateTime.fromJSDate(date)),
    endsAt: vine.date().afterField('startsAt', {compare: "hours"}).transform((date) => DateTime.fromJSDate(date)),
    earlyBirdEndsAt: vine.date().afterField('startsAt', {compare: "hours"}).transform((date) => DateTime.fromJSDate(date)),
    capacity: vine.number().positive().withoutDecimals(),
  })
)

export const updateEventValidator = vine.compile(
  vine.object({
    organizerId: vine.number().positive().withoutDecimals(),
    title: vine.string().minLength(1),
    description: vine.string().minLength(1),
    location: vine.string().minLength(1),
    basePrice: vine.number().min(0),
    currency: vine.string().minLength(3).maxLength(3),
    startsAt: vine.date().transform((date) => DateTime.fromJSDate(date)),
    endsAt: vine.date().afterField('startsAt').transform((date) => DateTime.fromJSDate(date)),
    earlyBirdEndsAt: vine.date().afterField('startsAt', {compare: "hours"}).transform((date) => DateTime.fromJSDate(date)),
    capacity: vine.number().positive().withoutDecimals(),
  })
)
