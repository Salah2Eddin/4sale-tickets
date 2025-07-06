import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Event from '../../events/models/Event.js'

export default class Waitlist extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare eventId: number

  @belongsTo(() => Event)
  declare event: BelongsTo<typeof Event>
}
