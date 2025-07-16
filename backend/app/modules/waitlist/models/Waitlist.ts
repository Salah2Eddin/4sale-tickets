import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#modules/users/models/User'
import Event from '#modules/events/models/Event'
import Tier  from '#modules/tickets/models/Tier'
import { DateTime } from 'luxon'

export default class Waitlist extends BaseModel {
  @column({ isPrimary: true }) declare id: number
  @column() declare userId: number
  @column() declare eventId: number
  @column() declare tierId: number | null
  @column() declare status: 'waiting' | 'notified' | 'expired' | 'declined' | 'bought'
  @column.dateTime() declare notifiedAt: DateTime | null
  @column.dateTime() declare expiresAt: DateTime | null
  @column.dateTime() declare createdAt: DateTime | null

  @belongsTo(() => User)  declare user:  BelongsTo<typeof User>
  @belongsTo(() => Event) declare event: BelongsTo<typeof Event>
  @belongsTo(() => Tier)  declare tier:  BelongsTo<typeof Tier>
}