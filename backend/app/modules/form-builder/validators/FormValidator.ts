import { FieldType } from '#contracts/form-builder/enums/FieldType'
import vine from '@vinejs/vine'

const fieldValidatorExpression = vine.object({
  id: vine.string().trim().minLength(1),
  type: vine.enum(FieldType),
  label: vine.string().trim().minLength(1),
  placeholder: vine.string().trim().optional(),
  required: vine.boolean(),
  options: vine.array(vine.string().trim()).optional(),
  validation: vine.array(vine.string().trim()).optional(),
})

export const createFormValidator = vine.compile(
  vine.object({
    eventId: vine.number().positive().withoutDecimals(),
    fields: vine.array(fieldValidatorExpression).minLength(1),
  })
)
export const updateFormValidator = vine.compile(
  vine.object({
    fields: vine.array(fieldValidatorExpression).minLength(1).optional(),
  })
)
