import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Form from '#modules/form-builder/models/FormSubmission'
import Ticket from '#modules/tickets/models/Ticket'

export default class FormSubmission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare formId: number

  @column()
  declare ticketId: number

  @column({
    prepare: (value: Record<string, any>) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value),
  })
  declare data: Record<string, any>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Form, {foreignKey: "formId"})
  declare form: BelongsTo<typeof Form>

  @belongsTo(() => Ticket)
  declare ticket: BelongsTo<typeof Ticket>
}