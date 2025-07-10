import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import FormSubmission from '#modules/form-builder/models/FormSubmission'
import Event from '#modules/events/models/Event'
import { FieldType } from '#contracts/form-builder/enums/FieldType'

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  validation?: string[]
}

export default class Form extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare eventId: number

  @column({
    prepare: (value: FormField[]) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value),
  })
  declare fields: FormField[]

  @hasMany(() => FormSubmission)
  declare submissions: HasMany<typeof FormSubmission>

  @belongsTo(() => Event)
  declare event: BelongsTo<typeof Event>
}
